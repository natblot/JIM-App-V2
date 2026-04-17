/* eslint-disable no-console */
// Seed E2E paiement — titulaire + remplacant + annonce + candidature + contrat confirme
// Usage :
//   SUPABASE_SERVICE_ROLE_KEY=... STRIPE_SECRET_KEY=sk_test_... \
//     npx tsx frontend/apps/web/src/scripts/seed-e2e-payment.ts
//
// Apres execution, vous obtenez les credentials de Sophie (titulaire) et Lucas (remplacant)
// plus les IDs du contrat pour tester le flow Dashboard -> Paiements -> Creer versement.

import { createClient } from '@supabase/supabase-js';

// Stripe SDK pas dispo en workspace web — on tape l'API REST directement
async function stripeRequest(
  method: 'GET' | 'POST',
  path: string,
  params?: Record<string, string>,
): Promise<Record<string, unknown>> {
  const url = `https://api.stripe.com/v1${path}`;
  const body = params
    ? Object.entries(params)
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
        .join('&')
    : undefined;
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
      'Stripe-Version': '2024-12-18.acacia',
      ...(body ? { 'Content-Type': 'application/x-www-form-urlencoded' } : {}),
    },
    body,
  });
  const json = (await res.json()) as Record<string, unknown>;
  if (!res.ok) {
    const msg = (json.error as { message?: string })?.message ?? JSON.stringify(json);
    throw new Error(`Stripe ${method} ${path}: ${msg}`);
  }
  return json;
}

// --- Config ---

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://xfgktshirllqesnwmwpm.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

if (!SERVICE_ROLE_KEY || !SERVICE_ROLE_KEY.startsWith('eyJ')) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY manquante ou invalide');
  process.exit(1);
}
if (!STRIPE_SECRET_KEY || !STRIPE_SECRET_KEY.startsWith('sk_test_')) {
  console.error('❌ STRIPE_SECRET_KEY manquante ou non-test');
  process.exit(1);
}

const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});


// --- Personas ---

const SOPHIE = {
  email: 'sophie.marchand.test@jim-app.fr',
  password: 'TestJim2026!',
  first_name: 'Sophie',
  last_name: 'Marchand',
  role: 'titulaire' as const,
  rpps_number: '10100000001',
  city: 'Lyon',
  specialties: ['respiratoire', 'musculo-squelettique'],
};

const LUCAS = {
  email: 'lucas.petit.test@jim-app.fr',
  password: 'TestJim2026!',
  first_name: 'Lucas',
  last_name: 'Petit',
  role: 'remplacant' as const,
  rpps_number: '10100000002',
  city: 'Paris',
  specialties: ['sport', 'musculo-squelettique'],
};

// --- Helpers ---

async function createOrGetAuthUser(
  email: string,
  password: string,
  meta: Record<string, string>,
): Promise<string> {
  // 1er essai : creation
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: meta,
  });
  if (!error && data.user) return data.user.id;

  // Si deja cree -> recuperer
  if (error && error.message.includes('already been registered')) {
    const { data: users } = await admin.auth.admin.listUsers();
    const existing = users.users.find((u) => u.email === email);
    if (existing) return existing.id;
  }
  throw error ?? new Error(`Impossible de creer/recuperer ${email}`);
}

async function upsertProfile(
  userId: string,
  persona: typeof SOPHIE | typeof LUCAS,
  stripeAccountId: string,
): Promise<void> {
  // La migration 008 cree le profile auto via trigger handle_new_user.
  // On met juste a jour les flags metier.
  const { error } = await admin
    .from('profiles')
    .update({
      first_name: persona.first_name,
      last_name: persona.last_name,
      rpps_number: persona.rpps_number,
      rpps_verified: true,
      rpps_verified_at: new Date().toISOString(),
      city: persona.city,
      specialties: persona.specialties,
      cgu_accepted_at: new Date().toISOString(),
      stripe_account_id: stripeAccountId,
      stripe_onboarding_status: 'verified',
      rcp_verified: true,
      launch_period_active: false, // commission 1% activee pour valider le calcul
      is_pro: false,
    })
    .eq('user_id', userId);
  if (error) throw error;
}

