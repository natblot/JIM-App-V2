import { ScrollView, View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';

// Écran Politique de Confidentialité — Story 1.10
// Conformité RGPD — données de santé professionnelle
export default function PrivacyScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-jim-background">
      {/* En-tête */}
      <View className="px-6 pt-14 pb-4 bg-jim-surface border-b border-jim-border">
        <Pressable
          className="w-11 h-11 items-center justify-center mb-2"
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Retour"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text className="text-jim-primary text-2xl">‹</Text>
        </Pressable>
        <Text className="text-2xl font-bold text-jim-text">
          Politique de Confidentialité
        </Text>
        <Text className="text-jim-muted text-sm mt-1">
          Version 1.0 — Entrée en vigueur le 1er avril 2026
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-6 py-6"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.duration(400)} className="gap-6">

          <View className="p-4 bg-jim-success/10 rounded-xl border border-jim-success/30">
            <Text className="text-jim-success font-semibold text-sm">
              Hébergement de données de santé
            </Text>
            <Text className="text-jim-muted text-sm mt-1 leading-5">
              JIM est hébergé sur une infrastructure certifiée HDS (Hébergeur de
              Données de Santé) conformément à l'article L.1111-8 du Code de la
              santé publique.
            </Text>
          </View>

          <Section title="1. Responsable du traitement">
            <Paragraph>
              SAS JIM{'\n'}
              Email : dpo@jim-app.fr{'\n'}
              Le Délégué à la Protection des Données (DPO) est joignable à
              l'adresse ci-dessus pour toute question relative au traitement de
              vos données personnelles.
            </Paragraph>
          </Section>

          <Section title="2. Données collectées">
            <Paragraph>
              <Text className="font-semibold">Données d'identité professionnelle :{'\n'}</Text>
              Prénom, nom, numéro RPPS, spécialité, adresse du cabinet, photo
              de profil (optionnelle).
            </Paragraph>
            <Paragraph>
              <Text className="font-semibold">Données de connexion :{'\n'}</Text>
              Adresse email, logs de connexion, adresse IP (conservés 12 mois).
            </Paragraph>
            <Paragraph>
              <Text className="font-semibold">Données transactionnelles :{'\n'}</Text>
              Historique des annonces, candidatures, contrats de remplacement,
              évaluations mutuelles.
            </Paragraph>
            <Paragraph>
              <Text className="font-semibold">Données de paiement :{'\n'}</Text>
              Gérées exclusivement par Stripe (PCI-DSS). JIM ne stocke aucune
              donnée bancaire.
            </Paragraph>
          </Section>

          <Section title="3. Finalités du traitement">
            <Paragraph>
              Vos données sont utilisées pour :{'\n'}
              • Vérifier votre identité professionnelle via l'Annuaire Santé (RPPS){'\n'}
              • Mettre en relation remplaçants et titulaires{'\n'}
              • Faciliter la conclusion et le suivi de contrats de remplacement{'\n'}
              • Traiter les paiements de rétrocession via Stripe Connect{'\n'}
              • Envoyer des notifications pertinentes (annonces, candidatures){'\n'}
              • Prévenir la fraude et l'usurpation d'identité{'\n'}
              • Améliorer les fonctionnalités de la plateforme (données agrégées)
            </Paragraph>
          </Section>

          <Section title="4. Bases légales">
            <Paragraph>
              • <Text className="font-semibold">Exécution du contrat</Text> :
              vérification RPPS, mise en relation, paiements{'\n'}
              • <Text className="font-semibold">Consentement explicite</Text> :
              notifications push, photo de profil{'\n'}
              • <Text className="font-semibold">Intérêt légitime</Text> :
              sécurité, prévention de la fraude, amélioration du service{'\n'}
              • <Text className="font-semibold">Obligation légale</Text> :
              conservation des logs d'audit (RGPD Art. 5)
            </Paragraph>
          </Section>

          <Section title="5. Durée de conservation">
            <Paragraph>
              • Données de compte : pendant la durée d'activité + 3 ans après
              désactivation{'\n'}
              • Logs d'audit : 12 mois{'\n'}
              • Données de paiement : 5 ans (obligation fiscale){'\n'}
              • Après exercice du droit à l'oubli : suppression sous 30 jours
            </Paragraph>
          </Section>

          <Section title="6. Partage des données">
            <Paragraph>
              JIM ne vend jamais vos données. Les données peuvent être partagées
              avec :{'\n'}
              • <Text className="font-semibold">Stripe</Text> : traitement des
              paiements (États-Unis — Clauses contractuelles types UE){'\n'}
              • <Text className="font-semibold">ANS (Agence du Numérique en Santé)</Text> :
              vérification RPPS via l'Annuaire Santé{'\n'}
              • <Text className="font-semibold">Autorités judiciaires</Text> :
              sur réquisition légale uniquement
            </Paragraph>
          </Section>

          <Section title="7. Vos droits RGPD">
            <Paragraph>
              Vous disposez des droits suivants, exerçables depuis l'application
              ou par email à dpo@jim-app.fr :{'\n'}
              • <Text className="font-semibold">Droit d'accès</Text> :
              télécharger l'export de vos données (Paramètres → Mes données){'\n'}
              • <Text className="font-semibold">Droit de rectification</Text> :
              modifier vos informations de profil{'\n'}
              • <Text className="font-semibold">Droit à l'oubli</Text> :
              supprimer votre compte (Paramètres → Supprimer mon compte){'\n'}
              • <Text className="font-semibold">Droit à la portabilité</Text> :
              export JSON de vos données{'\n'}
              • <Text className="font-semibold">Droit d'opposition</Text> :
              désactiver les notifications marketing{'\n'}
              • <Text className="font-semibold">Droit de réclamation</Text> :
              auprès de la CNIL (www.cnil.fr)
            </Paragraph>
          </Section>

          <Section title="8. Cookies et traceurs">
            <Paragraph>
              L'application mobile n'utilise pas de cookies. Des identifiants
              techniques anonymes (tokens Expo) sont stockés localement sur votre
              appareil via expo-secure-store pour votre session et les notifications
              push. Ces données restent sur votre appareil.
            </Paragraph>
          </Section>

          <Section title="9. Sécurité">
            <Paragraph>
              • Chiffrement TLS 1.3 de toutes les communications{'\n'}
              • Tokens d'accès : 15 minutes de durée de vie{'\n'}
              • Stockage sécurisé des tokens (iOS Keychain / Android Keystore){'\n'}
              • Infrastructure HDS avec chiffrement au repos{'\n'}
              • Audit de sécurité annuel
            </Paragraph>
          </Section>

          <Section title="10. Modifications">
            <Paragraph>
              En cas de modification substantielle de cette politique, vous serez
              notifié dans l'application et invité à donner un nouveau consentement.
            </Paragraph>
          </Section>

          <View className="mt-4 p-4 bg-jim-primary/10 rounded-xl">
            <Text className="text-jim-primary text-sm text-center font-medium">
              DPO : dpo@jim-app.fr
            </Text>
            <Text className="text-jim-muted text-xs text-center mt-1">
              Réponse sous 30 jours (délai légal RGPD)
            </Text>
          </View>

        </Animated.View>
      </ScrollView>
    </View>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View className="gap-2">
      <Text className="text-jim-text font-bold text-base">{title}</Text>
      {children}
    </View>
  );
}

function Paragraph({ children }: { children: React.ReactNode }) {
  return (
    <Text className="text-jim-muted text-sm leading-6">{children}</Text>
  );
}
