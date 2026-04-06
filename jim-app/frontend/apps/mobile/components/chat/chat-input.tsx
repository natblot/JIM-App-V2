// Zone de saisie du message — Epic 6, messagerie
// TextInput multiline + bouton envoi + quick replies pills
import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

export interface ChatInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
}

// Réponses rapides prédéfinies — disparaissent après le premier envoi
const QUICK_REPLIES = ["Merci", "D'accord", "J'ai une question"];

export function ChatInput({ onSend, disabled = false }: ChatInputProps) {
  const [text, setText] = useState('');
  const [showQuickReplies, setShowQuickReplies] = useState(true);

  const canSend = text.trim().length > 0 && !disabled;

  // Envoyer le message et réinitialiser l'état
  const handleSend = () => {
    if (!canSend) return;
    onSend(text.trim());
    setText('');
    setShowQuickReplies(false);  // masquer les quick replies après envoi
  };

  // Remplir l'input avec une réponse rapide (sans envoi automatique)
  const handleQuickReply = (reply: string) => {
    setText(reply);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      {/* Quick reply pills — visibles uniquement si aucun envoi n'a eu lieu */}
      {showQuickReplies && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="border-t border-jim-border bg-jim-surface"
          contentContainerClassName="px-4 py-2 gap-2"
        >
          {QUICK_REPLIES.map((reply) => (
            <Pressable
              key={reply}
              className="h-8 px-4 rounded-full border border-jim-primary/40 items-center justify-center active:opacity-70"
              onPress={() => handleQuickReply(reply)}
              accessibilityRole="button"
              accessibilityLabel={`Réponse rapide : ${reply}`}
            >
              <Text className="text-jim-primary text-sm font-medium">{reply}</Text>
            </Pressable>
          ))}
        </ScrollView>
      )}

      {/* Barre de saisie */}
      <View className="flex-row items-end gap-2 px-4 py-3 bg-jim-surface border-t border-jim-border">
        {/* Input texte multiline */}
        <TextInput
          className="flex-1 min-h-[44px] max-h-28 bg-jim-background rounded-2xl px-4 py-2.5 text-jim-text text-base"
          value={text}
          onChangeText={setText}
          placeholder="Votre message..."
          placeholderTextColor="#888"
          multiline
          editable={!disabled}
          accessibilityLabel="Zone de saisie du message"
          accessibilityHint="Saisissez votre message ici"
          returnKeyType="default"
          blurOnSubmit={false}
        />

        {/* Bouton envoi — zone tap 44×44 minimum */}
        <Pressable
          className={[
            'w-11 h-11 rounded-full items-center justify-center',
            canSend ? 'bg-jim-primary active:bg-jim-primary/80' : 'bg-jim-border',
          ].join(' ')}
          onPress={handleSend}
          disabled={!canSend}
          accessibilityRole="button"
          accessibilityLabel="Envoyer le message"
          accessibilityState={{ disabled: !canSend }}
        >
          <Feather
            name="send"
            size={18}
            color={canSend ? '#fff' : '#aaa'}
          />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
