// Parser CSV facturation — Epic 9
// Format supporte : Kine4000 (principal logiciel de facturation kine en France)
// Fallback : saisie manuelle si format non reconnu

export interface CsvParseResult {
  success: boolean;
  montantTotalCents: number;
  format: 'kine4000' | 'unknown';
  lignes: number;
  erreur?: string;
}

// Detecter le format CSV et extraire le montant total des honoraires
export function parseCsvFacturation(csvContent: string): CsvParseResult {
  if (!csvContent || csvContent.trim().length === 0) {
    return { success: false, montantTotalCents: 0, format: 'unknown', lignes: 0, erreur: 'Fichier vide' };
  }

  const lines = csvContent.trim().split('\n');
  if (lines.length < 2) {
    return { success: false, montantTotalCents: 0, format: 'unknown', lignes: 0, erreur: 'Le fichier doit contenir au moins un en-tete et une ligne de donnees' };
  }

  // Detecter le format Kine4000 par les en-tetes
  const header = lines[0]!.toLowerCase();
  if (isKine4000Format(header)) {
    return parseKine4000(lines);
  }

  return { success: false, montantTotalCents: 0, format: 'unknown', lignes: lines.length - 1, erreur: 'Format non reconnu. Utilisez la saisie manuelle.' };
}

// Format Kine4000 : colonnes typiques
// "Date;Patient;Acte;Montant;Mode de reglement;CPAM"
function isKine4000Format(headerLine: string): boolean {
  const requiredColumns = ['date', 'montant'];
  const normalised = headerLine.replace(/"/g, '').toLowerCase();
  return requiredColumns.every((col) => normalised.includes(col));
}

function parseKine4000(lines: string[]): CsvParseResult {
  const header = lines[0]!.replace(/"/g, '').toLowerCase();
  const separator = header.includes(';') ? ';' : ',';
  const columns = header.split(separator).map((c) => c.trim());

  // Trouver l'index de la colonne "montant"
  const montantIndex = columns.findIndex((c) => c.includes('montant'));
  if (montantIndex === -1) {
    return { success: false, montantTotalCents: 0, format: 'kine4000', lignes: 0, erreur: 'Colonne "montant" introuvable' };
  }

  let totalCents = 0;
  let lignesValides = 0;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]!.trim();
    if (!line) continue;

    const values = line.replace(/"/g, '').split(separator);
    const montantStr = values[montantIndex]?.trim();
    if (!montantStr) continue;

    // Parser le montant (format FR : "123,45" ou "1 234,56")
    const montant = parseMontantFR(montantStr);
    if (montant !== null) {
      totalCents += montant;
      lignesValides++;
    }
  }

  if (lignesValides === 0) {
    return { success: false, montantTotalCents: 0, format: 'kine4000', lignes: 0, erreur: 'Aucun montant valide trouve dans le fichier' };
  }

  return { success: true, montantTotalCents: totalCents, format: 'kine4000', lignes: lignesValides };
}

// Parser un montant au format francais → centimes
// "1 234,56" → 123456  |  "50,00" → 5000  |  "50" → 5000
function parseMontantFR(str: string): number | null {
  // Nettoyer : supprimer les espaces, remplacer la virgule par un point
  const cleaned = str.replace(/\s/g, '').replace(',', '.').replace('€', '');
  const value = parseFloat(cleaned);
  if (isNaN(value) || value < 0) return null;
  return Math.round(value * 100);
}
