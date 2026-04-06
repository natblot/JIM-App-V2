import { ScrollView, View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';

// Écran Conditions Générales d'Utilisation — Story 1.10
// Version 1.0 — MVP JIM (en attente hébergement landing page Epic 13)
export default function CguScreen() {
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
          Conditions Générales d'Utilisation
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

          <Section title="1. Objet">
            <Paragraph>
              Les présentes Conditions Générales d'Utilisation (CGU) régissent
              l'accès et l'utilisation de la plateforme JIM (Job In Med), éditée
              par SAS JIM, plateforme de mise en relation entre kinésithérapeutes
              remplaçants et titulaires exerçant en France.
            </Paragraph>
          </Section>

          <Section title="2. Accès à la plateforme">
            <Paragraph>
              L'accès à JIM est réservé aux professionnels de santé inscrits au
              Répertoire Partagé des Professionnels de Santé (RPPS). Tout
              utilisateur doit fournir un numéro RPPS valide et correspondant à
              son identité.
            </Paragraph>
            <Paragraph>
              Toute tentative d'usurpation d'identité professionnelle entraîne la
              suspension immédiate du compte et peut faire l'objet d'un signalement
              aux autorités compétentes (Ordre national des masseurs-kinésithérapeutes).
            </Paragraph>
          </Section>

          <Section title="3. Fonctionnement de la marketplace">
            <Paragraph>
              JIM propose deux rôles distincts :{'\n'}
              • <Text className="font-semibold">Remplaçant</Text> : professionnel
              cherchant des missions de remplacement.{'\n'}
              • <Text className="font-semibold">Titulaire</Text> : professionnel
              proposant des remplacements dans son cabinet.
            </Paragraph>
            <Paragraph>
              JIM est un intermédiaire de mise en relation. Les contrats de
              remplacement sont conclus directement entre les parties. JIM n'est
              pas employeur et ne peut être tenu responsable des conditions de
              remplacement.
            </Paragraph>
          </Section>

          <Section title="4. Données personnelles">
            <Paragraph>
              JIM traite vos données personnelles conformément au RGPD
              (Règlement (UE) 2016/679) et à la loi Informatique et Libertés.
              Les données de santé (numéro RPPS, spécialité) sont des données
              sensibles au sens du RGPD et bénéficient d'une protection renforcée.
            </Paragraph>
            <Paragraph>
              Pour plus d'informations sur le traitement de vos données, consultez
              notre Politique de Confidentialité.
            </Paragraph>
          </Section>

          <Section title="5. Obligations de l'utilisateur">
            <Paragraph>
              L'utilisateur s'engage à :{'\n'}
              • Fournir des informations exactes et à jour{'\n'}
              • Ne pas usurper l'identité d'un autre professionnel{'\n'}
              • Respecter la confidentialité des échanges via la messagerie JIM{'\n'}
              • Ne pas utiliser la plateforme à des fins contraires à la
              déontologie médicale{'\n'}
              • Signaler tout contenu inapproprié via la fonction de signalement
            </Paragraph>
          </Section>

          <Section title="6. Contenu interdit">
            <Paragraph>
              Sont strictement interdits sur JIM :{'\n'}
              • Les annonces fictives ou mensongères{'\n'}
              • Le partage de coordonnées personnelles en dehors de la messagerie
              sécurisée JIM avant acceptation mutuelle{'\n'}
              • Tout propos discriminatoire, diffamatoire ou harcelant{'\n'}
              • L'utilisation automatisée (bots, scrapers) de la plateforme
            </Paragraph>
          </Section>

          <Section title="7. Paiements et rétrocessions">
            <Paragraph>
              Les paiements de rétrocession entre titulaires et remplaçants sont
              facilités par Stripe Connect. JIM prélève une commission de service
              conformément à la grille tarifaire en vigueur. Les transactions sont
              sécurisées et conformes aux normes PCI-DSS.
            </Paragraph>
          </Section>

          <Section title="8. Suspension et résiliation">
            <Paragraph>
              JIM se réserve le droit de suspendre ou résilier un compte en cas de
              violation des présentes CGU, d'usurpation d'identité, de comportement
              frauduleux, ou sur demande de l'Ordre des masseurs-kinésithérapeutes.
            </Paragraph>
            <Paragraph>
              L'utilisateur peut supprimer son compte à tout moment depuis les
              paramètres de l'application. Ses données personnelles seront effacées
              dans un délai de 30 jours (droit à l'oubli RGPD).
            </Paragraph>
          </Section>

          <Section title="9. Responsabilité">
            <Paragraph>
              JIM s'efforce de maintenir la disponibilité de la plateforme 24h/24
              et 7j/7, mais ne peut garantir une disponibilité sans interruption.
              JIM n'est pas responsable des préjudices résultant d'une indisponibilité
              temporaire du service.
            </Paragraph>
          </Section>

          <Section title="10. Modification des CGU">
            <Paragraph>
              JIM peut modifier les présentes CGU à tout moment. Les utilisateurs
              seront notifiés par l'application et invités à re-accepter les nouvelles
              conditions avant de continuer à utiliser la plateforme.
            </Paragraph>
          </Section>

          <Section title="11. Droit applicable">
            <Paragraph>
              Les présentes CGU sont soumises au droit français. En cas de litige,
              et à défaut de résolution amiable, les tribunaux français seront seuls
              compétents.
            </Paragraph>
          </Section>

          <View className="mt-4 p-4 bg-jim-primary/10 rounded-xl">
            <Text className="text-jim-primary text-sm text-center font-medium">
              Pour toute question : support@jim-app.fr
            </Text>
          </View>

        </Animated.View>
      </ScrollView>
    </View>
  );
}

// Composants locaux de mise en page
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