// Cree un Stripe Express (sandbox) — capability transfers + metadata jim
async function createVerifiedStripeExpress(email: string, userId: string): Promise<string> {
  const account = await stripeRequest('POST', '/accounts', {
    type: 'express',
    country: 'FR',
    email,
    'capabilities[card_payments][requested]': 'true',
    'capabilities[transfers][requested]': 'true',
    business_type: 'individual',
    'metadata[jim_user_id]': userId,
  });
  return account.id as string;
}

// --- Seed main ---

async function main() {
  console.log('🌱 Seed E2E paiement JIM\n' + '='.repeat(50));

  // 1. Creer auth users
  console.log('\n📝 Auth users');
  const sophieId = await createOrGetAuthUser(SOPHIE.email, SOPHIE.password, {
    role: SOPHIE.role,
    first_name: SOPHIE.first_name,
    last_name: SOPHIE.last_name,
  });
  console.log(`  ✅ Sophie: ${sophieId}`);
  const lucasId = await createOrGetAuthUser(LUCAS.email, LUCAS.password, {
    role: LUCAS.role,
    first_name: LUCAS.first_name,
    last_name: LUCAS.last_name,
  });
  console.log(`  ✅ Lucas : ${lucasId}`);

  // 2. Stripe Express accounts
  console.log('\n💳 Stripe Express accounts');
  // Re-use si deja present dans profiles
  const { data: existingProfiles } = await admin
    .from('profiles')
    .select('user_id, stripe_account_id')
    .in('user_id', [sophieId, lucasId]);

  const existingById = new Map(
    (existingProfiles ?? []).map((p) => [p.user_id as string, p.stripe_account_id as string | null]),
  );

  const sophieStripe =
    existingById.get(sophieId) ?? (await createVerifiedStripeExpress(SOPHIE.email, sophieId));
  console.log(`  ✅ Sophie Stripe: ${sophieStripe}`);
  const lucasStripe =
    existingById.get(lucasId) ?? (await createVerifiedStripeExpress(LUCAS.email, lucasId));
  console.log(`  ✅ Lucas  Stripe: ${lucasStripe}`);

  // 3. Upsert profiles (flip rpps_verified + rcp_verified + stripe_onboarding_status)
  console.log('\n👤 Profiles');
  await upsertProfile(sophieId, SOPHIE, sophieStripe);
  console.log(`  ✅ Sophie profile updated (rpps ✓ rcp ✓ stripe_verified ✓)`);
  await upsertProfile(lucasId, LUCAS, lucasStripe);
  console.log(`  ✅ Lucas  profile updated (rpps ✓ rcp ✓ stripe_verified ✓)`);

  // 4. Annonce de Sophie
  console.log('\n📋 Annonce');
  const { data: existingAnnonce } = await admin
    .from('annonces')
    .select('id')
    .eq('profile_id', sophieId)
    .eq('type_annonce', 'remplacement')
    .eq('ville', 'Lyon')
    .limit(1);
  let annonceId: string;
  if (existingAnnonce && existingAnnonce.length > 0) {
    annonceId = existingAnnonce[0].id as string;
    console.log(`  ♻️  Annonce existante: ${annonceId}`);
  } else {
    const { data, error } = await admin
      .from('annonces')
      .insert({
        profile_id: sophieId,
        type_annonce: 'remplacement',
        date_debut: '2026-07-01',
        date_fin: '2026-07-31',
        retrocession: 80,
        description: 'Cabinet bien situe proche Part-Dieu. Specialites respiratoire + musculo. Patientele fidele.',
        ville: 'Lyon',
        code_postal: '69003',
        adresse_complete: '42 rue de la Part-Dieu, 69003 Lyon',
        specialites: ['respiratoire', 'musculo-squelettique'],
        type_cabinet: 'liberal',
        statut: 'active',
        source: 'native',
      })
      .select('id')
      .single();
    if (error) throw error;
    annonceId = data!.id as string;
    console.log(`  ✅ Annonce creee: ${annonceId}`);
  }

  // 5. Candidature de Lucas acceptee
  console.log('\n📥 Candidature');
  const { data: existingCandidature } = await admin
    .from('candidatures')
    .select('id, statut')
    .eq('annonce_id', annonceId)
    .eq('remplacant_id', lucasId)
    .limit(1);
  let candidatureId: string;
  if (existingCandidature && existingCandidature.length > 0) {
    candidatureId = existingCandidature[0].id as string;
    if (existingCandidature[0].statut !== 'acceptee') {
      await admin.from('candidatures').update({ statut: 'acceptee' }).eq('id', candidatureId);
    }
    console.log(`  ♻️  Candidature existante: ${candidatureId}`);
  } else {
    const { data, error } = await admin
      .from('candidatures')
      .insert({
        annonce_id: annonceId,
        remplacant_id: lucasId,
        statut: 'acceptee',
        message: 'Bonjour, je suis disponible pour ce remplacement.',
      })
      .select('id')
      .single();
    if (error) throw error;
    candidatureId = data!.id as string;
    console.log(`  ✅ Candidature creee: ${candidatureId}`);
  }

  // 6. Contrat confirme
  console.log('\n📄 Contrat');
  const { data: existingContrat } = await admin
    .from('contrats')
    .select('id, statut')
    .eq('candidature_id', candidatureId)
    .limit(1);
  let contratId: string;
  if (existingContrat && existingContrat.length > 0) {
    contratId = existingContrat[0].id as string;
    if (existingContrat[0].statut !== 'confirme') {
      await admin
        .from('contrats')
        .update({
          statut: 'confirme',
          confirme_par_titulaire_at: new Date().toISOString(),
          confirme_par_remplacant_at: new Date().toISOString(),
        })
        .eq('id', contratId);
    }
    console.log(`  ♻️  Contrat existant: ${contratId} -> force confirme`);
  } else {
    // Shape donnees alignee sur _shared/contrat.service.ts (snapshot immuable
    // titulaire / remplacant / dates / adresse_cabinet) — sinon /contrat/[id] crashe
    // sur "donnees.titulaire is undefined" (bug decouvert au QA 2026-04-16).
    const { data, error } = await admin
      .from('contrats')
      .insert({
        annonce_id: annonceId,
        candidature_id: candidatureId,
        titulaire_id: sophieId,
        remplacant_id: lucasId,
        statut: 'confirme',
        template_version: 'v1.0',
        donnees: {
          titulaire: {
            first_name: SOPHIE.first_name,
            last_name: SOPHIE.last_name,
            rpps: SOPHIE.rpps_number,
          },
          remplacant: {
            first_name: LUCAS.first_name,
            last_name: LUCAS.last_name,
            rpps: LUCAS.rpps_number,
          },
          dates: { debut: '2026-07-01', fin: '2026-07-31' },
          adresse_cabinet: '42 rue de la Part-Dieu, 69003 Lyon',
          taux_retrocession: 80,
          template_version: 'v1.0',
        },
        clauses_obligatoires: [
          { titre: 'Assurance RCP', contenu: 'Le remplacant atteste detenir une assurance RCP.' },
          { titre: 'Duree', contenu: 'Du 01/07/2026 au 31/07/2026.' },
        ],
        clauses_optionnelles: [],
        confirme_par_titulaire_at: new Date().toISOString(),
        confirme_par_remplacant_at: new Date().toISOString(),
      })
      .select('id')
      .single();
    if (error) throw error;
    contratId = data!.id as string;
    console.log(`  ✅ Contrat cree: ${contratId}`);
  }

  // 7. Nettoyer tout paiement en cours pour ce contrat (re-run friendly)
  await admin.from('paiements').delete().eq('contrat_id', contratId);

  console.log('\n' + '='.repeat(50));
  console.log('\n📊 RESUME');
  console.log(`  Sophie (titulaire) : ${sophieId}`);
  console.log(`  Lucas  (remplacant): ${lucasId}`);
  console.log(`  Annonce            : ${annonceId}`);
  console.log(`  Candidature        : ${candidatureId}`);
  console.log(`  Contrat (confirme) : ${contratId}`);
  console.log(`  Stripe Sophie      : ${sophieStripe}`);
  console.log(`  Stripe Lucas       : ${lucasStripe}`);
  console.log('\n🔑 Identifiants');
  console.log(`  Sophie : ${SOPHIE.email} / ${SOPHIE.password}`);
  console.log(`  Lucas  : ${LUCAS.email} / ${LUCAS.password}`);
  console.log('\n✅ Seed termine. Lance le dev server puis ouvre http://localhost:3000/login');
}

main().catch((err: unknown) => {
  console.error('\n❌ Seed failed:', err instanceof Error ? err.message : err);
  if (err instanceof Error && err.stack) console.error(err.stack);
  process.exit(1);
});
