// Écran de preview développement — à supprimer avant prod
import { ScrollView, Text, View } from 'react-native';
import { KineProfileCard } from '@jim/ui';
import type { KineProfileCardData } from '@jim/ui';

const MOCK_AVEC_PHOTO: KineProfileCardData = {
  id: '1',
  userId: 'u1',
  firstName: 'Sophie',
  lastName: 'Martin',
  avatarUrl: null,
  bio: 'Kiné spécialisée en rééducation post-opératoire et neurologie adulte. 8 ans d'expérience en cabinet libéral à Lyon.',
  specialties: ['Neurologie', 'Post-op', 'Pédiatrie', 'Sport'],
  mobilityRadiusKm: 50,
  city: 'Lyon',
  department: '69',
  rppsVerified: true,
  scoreFiabilite: 4.8,
};

const MOCK_NOUVEAU: KineProfileCardData = {
  id: '2',
  userId: 'u2',
  firstName: 'Thomas',
  lastName: 'Berger',
  avatarUrl: null,
  bio: null,
  specialties: ['Respiratoire'],
  mobilityRadiusKm: 30,
  city: 'Bordeaux',
  department: '33',
  rppsVerified: false,
  scoreFiabilite: null,
};

const MOCK_MINIMAL: KineProfileCardData = {
  id: '3',
  userId: 'u3',
  firstName: 'Léa',
  lastName: 'Rousseau',
  avatarUrl: null,
  bio: 'Disponible pour remplacements courts et longs en région parisienne.',
  specialties: ['Gériatrie', 'Domicile'],
  mobilityRadiusKm: 20,
  city: 'Paris',
  department: '75',
  rppsVerified: true,
  scoreFiabilite: 3.6,
};

export default function DevPreview() {
  return (
    <ScrollView
      className="flex-1 bg-jim-background"
      contentContainerClassName="px-4 py-8 gap-6"
    >
      <Text className="text-jim-text font-bold text-xl">KineProfileCard — default</Text>

      <KineProfileCard profile={MOCK_AVEC_PHOTO} animationDelay={0} onPress={() => {}} />
      <KineProfileCard profile={MOCK_NOUVEAU} animationDelay={60} onPress={() => {}} />
      <KineProfileCard profile={MOCK_MINIMAL} animationDelay={120} onPress={() => {}} />

      <Text className="text-jim-text font-bold text-xl mt-4">KineProfileCard — compact</Text>

      <View className="gap-3">
        <KineProfileCard
          profile={MOCK_AVEC_PHOTO}
          variant="compact"
          animationDelay={180}
          onPress={() => {}}
        />
        <KineProfileCard
          profile={MOCK_NOUVEAU}
          variant="compact"
          animationDelay={210}
          onPress={() => {}}
        />
        <KineProfileCard
          profile={MOCK_MINIMAL}
          variant="compact"
          animationDelay={240}
          onPress={() => {}}
        />
      </View>
    </ScrollView>
  );
}
