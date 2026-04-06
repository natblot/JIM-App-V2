// Service métier candidatures — partagé entre Edge Functions
import type { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import type { CreateCandidatureInput, ProcessCandidatureInput } from './candidature.schema.deno.ts';

// Sanitization basique — strip balises HTML et scripts
function sanitizeText(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/javascript:/gi, '')
    .trim();
}

// Créer une candidature (Story 5.1)
export async function createCandidature(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  input: CreateCandidatureInput
) {
  // Vérifier que l'annonce est active et non agrégée exclusivement
  const { data: annonce, error: annonceError } = await supabase
    .from('annonces')
    .select('id, statut, source')
    .eq('id', input.annonce_id)
    .single();

  if (annonceError || !annonce) {
    return { error: { code: 'ANNONCE_NOT_FOUND', message: 'Annonce introuvable' }, status: 404 };
  }

  if (!['active', 'non_confirmee'].includes(annonce.statut)) {
    return { error: { code: 'ANNONCE_NOT_ACTIVE', message: "Cette annonce n'est plus disponible" }, status: 409 };
  }

  // Sanitize le message
  const sanitizedMessage = input.message ? sanitizeText(input.message) : null;

  const { data, error } = await supabase
    .from('candidatures')
    .insert({
      annonce_id: input.annonce_id,
      remplacant_id: userId,
      message: sanitizedMessage,
      warnings: input.warnings ?? [],
    })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      return { error: { code: 'CANDIDATURE_ALREADY_EXISTS', message: 'Vous avez déjà candidaté à cette annonce' }, status: 409 };
    }
    return { error: { code: 'SYSTEM_ERROR', message: error.message }, status: 500 };
  }

  return { data };
}

// Traiter une candidature (accepter/refuser) — Story 5.6
export async function processCandidature(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  input: ProcessCandidatureInput
) {
  // Vérifier que la candidature appartient à une annonce du titulaire
  const { data: candidature, error: fetchError } = await supabase
    .from('candidatures')
    .select('id, statut, annonce_id')
    .eq('id', input.candidature_id)
    .single();

  if (fetchError || !candidature) {
    return { error: { code: 'CANDIDATURE_NOT_FOUND', message: 'Candidature introuvable' }, status: 404 };
  }

  if (!['en_attente', 'vue', 'en_discussion'].includes(candidature.statut)) {
    return { error: { code: 'CANDIDATURE_ALREADY_PROCESSED', message: 'Cette candidature a déjà été traitée' }, status: 409 };
  }

  const newStatut = input.action === 'accepter' ? 'acceptee' : 'refusee';

  const { data, error } = await supabase
    .from('candidatures')
    .update({ statut: newStatut })
    .eq('id', input.candidature_id)
    .select()
    .single();

  if (error) {
    return { error: { code: 'SYSTEM_ERROR', message: error.message }, status: 500 };
  }

  // Refus cascade si action = accepter et refuser_autres = true (FR33)
  if (input.action === 'accepter' && input.refuser_autres) {
    await supabase
      .from('candidatures')
      .update({ statut: 'refusee' })
      .eq('annonce_id', candidature.annonce_id)
      .neq('id', input.candidature_id)
      .in('statut', ['en_attente', 'vue', 'en_discussion']);
  }

  return { data };
}

// Retirer une candidature (Story 5.8)
export async function withdrawCandidature(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  candidatureId: string
) {
  const { data: candidature } = await supabase
    .from('candidatures')
    .select('statut')
    .eq('id', candidatureId)
    .eq('remplacant_id', userId)
    .single();

  if (!candidature) {
    return { error: { code: 'CANDIDATURE_NOT_FOUND', message: 'Candidature introuvable' }, status: 404 };
  }

  if (candidature.statut !== 'en_attente') {
    return { error: { code: 'CANDIDATURE_NOT_WITHDRAWABLE', message: 'Impossible de retirer une candidature déjà traitée' }, status: 409 };
  }

  const { data, error } = await supabase
    .from('candidatures')
    .update({ statut: 'retiree' })
    .eq('id', candidatureId)
    .eq('remplacant_id', userId)
    .select()
    .single();

  if (error) {
    return { error: { code: 'SYSTEM_ERROR', message: error.message }, status: 500 };
  }

  return { data };
}
