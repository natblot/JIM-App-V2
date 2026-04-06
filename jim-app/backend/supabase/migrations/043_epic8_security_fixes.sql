-- Migration 043 : Corrections sécurité Epic 8 (rapport rls-epic8.md)
-- F0 CRITIQUE : GRANT EXECUTE on_contrat_confirmed() TO authenticated — à révoquer
-- F3 HAUT     : template_version injectable par client — trigger BEFORE INSERT
-- F1 HAUT     : clauses_optionnelles sans validation longueur/type — trigger BEFORE INSERT OR UPDATE
-- F2 HAUT     : donnees JSONB vide autorisé à l'état confirme — guard BEFORE UPDATE
-- F14 MOYEN   : transitions de statut non séquencées — trigger BEFORE UPDATE
-- F15 MOYEN   : clauses_obligatoires modifiable après création — guard BEFORE UPDATE

-- ============================================================
-- F0 : Révoquer GRANT EXECUTE inutile et dangereux
-- on_contrat_confirmed() est SECURITY DEFINER — ne doit JAMAIS
-- être appelable directement par le rôle authenticated
-- Les triggers sont déclenchés par le moteur PostgreSQL, pas par EXECUTE
-- ============================================================
REVOKE EXECUTE ON FUNCTION on_contrat_confirmed() FROM authenticated;

-- ============================================================
-- F3 : Forcer template_version à 'v1.0' pour MVP
-- Empêche un client de forger une version de template arbitraire
-- Ce trigger sera mis à jour lors de l'introduction de nouvelles versions
-- ============================================================
CREATE OR REPLACE FUNCTION enforce_contrat_template_version()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Force template_version à la valeur MVP — ne jamais accepter de version cliente
  NEW.template_version := 'v1.0';
  RETURN NEW;
END;
$$;

CREATE TRIGGER contrats_enforce_template
  BEFORE INSERT ON contrats
  FOR EACH ROW EXECUTE FUNCTION enforce_contrat_template_version();

-- ============================================================
-- F1 + F2 + F14 + F15 : Trigger de validation globale sur contrats
-- BEFORE INSERT OR UPDATE — vérifie :
--   F1  : clauses_optionnelles — chaque élément doit être une string <= 2000 chars
--   F2  : donnees — ne peut pas être vide ('{}') quand statut = 'confirme'
--   F14 : transitions de statut autorisées uniquement (séquence stricte)
--   F15 : clauses_obligatoires — immuable après création
-- ============================================================
CREATE OR REPLACE FUNCTION validate_contrat_integrity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_clause JSONB;
  v_clause_text TEXT;
  v_i INT;
BEGIN

  -- ----------------------------------------------------------
  -- F1 : Validation des clauses_optionnelles
  -- Chaque élément doit être une chaîne de caractères non vide
  -- et ne doit pas dépasser 2000 caractères
  -- ----------------------------------------------------------
  IF NEW.clauses_optionnelles IS NOT NULL AND jsonb_typeof(NEW.clauses_optionnelles) != 'array' THEN
    RAISE EXCEPTION 'clauses_optionnelles doit être un tableau JSON (reçu : %)', jsonb_typeof(NEW.clauses_optionnelles);
  END IF;

  v_i := 0;
  FOR v_clause IN SELECT * FROM jsonb_array_elements(NEW.clauses_optionnelles) LOOP
    v_i := v_i + 1;
    IF jsonb_typeof(v_clause) != 'string' THEN
      RAISE EXCEPTION 'clauses_optionnelles[%] : chaque clause doit être une chaîne de caractères', v_i;
    END IF;
    v_clause_text := v_clause #>> '{}';
    IF length(v_clause_text) > 2000 THEN
      RAISE EXCEPTION 'clauses_optionnelles[%] : longueur max 2000 caractères (reçu : % caractères)', v_i, length(v_clause_text);
    END IF;
  END LOOP;

  -- ----------------------------------------------------------
  -- F2 : Validation de donnees à la confirmation
  -- Un contrat ne peut pas être confirmé avec des données vides
  -- ----------------------------------------------------------
  IF NEW.statut = 'confirme' AND (NEW.donnees IS NULL OR NEW.donnees = '{}') THEN
    RAISE EXCEPTION 'donnees ne peut pas être vide lorsque le contrat est confirmé';
  END IF;

  -- ----------------------------------------------------------
  -- F15 : clauses_obligatoires immuable après création
  -- Seul le INSERT initial peut définir ces clauses
  -- ----------------------------------------------------------
  IF TG_OP = 'UPDATE' THEN
    IF NEW.clauses_obligatoires IS DISTINCT FROM OLD.clauses_obligatoires THEN
      RAISE EXCEPTION 'clauses_obligatoires est immuable après la création du contrat (contrat_id : %)', NEW.id;
    END IF;
  END IF;

  -- ----------------------------------------------------------
  -- F14 + F16 : Validation des transitions de statut
  -- Séquence autorisée : brouillon → en_attente_remplacant → confirme
  -- 'confirme' est un état terminal (aucune transition sortante)
  -- ----------------------------------------------------------
  IF TG_OP = 'UPDATE' AND NEW.statut IS DISTINCT FROM OLD.statut THEN
    -- État terminal : 'confirme' ne peut pas évoluer
    IF OLD.statut = 'confirme' THEN
      RAISE EXCEPTION 'Le statut "confirme" est un état terminal — aucune modification de statut autorisée (contrat_id : %)', NEW.id;
    END IF;

    -- Seules les transitions séquentielles sont autorisées
    IF NOT (
      (OLD.statut = 'brouillon'           AND NEW.statut = 'en_attente_remplacant') OR
      (OLD.statut = 'en_attente_remplacant' AND NEW.statut = 'confirme')
    ) THEN
      RAISE EXCEPTION 'Transition de statut invalide : "%" → "%" (contrat_id : %)',
        OLD.statut, NEW.statut, NEW.id;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER contrats_validate_integrity
  BEFORE INSERT OR UPDATE ON contrats
  FOR EACH ROW EXECUTE FUNCTION validate_contrat_integrity();
