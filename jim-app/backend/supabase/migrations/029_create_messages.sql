-- Migration 029 : Table messages — Epic 6 messagerie intégrée

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  -- sender_id référence auth.users(id) — même convention que les autres tables
  sender_id UUID NOT NULL REFERENCES auth.users(id),
  content TEXT NOT NULL CHECK (length(content) > 0 AND length(content) <= 2000),
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- Colonne générée : détection automatique des liens (FR38 anti-phishing)
  contains_links BOOLEAN GENERATED ALWAYS AS (content ~ 'https?://') STORED,
  -- Marquage phishing par les Edge Functions de modération
  flagged_phishing BOOLEAN NOT NULL DEFAULT false,
  -- Messages système (ex : "Remplacement confirmé !") insérés par les triggers SECURITY DEFINER
  is_system_message BOOLEAN NOT NULL DEFAULT false
);

-- Index principal : récupérer les messages d'une conversation dans l'ordre chronologique
CREATE INDEX idx_messages_conversation ON messages(conversation_id, created_at ASC);
-- Index partiel : messages non lus (read_at IS NULL) pour le badge compteur
CREATE INDEX idx_messages_unread ON messages(conversation_id, read_at) WHERE read_at IS NULL;

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- SELECT : uniquement les messages de ses propres conversations
CREATE POLICY select_messages_own ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.id = messages.conversation_id
      AND (c.participant_1_id = auth.uid() OR c.participant_2_id = auth.uid())
    )
  );

-- INSERT : dans ses propres conversations, sender_id doit correspondre à auth.uid()
-- Les messages système (is_system_message = true) ne peuvent être insérés que par les triggers SECURITY DEFINER
CREATE POLICY insert_messages_own ON messages
  FOR INSERT WITH CHECK (
    sender_id = auth.uid()
    AND NOT is_system_message
    AND EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.id = messages.conversation_id
      AND (c.participant_1_id = auth.uid() OR c.participant_2_id = auth.uid())
    )
  );

-- UPDATE : seul read_at peut être modifié (messages immutables — RGPD)
-- On ne peut marquer comme lu que les messages de L'AUTRE participant
CREATE POLICY update_messages_read_at ON messages
  FOR UPDATE USING (
    sender_id != auth.uid()
    AND EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.id = messages.conversation_id
      AND (c.participant_1_id = auth.uid() OR c.participant_2_id = auth.uid())
    )
  )
  WITH CHECK (
    -- Garantie que seul read_at change — le contenu est immutable (RGPD)
    content = content AND sender_id = sender_id AND is_system_message = is_system_message
  );

-- Pas de policy DELETE : conservation obligatoire des messages (RGPD article 17 exception médicale)
