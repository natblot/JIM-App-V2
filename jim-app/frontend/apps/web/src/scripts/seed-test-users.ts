// Script de seed — utilisateurs de test pour le parcours E2E
// Usage : npx tsx frontend/apps/web/src/scripts/seed-test-users.ts
// Prerequis : SUPABASE_SERVICE_ROLE_KEY configuree dans .env.local

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://xfgktshirllqesnwmwpm.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SERVICE_ROLE_KEY || SERVICE_ROLE_KEY === 'your-service-role-key') {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY non configuree dans .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Persona 1 — Dr. Sophie Marchand (TITULAIRE)
const SOPHIE = {
  email: 'sophie.marchand.test@jim-app.fr',
  password: 'TestJim2026!',
  profile: {
    first_name: 'Sophie',
    last_name: 'Marchand',
    role: 'titulaire',
    rpps: '10100000001',
    rpps_verified: true,
    ville: 'Lyon',
    code_postal: '69003',
    adresse_complete: '42 rue de la Part-Dieu, 69003 Lyon',
    specialites: ['respiratoire', 'musculo-squelettique'],
    type_cabinet: 'liberal',
  },
};

// Persona 2 — Lucas Petit (REMPLAÇANT)
const LUCAS = {
  email: 'lucas.petit.test@jim-app.fr',
  password: 'TestJim2026!',
  profile: {
    first_name: 'Lucas',
    last_name: 'Petit',
    role: 'remplacant',
    rpps: '10100000002',
    rpps_verified: true,
    ville: 'Paris',
    code_postal: '75011',
    specialites: ['sport', 'musculo-squelettique'],
  },
};

// Annonce de Sophie
const ANNONCE = {
  type_annonce: 'remplacement',
  date_debut: '2026-07-01',
  date_fin: '2026-07-31',
  retrocession: 80,
  description: 'Cabinet de kinesitherapie bien situe a Lyon 3eme, proche Part-Dieu. 2 salles de soin equipees. Patientele fidele et diversifiee. Specialites : respiratoire, musculo-squelettique, post-operatoire. Logement possible a proximite.',
  ville: 'Lyon',
  code_postal: '69003',
  adresse_complete: '42 rue de la Part-Dieu, 69003 Lyon',
  is_urgent: false,
  specialites: ['respiratoire', 'musculo-squelettique'],
  type_cabinet: 'liberal',
  statut: 'active',
  source: 'native',
};

interface TestUser {
  email: string;
  password: string;
  profile: Record<string, unknown>;
}

async function seedUser(config: TestUser) {
  console.log(`\n📝 Creation de ${String(config.profile.first_name)} ${String(config.profile.last_name)}...`);

  // Create auth user
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: config.email,
    password: config.password,
    email_confirm: true,
    user_metadata: { role: String(config.profile.role) },
  });

  if (authError) {
    if (authError.message.includes('already been registered')) {
      console.log(`  ⚠️ Utilisateur existe deja, recherche...`);
      const { data: users } = await supabase.auth.admin.listUsers();
      const existing = users.users.find(u => u.email === config.email);
      if (existing) {
        console.log(`  ✅ Trouve: ${existing.id}`);
        return existing.id;
      }
    }
    console.error(`  ❌ Erreur auth: ${authError.message}`);
    return null;
  }

  const userId = authData.user.id;
  console.log(`  ✅ Auth cree: ${userId}`);

  // Upsert profile
  const { error: profileError } = await supabase.from('profiles').upsert({
    id: userId,
    ...config.profile,
  });

  if (profileError) {
    console.error(`  ❌ Erreur profil: ${profileError.message}`);
  } else {
    console.log(`  ✅ Profil cree`);
  }

  return userId;
}

async function main() {
  console.log('🌱 Seed utilisateurs de test JIM\n');
  console.log('='.repeat(50));

  const sophieId = await seedUser(SOPHIE);
  const lucasId = await seedUser(LUCAS);

  if (!sophieId) {
    console.error('\n❌ Impossible de creer Sophie, arret.');
    return;
  }

  // Create annonce for Sophie
  console.log('\n📋 Creation de l\'annonce de Sophie...');
  const { data: annonce, error: annonceError } = await supabase.from('annonces').insert({
    ...ANNONCE,
    profile_id: sophieId,
  }).select('id').single();

  if (annonceError) {
    console.error(`  ❌ Erreur annonce: ${annonceError.message}`);
  } else {
    console.log(`  ✅ Annonce creee: ${annonce.id}`);
  }

  console.log('\n' + '='.repeat(50));
  console.log('\n📊 Resume :');
  console.log(`  Sophie (titulaire) : ${sophieId}`);
  console.log(`  Lucas (remplacant)  : ${lucasId}`);
  if (annonce) console.log(`  Annonce             : ${annonce.id}`);
  console.log(`\n🔑 Identifiants :`);
  console.log(`  Sophie : sophie.marchand.test@jim-app.fr / TestJim2026!`);
  console.log(`  Lucas  : lucas.petit.test@jim-app.fr / TestJim2026!`);
}

main().catch(console.error);
