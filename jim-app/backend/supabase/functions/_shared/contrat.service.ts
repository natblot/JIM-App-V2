// Service métier contrats — Epic 8 "Contrats IA"
// Partagé entre les Edge Functions generate-contrat et confirm-contrat
import type { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Clauses obligatoires verrouillées — template v1.0
// Conformité légale : assurance RCP, durée, obligations légales, exercice libéral
const CLAUSES_OBLIGATOIRES_V1 = [
  {
    id: 'assurance_rcp',
    titre: 'Assurance Responsabilité Civile Professionnelle',
    contenu: 'Le remplaçant atteste disposer d\'une assurance RCP valide couvrant la période de remplacement. Il est seul responsable en cas de défaut de couverture.',
    modifiable: false,
  },
  {
    id: 'duree_remplacement',
    titre: 'Durée et conditions du remplacement',
    contenu: 'Le remplacement est effectué aux dates convenues, dans le strict cadre de la patientèle du titulaire. Toute prolongation doit faire l\'objet d\'un avenant écrit.',
    modifiable: false,
  },
  {
    id: 'obligations_legales',
    titre: 'Obligations légales et déontologiques',
    contenu: 'Les deux parties s\'engagent à respecter le Code de déontologie des masseurs-kinésithérapeutes, ainsi que les règles fixées par l\'Ordre National des Masseurs-Kinésithérapeutes.',
    modifiable: false,
  },
  {
    id: 'exercice_liberal',
    titre: 'Exercice en mode libéral',
    contenu: 'Le remplaçant exerce en toute indépendance, sans lien de subordination avec le titulaire. Il perçoit directement les honoraires et reverse au titulaire la rétrocession convenue.',
    modifiable: false,
  },
];

// Clauses optionnelles éditables — vides par défaut, renseignées avant confirmation
const CLAUSES_OPTIONNELLES_V1 = [
  {
    id: 'conditions_particulieres',
    titre: 'Conditions particulières',
    contenu: '',
    modifiable: true,
  },
  {
    id: 'horaires',
    titre: 'Horaires convenus',
    contenu: '',
    modifiable: true,
  },
  {
    id: 'logement',
    titre: 'Logement mis à disposition',
    contenu: '',
    modifiable: true,
  },
];

// Type Contrat retourné par generateContrat
export interface Contrat {
  id: string;
  candidature_id: string;
  annonce_id: string;
  titulaire_id: string;
  remplacant_id: string;
  statut: string;
  donnees: Record<string, unknown>;
  clauses_obligatoires: unknown[];
  clauses_optionnelles: unknown[];
  created_at: string;
}

// Générer (ou récupérer si déjà existant) un contrat à partir d'une candidature acceptée
export async function generateContrat(
  candidatureId: string,
  supabaseAdmin: ReturnType<typeof createClient>
): Promise<Contrat> {
  // Récupérer la candidature avec le remplaçant et l'annonce
  const { data: candidature, error: candidatureError } = await supabaseAdmin
    .from('candidatures')
    .select('id, statut, annonce_id, remplacant_id')
    .eq('id', candidatureId)
    .single();

  if (candidatureError || !candidature) {
    throw new Error('CANDIDATURE_NOT_FOUND');
  }

  if (candidature.statut !== 'acceptee') {
    throw new Error('CANDIDATURE_NOT_ACCEPTED');
  }

  // Récupérer l'annonce avec le profil titulaire (profile_id = auth.users.id du titulaire)
  const { data: annonce, error: annonceError } = await supabaseAdmin
    .from('annonces')
    .select('id, profile_id, date_debut, date_fin, adresse, taux_retrocession')
    .eq('id', candidature.annonce_id)
    .single();

  if (annonceError || !annonce) {
    throw new Error('ANNONCE_NOT_FOUND');
  }

  // Récupérer le profil du titulaire — profiles.user_id = annonce.profile_id (auth.users.id)
  const { data: profilTitulaire, error: titulaireError } = await supabaseAdmin
    .from('profiles')
    .select('first_name, last_name, rpps')
    .eq('user_id', annonce.profile_id)
    .single();

  if (titulaireError || !profilTitulaire) {
    throw new Error('TITULAIRE_PROFILE_NOT_FOUND');
  }

  // Récupérer le profil du remplaçant — candidatures.remplacant_id = auth.users.id
  const { data: profilRemplacant, error: remplacantError } = await supabaseAdmin
    .from('profiles')
    .select('first_name, last_name, rpps')
    .eq('user_id', candidature.remplacant_id)
    .single();

  if (remplacantError || !profilRemplacant) {
    throw new Error('REMPLACANT_PROFILE_NOT_FOUND');
  }

  // Construire les données factuelles du contrat
  const donnees = {
    titulaire: {
      first_name: profilTitulaire.first_name,
      last_name: profilTitulaire.last_name,
      rpps: profilTitulaire.rpps,
    },
    remplacant: {
      first_name: profilRemplacant.first_name,
      last_name: profilRemplacant.last_name,
      rpps: profilRemplacant.rpps,
    },
    dates: {
      debut: annonce.date_debut,
      fin: annonce.date_fin,
    },
    adresse_cabinet: annonce.adresse,
    taux_retrocession: annonce.taux_retrocession,
    template_version: 'v1.0',
  };

  // UPSERT — ON CONFLICT sur candidature_id → DO NOTHING si contrat déjà existant
  // Retourne le contrat existant ou le nouveau
  const { data: contrat, error: upsertError } = await supabaseAdmin
    .from('contrats')
    .upsert(
      {
        candidature_id: candidatureId,
        annonce_id: candidature.annonce_id,
        titulaire_id: annonce.profile_id,
        remplacant_id: candidature.remplacant_id,
        donnees,
        clauses_obligatoires: CLAUSES_OBLIGATOIRES_V1,
        clauses_optionnelles: CLAUSES_OPTIONNELLES_V1,
        template_version: 'v1.0',
      },
      { onConflict: 'candidature_id', ignoreDuplicates: true }
    )
    .select()
    .single();

  if (upsertError) {
    // Si le contrat existe déjà (ignoreDuplicates), on le récupère
    if (upsertError.code === 'PGRST116') {
      const { data: existing, error: fetchError } = await supabaseAdmin
        .from('contrats')
        .select()
        .eq('candidature_id', candidatureId)
        .single();
      if (fetchError || !existing) throw new Error('CONTRAT_FETCH_ERROR');
      return existing as Contrat;
    }
    throw new Error(`CONTRAT_UPSERT_ERROR: ${upsertError.message}`);
  }

  // Cas où upsert retourne null car DO NOTHING (ligne existante non retournée)
  if (!contrat) {
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from('contrats')
      .select()
      .eq('candidature_id', candidatureId)
      .single();
    if (fetchError || !existing) throw new Error('CONTRAT_FETCH_ERROR');
    return existing as Contrat;
  }

  return contrat as Contrat;
}

// Confirmer un contrat — logique de double confirmation
// - titulaire confirme : brouillon → en_attente_remplacant
// - remplaçant confirme : en_attente_remplacant → confirme
export async function confirmContrat(
  contratId: string,
  userId: string,
  supabaseAdmin: ReturnType<typeof createClient>
): Promise<void> {
  const { data: contrat, error: fetchError } = await supabaseAdmin
    .from('contrats')
    .select('id, statut, titulaire_id, remplacant_id')
    .eq('id', contratId)
    .single();

  if (fetchError || !contrat) {
    throw new Error('CONTRAT_NOT_FOUND');
  }

  if (contrat.statut === 'confirme') {
    throw new Error('CONTRAT_ALREADY_CONFIRMED');
  }

  // Titulaire confirme sa partie
  if (userId === contrat.titulaire_id && contrat.statut === 'brouillon') {
    const { error } = await supabaseAdmin
      .from('contrats')
      .update({
        statut: 'en_attente_remplacant',
        confirme_par_titulaire_at: new Date().toISOString(),
      })
      .eq('id', contratId);
    if (error) throw new Error(`CONTRAT_UPDATE_ERROR: ${error.message}`);
    return;
  }

  // Remplaçant confirme sa partie — uniquement si titulaire a déjà confirmé
  if (userId === contrat.remplacant_id && contrat.statut === 'en_attente_remplacant') {
    const { error } = await supabaseAdmin
      .from('contrats')
      .update({
        statut: 'confirme',
        confirme_par_remplacant_at: new Date().toISOString(),
      })
      .eq('id', contratId);
    if (error) throw new Error(`CONTRAT_UPDATE_ERROR: ${error.message}`);
    return;
  }

  throw new Error('CONTRAT_ACTION_INVALID');
}

// Mettre à jour les clauses optionnelles avant confirmation
// Guard : contrat déjà signé (statut = 'confirme') → interdit
export async function updateClausesOptionnelles(
  contratId: string,
  userId: string,
  clauses: Record<string, unknown>[],
  supabaseAdmin: ReturnType<typeof createClient>
): Promise<void> {
  const { data: contrat, error: fetchError } = await supabaseAdmin
    .from('contrats')
    .select('id, statut, titulaire_id, remplacant_id')
    .eq('id', contratId)
    .single();

  if (fetchError || !contrat) {
    throw new Error('CONTRAT_NOT_FOUND');
  }

  // Guard : contrat déjà signé ne peut plus être modifié
  if (contrat.statut === 'confirme') {
    throw new Error('CONTRAT_ALREADY_CONFIRMED');
  }

  // Seules les parties du contrat peuvent modifier les clauses
  if (userId !== contrat.titulaire_id && userId !== contrat.remplacant_id) {
    throw new Error('CONTRAT_FORBIDDEN');
  }

  const { error } = await supabaseAdmin
    .from('contrats')
    .update({ clauses_optionnelles: clauses })
    .eq('id', contratId);

  if (error) throw new Error(`CONTRAT_UPDATE_ERROR: ${error.message}`);
}
