// Composant ContratClause — affiche une clause de contrat, verrouillée ou éditable
// Utilisé dans le formulaire de génération/révision de contrat (Epic 8)
import { useState } from 'react';
import { View, Text, Pressable, TextInput, Modal, ScrollView } from 'react-native';
import { cn } from './utils/cn';

export interface ContratClauseProps {
  title: string;
  content: string;
  editable?: boolean;
  onEdit?: (content: string) => void;
}

// Icône cadenas minimaliste — clause non modifiable
function LockIcon() {
  return (
    <View className="w-5 h-5 items-center justify-center">
      {/* Corps du cadenas */}
      <View className="w-3.5 h-2.5 rounded-sm bg-jim-muted border border-jim-muted mt-1" />
      {/* Arceau du cadenas */}
      <View
        className="absolute top-0 w-2.5 h-2 border-2 border-jim-muted rounded-t-full"
        style={{ borderBottomWidth: 0 }}
      />
    </View>
  );
}

// Icône crayon minimaliste — clause éditable
function EditIcon() {
  return (
    <View className="w-5 h-5 items-center justify-center">
      <Text className="text-jim-primary text-xs leading-none" style={{ transform: [{ rotate: '-45deg' }] }}>
        ✏
      </Text>
    </View>
  );
}

export function ContratClause({
  title,
  content,
  editable = false,
  onEdit,
}: ContratClauseProps) {
  // État local pour la modal d'édition
  const [isModalVisible, setIsModalVisible] = useState(false);
  // Brouillon de contenu en cours d'édition
  const [draftContent, setDraftContent] = useState(content);

  // Validation et fermeture de la modal d'édition
  function handleSave() {
    onEdit?.(draftContent);
    setIsModalVisible(false);
  }

  // Annulation sans sauvegarder — reset du brouillon
  function handleCancel() {
    setDraftContent(content);
    setIsModalVisible(false);
  }

  // Ouverture de la modal — reset du brouillon au contenu courant
  function handlePressEdit() {
    setDraftContent(content);
    setIsModalVisible(true);
  }

  if (!editable) {
    // Mode verrouillé : fond gris, icône cadenas, texte non interactif
    return (
      <View
        className="bg-jim-background border border-jim-border rounded-xl px-4 py-3 gap-2"
        accessibilityLabel={`Clause verrouillée : ${title}`}
      >
        {/* En-tête : titre + icône cadenas */}
        <View className="flex-row items-center justify-between">
          <Text className="text-jim-muted font-semibold text-sm flex-1 mr-2">{title}</Text>
          <LockIcon />
        </View>

        {/* Contenu de la clause — non interactif */}
        <Text className="text-jim-muted text-sm leading-relaxed">{content}</Text>
      </View>
    );
  }

  // Mode éditable : fond blanc, icône crayon, pression → modal TextInput
  return (
    <>
      {/* Clause éditable — tap ouvre la modal */}
      <Pressable
        className={cn(
          'bg-jim-surface border border-jim-border rounded-xl px-4 py-3 gap-2',
          // Feedback visuel au tap
          'active:border-jim-primary active:bg-jim-primary/5'
        )}
        // Hauteur minimale 44 points (NFR45)
        style={{ minHeight: 44 }}
        onPress={handlePressEdit}
        accessibilityRole="button"
        accessibilityLabel={`Modifier la clause : ${title}`}
        accessibilityHint="Double-tapez pour modifier le contenu de cette clause"
      >
        {/* En-tête : titre + icône crayon */}
        <View className="flex-row items-center justify-between">
          <Text className="text-jim-text font-semibold text-sm flex-1 mr-2">{title}</Text>
          <EditIcon />
        </View>

        {/* Aperçu du contenu */}
        <Text className="text-jim-muted text-sm leading-relaxed">{content}</Text>
      </Pressable>

      {/* Modal d'édition plein écran */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleCancel}
      >
        <View className="flex-1 bg-jim-background">
          {/* Barre d'action : Annuler / Titre / Enregistrer */}
          <View className="flex-row items-center justify-between px-4 py-3 bg-jim-surface border-b border-jim-border">
            <Pressable
              onPress={handleCancel}
              style={{ minHeight: 44, minWidth: 44, justifyContent: 'center' }}
              accessibilityRole="button"
              accessibilityLabel="Annuler la modification"
            >
              <Text className="text-jim-muted text-base">Annuler</Text>
            </Pressable>

            <Text className="text-jim-text font-semibold text-base flex-1 text-center" numberOfLines={1}>
              {title}
            </Text>

            <Pressable
              onPress={handleSave}
              style={{ minHeight: 44, minWidth: 44, justifyContent: 'center', alignItems: 'flex-end' }}
              accessibilityRole="button"
              accessibilityLabel="Enregistrer la modification"
            >
              <Text className="text-jim-primary font-semibold text-base">Enregistrer</Text>
            </Pressable>
          </View>

          {/* Zone de saisie scrollable */}
          <ScrollView className="flex-1 px-4 py-3">
            <TextInput
              value={draftContent}
              onChangeText={setDraftContent}
              multiline
              textAlignVertical="top"
              className="text-jim-text text-sm leading-relaxed bg-jim-surface border border-jim-border rounded-xl p-4"
              style={{ minHeight: 200 }}
              autoFocus
              accessibilityLabel={`Zone de modification du contenu de la clause : ${title}`}
            />

            {/* Avertissement : modifications personnalisées sous responsabilité de l'utilisateur */}
            <Text className="text-jim-muted text-xs italic mt-3 px-1 leading-relaxed">
              Les clauses personnalisées sont sous votre responsabilité. Ce document ne constitue pas un conseil juridique.
            </Text>
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}
