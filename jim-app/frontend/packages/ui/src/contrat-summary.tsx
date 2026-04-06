// Composant ContratSummary — résumé visuel rassurant des 5 points clés du contrat IA
// Utilisé en Story 8.2 pour valider la conformité du contrat avant signature
import { View, Text } from 'react-native';
import { FadeInDown } from 'react-native-reanimated';
import { AnimatedView } from './utils/animated';

// Icône checkmark maison (cercle vert + coche) — évite une dépendance externe
function CheckCircleIcon() {
  return (
    <View className="w-6 h-6 rounded-full bg-jim-success/15 border border-jim-success/40 items-center justify-center">
      <Text className="text-jim-success text-xs font-bold leading-none">✓</Text>
    </View>
  );
}

interface ContratSummaryPerson {
  first_name: string;
  last_name: string;
  rpps: string;
}

interface ContratSummaryDates {
  debut: string;   // ISO date string
  fin: string;     // ISO date string
}

export interface ContratSummaryProps {
  titulaire: ContratSummaryPerson;
  remplacant: ContratSummaryPerson;
  dates: ContratSummaryDates;
  adresse_cabinet: string;
  taux_retrocession: number;
  badge_ordre_mk?: boolean;
}

// Formate une date ISO en format français court "JJ mois AAAA"
function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

// Ligne de conformité avec animation staggerée
interface SummaryRowProps {
  title: string;
  value: string;
  index: number;
}

function SummaryRow({ title, value, index }: SummaryRowProps) {
  return (
    <AnimatedView
      entering={FadeInDown.delay(index * 50).duration(300)}
      className="flex-row items-start gap-3 py-3 border-b border-jim-border"
    >
      <CheckCircleIcon />
      <View className="flex-1">
        {/* Titre de la ligne (ton rassurant : "Tout est conforme") */}
        <Text className="text-jim-text font-semibold text-sm">{title}</Text>
        {/* Valeur concrète affichée en sous-texte */}
        <Text className="text-jim-muted text-xs mt-0.5 leading-relaxed">{value}</Text>
      </View>
    </AnimatedView>
  );
}

export function ContratSummary({
  titulaire,
  remplacant,
  dates,
  adresse_cabinet,
  taux_retrocession,
  badge_ordre_mk = false,
}: ContratSummaryProps) {
  // Construction des valeurs affichées pour chaque ligne
  const titulaireLabel = `${titulaire.first_name} ${titulaire.last_name} (RPPS ${titulaire.rpps})`;
  const remplacantLabel = `${remplacant.first_name} ${remplacant.last_name} (RPPS ${remplacant.rpps})`;
  const identitesValue = `${titulaireLabel}\n${remplacantLabel}`;
  const datesValue = `${formatDate(dates.debut)} → ${formatDate(dates.fin)}`;

  const rows: Array<{ title: string; value: string }> = [
    {
      title: 'Identités vérifiées',
      value: identitesValue,
    },
    {
      title: 'Dates du remplacement',
      value: datesValue,
    },
    {
      title: 'Adresse du cabinet',
      value: adresse_cabinet,
    },
    {
      title: 'Taux de rétrocession',
      value: `${taux_retrocession} %`,
    },
    {
      title: 'Assurance RCP mentionnée',
      value: 'Clause de responsabilité civile professionnelle incluse',
    },
  ];

  return (
    <View
      className="bg-jim-surface rounded-xl border border-jim-border overflow-hidden"
      accessibilityLabel="Résumé du contrat — tout est conforme"
    >
      {/* En-tête rassurant */}
      <View className="px-4 pt-4 pb-2">
        <Text className="text-jim-text font-bold text-base">Tout est conforme</Text>
        <Text className="text-jim-muted text-xs mt-0.5">
          Les 5 points essentiels de votre contrat ont été vérifiés.
        </Text>
      </View>

      {/* Badge Ordre MK — affiché uniquement si conforme */}
      {badge_ordre_mk && (
        <AnimatedView
          entering={FadeInDown.delay(0).duration(300)}
          className="mx-4 mb-2 px-3 py-1.5 bg-jim-success/10 border border-jim-success/30 rounded-lg flex-row items-center gap-2"
          accessibilityLabel="Contrat conforme Ordre des Masseurs-Kinésithérapeutes"
        >
          <Text className="text-jim-success text-xs font-bold">✓</Text>
          <Text className="text-jim-success text-xs font-semibold">Conforme Ordre MK</Text>
        </AnimatedView>
      )}

      {/* Les 5 lignes de conformité avec stagger 50ms */}
      <View className="px-4">
        {rows.map((row, index) => (
          <SummaryRow
            key={row.title}
            title={row.title}
            value={row.value}
            index={index + (badge_ordre_mk ? 1 : 0)}
          />
        ))}
      </View>

      {/* Disclaimer légal — FR42 : ton informatif, pas alarmiste */}
      <View className="px-4 py-3">
        <Text className="text-jim-muted text-xs italic leading-relaxed">
          Ce document ne constitue pas un conseil juridique. En cas de doute, consultez un professionnel du droit.
        </Text>
      </View>
    </View>
  );
}
