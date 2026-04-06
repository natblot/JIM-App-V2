-- Ajoute un champ photos (URLs Supabase Storage) aux annonces
ALTER TABLE annonces ADD COLUMN IF NOT EXISTS photo_urls TEXT[] NOT NULL DEFAULT '{}';

COMMENT ON COLUMN annonces.photo_urls IS 'URLs des photos de l annonce (Supabase Storage)';
