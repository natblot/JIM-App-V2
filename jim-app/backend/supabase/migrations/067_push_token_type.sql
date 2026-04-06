-- Migration 067 : Support dual push token (Expo Go + FCM natif)
-- Ajoute push_token + push_token_type pour supporter ExponentPushToken et FCM

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS push_token TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS push_token_type TEXT DEFAULT 'fcm'
  CHECK (push_token_type IN ('fcm', 'expo'));

-- Migrer les tokens FCM existants vers la nouvelle colonne
UPDATE profiles SET push_token = fcm_token, push_token_type = 'fcm'
  WHERE fcm_token IS NOT NULL AND push_token IS NULL;

-- RLS : le push_token est modifiable uniquement par son propriétaire
-- (déjà couvert par la policy UPDATE existante sur profiles)
