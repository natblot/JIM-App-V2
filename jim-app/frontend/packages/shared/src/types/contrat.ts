// Types contrats IA — Epic 8
// Statut possible d'un contrat de remplacement

export type ContratStatut = 'brouillon' | 'en_attente_remplacant' | 'confirme';

// Une clause contractuelle (obligatoire ou optionnelle)
export interface ContratClause {
  id: string;
  titre: string;
  contenu: string;
  editable: boolean;
}

// Données métier embarquées dans le contrat (snapshot au moment de la génération)
export interface ContratDonnees {
  titulaire: { first_name: string; last_name: string; rpps: string };
  remplacant: { first_name: string; last_name: string; rpps: string };
  dates: { debut: string; fin: string };
  adresse_cabinet: string;
  taux_retrocession: number;
  template_version: string;
}

// Contrat de remplacement complet
export interface Contrat {
  id: string;
  annonce_id: string;
  candidature_id: string;
  /** user_id du titulaire */
  titulaire_id: string;
  /** user_id du remplaçant */
  remplacant_id: string;
  statut: ContratStatut;
  template_version: string;
  donnees: ContratDonnees;
  clauses_obligatoires: ContratClause[];
  clauses_optionnelles: ContratClause[];
  confirme_par_titulaire_at: string | null;
  confirme_par_remplacant_at: string | null;
  created_at: string;
  updated_at: string;
}
