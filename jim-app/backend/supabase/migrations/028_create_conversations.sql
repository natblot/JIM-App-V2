-- Migration 028 : Table conversations — Epic 6 messagerie intégrée
-- Les conversations sont créées automatiquement lors de l'acceptation d'une candidature

CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Références auth.users(id) directement (même convention que annonces.profile_id et candidatures.remplacant_id)
  participant_1_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  participant_2_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  annonce_id UUID NOT NULL REFERENCES annonces(id) ON DELETE CASCADE,
  candidature_id UUID NOT NULL REFERENCES candidatures(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_message_at TIMESTAMPTZ DEFAULT now(),
  last_message_preview TEXT,
  -- Une candidature ne peut avoir qu'une seule conversation
  CONSTRAINT conversations_unique_candidature UNIQUE (candidature_id),
  -- Les deux participants doivent être différents
  CONSTRAINT conversations_different_participants CHECK (participant_1_id != participant_2_id)
);

-- Index pour récupérer rapidement les conversations d'un participant, triées par dernier message
CREATE INDEX idx_conversations_participant_1 ON conversations(participant_1_id, last_message_at DESC);
CREATE INDEX idx_conversations_participant_2 ON conversations(participant_2_id, last_message_at DESC);
CREATE INDEX idx_conversations_annonce ON conversations(annonce_id);

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- SELECT : un utilisateur ne voit que ses propres conversations
CREATE POLICY select_conversations_own ON conversations
  FOR SELECT USING (participant_1_id = auth.uid() OR participant_2_id = auth.uid());

-- INSERT : réservé aux triggers SECURITY DEFINER uniquement
-- Pas de policy INSERT côté client — la création passe par create_conversation_on_accept()
