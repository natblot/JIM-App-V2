import type { AnnuaireSanteAdapter } from './annuaire-sante.ts';
import type { RppsVerificationResult, RppsErrorCode } from './types.ts';

// Résultat interne du service
export type RppsServiceResult =
  | { success: true; data: RppsVerificationResult }
  | { success: false; code: RppsErrorCode; message: string };

// Format RPPS : 11 chiffres
const RPPS_REGEX = /^\d{11}$/;

// Correspondance nom — tolérance sur accents et casse
function namesMatch(dbName: string, rppsName: string): boolean {
  const normalize = (s: string) =>
    s.toUpperCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^A-Z\s]/g, '')
      .trim();

  return normalize(dbName) === normalize(rppsName);
}

export async function verifyRppsForUser(
  client: AnnuaireSanteAdapter,
  params: {
    rppsNumber: string;
    userFirstName: string;
    userLastName: string;
  }
): Promise<RppsServiceResult> {
  // Validation format RPPS
  if (!RPPS_REGEX.test(params.rppsNumber)) {
    return {
      success: false,
      code: 'VALIDATION_INVALID_RPPS',
      message: 'Le numéro RPPS doit contenir exactement 11 chiffres.',
    };
  }

  let rppsData: RppsVerificationResult | null;

  try {
    rppsData = await client.verifyByRpps(params.rppsNumber);
  } catch (error) {
    console.error('[rpps-service] API Annuaire Santé unavailable:', error);
    return {
      success: false,
      code: 'RPPS_API_DOWN',
      message: "L'Annuaire Santé est temporairement indisponible. Votre profil est en attente de vérification.",
    };
  }

  if (!rppsData) {
    return {
      success: false,
      code: 'RPPS_NOT_FOUND',
      message: "Ce numéro RPPS n'est pas référencé dans l'Annuaire Santé. Vérifiez qu'il contient 11 chiffres.",
    };
  }

  // Vérification anti-usurpation (FR10)
  const firstNameMatch = namesMatch(params.userFirstName, rppsData.first_name);
  const lastNameMatch = namesMatch(params.userLastName, rppsData.last_name);

  if (!firstNameMatch || !lastNameMatch) {
    return {
      success: false,
      code: 'RPPS_NAME_MISMATCH',
      message: "Le numéro RPPS ne correspond pas à l'identité déclarée lors de l'inscription. Vérifiez votre prénom et nom.",
    };
  }

  return { success: true, data: rppsData };
}
