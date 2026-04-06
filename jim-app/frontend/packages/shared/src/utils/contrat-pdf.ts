// Génération HTML pour impression PDF via expo-print — Epic 8
// Le HTML est passé à expo-print.printToFileAsync() sur mobile
import type { Contrat } from '../types/contrat';

// Formate une date ISO en date française lisible
function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

// Génère un bloc HTML pour une clause individuelle
function buildClauseHtml(titre: string, contenu: string): string {
  return `
    <div style="margin-bottom:20px;padding:14px;border:1px solid #e2e8f0;border-radius:8px;">
      <h3 style="margin:0 0 8px 0;font-size:13px;font-weight:600;color:#1e293b;">${titre}</h3>
      <p style="margin:0;font-size:12px;color:#475569;line-height:1.6;">${contenu}</p>
    </div>
  `;
}

/**
 * Génère un HTML string complet pour expo-print.
 * Inclut toutes les clauses du contrat et le disclaimer réglementaire obligatoire.
 */
export function generateContratHtml(contrat: Contrat): string {
  const { donnees, clauses_obligatoires, clauses_optionnelles } = contrat;

  const clausesObligatoiresHtml = clauses_obligatoires
    .map((c) => buildClauseHtml(c.titre, c.contenu))
    .join('');

  const clausesOptionnellesHtml = clauses_optionnelles
    .map((c) => buildClauseHtml(c.titre, c.contenu))
    .join('');

  // Texte de signature selon l'état de confirmation
  const sigTitulaireText = contrat.confirme_par_titulaire_at
    ? `Signé le ${formatDate(contrat.confirme_par_titulaire_at)}`
    : 'En attente de signature';

  const sigRemplacantText = contrat.confirme_par_remplacant_at
    ? `Signé le ${formatDate(contrat.confirme_par_remplacant_at)}`
    : 'En attente de signature';

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Contrat de remplacement — JIM</title>
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, Helvetica, Arial, sans-serif;
      color: #1e293b;
      background: #ffffff;
      margin: 0;
      padding: 0;
    }
    .page {
      max-width: 780px;
      margin: 0 auto;
      padding: 40px 32px;
    }
    .header {
      border-bottom: 3px solid #3b82f6;
      padding-bottom: 16px;
      margin-bottom: 32px;
    }
    .header h1 {
      font-size: 22px;
      font-weight: 700;
      margin: 0 0 4px 0;
      color: #1e293b;
    }
    .header .subtitle {
      font-size: 12px;
      color: #64748b;
    }
    .section-title {
      font-size: 14px;
      font-weight: 700;
      color: #1e293b;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 8px;
      margin: 28px 0 16px 0;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 16px;
    }
    .info-block {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 14px;
    }
    .info-block .label {
      font-size: 10px;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin-bottom: 4px;
    }
    .info-block .value {
      font-size: 13px;
      font-weight: 600;
      color: #1e293b;
    }
    .info-block .rpps {
      font-size: 11px;
      color: #64748b;
      margin-top: 2px;
    }
    .highlight-box {
      background: #eff6ff;
      border: 2px solid #3b82f6;
      border-radius: 10px;
      padding: 16px;
      text-align: center;
      margin-bottom: 24px;
    }
    .highlight-box .retro-label {
      font-size: 11px;
      color: #3b82f6;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }
    .highlight-box .retro-value {
      font-size: 28px;
      font-weight: 800;
      color: #1d4ed8;
      margin: 4px 0;
    }
    .signatures {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-top: 24px;
    }
    .signature-block {
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 14px;
      text-align: center;
    }
    .signature-block .sig-label {
      font-size: 11px;
      color: #64748b;
      margin-bottom: 6px;
    }
    .signature-block .sig-value {
      font-size: 12px;
      font-weight: 600;
      color: #1e293b;
    }
    .disclaimer {
      margin-top: 40px;
      padding: 16px;
      background: #fefce8;
      border: 1px solid #fde68a;
      border-radius: 8px;
      font-size: 10px;
      color: #78350f;
      line-height: 1.6;
    }
    .disclaimer strong {
      display: block;
      margin-bottom: 6px;
      font-size: 11px;
    }
    .footer {
      margin-top: 32px;
      padding-top: 16px;
      border-top: 1px solid #e2e8f0;
      font-size: 10px;
      color: #94a3b8;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="page">

    <!-- En-tête du document -->
    <div class="header">
      <h1>Contrat de remplacement</h1>
      <div class="subtitle">
        Généré via JIM — Job In Med &bull; Template v${donnees.template_version} &bull;
        Créé le ${formatDate(contrat.created_at)}
      </div>
    </div>

    <!-- Parties au contrat -->
    <div class="section-title">Parties au contrat</div>
    <div class="info-grid">
      <div class="info-block">
        <div class="label">Titulaire (cabinet)</div>
        <div class="value">${donnees.titulaire.first_name} ${donnees.titulaire.last_name}</div>
        <div class="rpps">RPPS : ${donnees.titulaire.rpps}</div>
      </div>
      <div class="info-block">
        <div class="label">Remplaçant</div>
        <div class="value">${donnees.remplacant.first_name} ${donnees.remplacant.last_name}</div>
        <div class="rpps">RPPS : ${donnees.remplacant.rpps}</div>
      </div>
    </div>

    <!-- Détails du remplacement -->
    <div class="section-title">Détails du remplacement</div>
    <div class="info-grid">
      <div class="info-block">
        <div class="label">Date de début</div>
        <div class="value">${formatDate(donnees.dates.debut)}</div>
      </div>
      <div class="info-block">
        <div class="label">Date de fin</div>
        <div class="value">${formatDate(donnees.dates.fin)}</div>
      </div>
    </div>
    <div class="info-block" style="margin-bottom:16px;">
      <div class="label">Adresse du cabinet</div>
      <div class="value">${donnees.adresse_cabinet}</div>
    </div>
    <div class="highlight-box">
      <div class="retro-label">Taux de rétrocession convenu</div>
      <div class="retro-value">${donnees.taux_retrocession} %</div>
    </div>

    <!-- Clauses obligatoires -->
    ${
      clauses_obligatoires.length > 0
        ? `<div class="section-title">Clauses obligatoires</div>${clausesObligatoiresHtml}`
        : ''
    }

    <!-- Clauses optionnelles / complémentaires -->
    ${
      clauses_optionnelles.length > 0
        ? `<div class="section-title">Clauses complémentaires</div>${clausesOptionnellesHtml}`
        : ''
    }

    <!-- Signatures électroniques -->
    <div class="section-title">Signatures électroniques</div>
    <div class="signatures">
      <div class="signature-block">
        <div class="sig-label">Titulaire</div>
        <div class="sig-value">${sigTitulaireText}</div>
      </div>
      <div class="signature-block">
        <div class="sig-label">Remplaçant</div>
        <div class="sig-value">${sigRemplacantText}</div>
      </div>
    </div>

    <!-- Disclaimer réglementaire obligatoire — affiché sur chaque page PDF -->
    <div class="disclaimer">
      <strong>Avertissement réglementaire important</strong>
      Ce document a été généré automatiquement à titre informatif par la plateforme JIM — Job In Med.
      Il ne constitue pas un acte juridique opposable en l'état. Conformément aux réglementations
      applicables aux professionnels de santé (Code de la Santé Publique, règles de l'Ordre des
      Masseurs-Kinésithérapeutes), ce contrat doit être validé par un professionnel du droit avant
      toute signature définitive. JIM décline toute responsabilité quant à l'utilisation de ce document
      sans vérification juridique préalable. Données personnelles traitées conformément au RGPD.
    </div>

    <!-- Pied de page -->
    <div class="footer">
      JIM — Job In Med &bull; Contrat #${contrat.id} &bull;
      Généré le ${formatDate(new Date().toISOString())}
    </div>

  </div>
</body>
</html>`;
}
