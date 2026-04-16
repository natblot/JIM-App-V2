-- Migration 078 : RPC landing_annonces — variante de fetchActiveAnnonces avec
-- les coordonnees PostGIS extraites + profile_id, pour permettre :
--   1. La self-exclusion cote client (filter profile_id != auth.uid())
--   2. Le calcul Haversine de distance pour la colonne "Pres de moi" du kanban
--
-- Probleme decouvert au QA 2026-04-16 (Bug 4) : la colonne "Pres de moi"
-- contenait toutes les annonces sans aucun calcul de distance, et les
-- utilisateurs voyaient leurs propres annonces dans le kanban.
--
-- Pourquoi un RPC dedie plutot qu'enrichir le SELECT existant :
-- - public.annonces.location est de type geography (PostGIS), non serialisable
--   en JSON par PostgREST sans cast explicite
-- - Le RPC permet d'extraire lat/lng comme double precision propres
-- - Le RPC peut etre marque STABLE et utilise un index existant
--
-- Securite : SECURITY INVOKER (defaut) — la RLS d'annonces s'applique. Aucun
-- user ne peut lire les annonces auxquelles il n'a pas acces via la table.

CREATE OR REPLACE FUNCTION public.landing_annonces(p_limit integer DEFAULT 50)
RETURNS TABLE (
  id uuid,
  profile_id uuid,
  ville text,
  code_postal text,
  date_debut date,
  date_fin date,
  retrocession numeric,
  description text,
  type_annonce text,
  type_cabinet text,
  specialites jsonb,
  statut text,
  is_urgent boolean,
  source text,
  source_url text,
  created_at timestamptz,
  photo_urls text[],
  lat double precision,
  lng double precision
)
LANGUAGE sql
STABLE
SET search_path = public, pg_catalog
AS $$
  SELECT
    a.id,
    a.profile_id,
    a.ville,
    a.code_postal,
    a.date_debut,
    a.date_fin,
    a.retrocession,
    a.description,
    a.type_annonce,
    a.type_cabinet,
    a.specialites,
    a.statut,
    a.is_urgent,
    a.source,
    a.source_url,
    a.created_at,
    a.photo_urls,
    CASE WHEN a.location IS NOT NULL
      THEN ST_Y(a.location::geometry)::double precision
      ELSE NULL
    END AS lat,
    CASE WHEN a.location IS NOT NULL
      THEN ST_X(a.location::geometry)::double precision
      ELSE NULL
    END AS lng
  FROM public.annonces a
  WHERE a.statut IN ('active', 'en_cours')
  ORDER BY a.created_at DESC
  LIMIT p_limit;
$$;

COMMENT ON FUNCTION public.landing_annonces IS
  'Annonces actives pour la landing kanban — inclut profile_id pour la self-exclusion et lat/lng pour le calcul Haversine cote client de la colonne "Pres de moi".';

GRANT EXECUTE ON FUNCTION public.landing_annonces(integer) TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
