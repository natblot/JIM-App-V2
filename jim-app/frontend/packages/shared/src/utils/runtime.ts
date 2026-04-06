// Détection de l'environnement d'exécution — Expo Go vs Dev Build vs Web
import { Platform } from 'react-native';
import Constants from 'expo-constants';

export function isExpoGo(): boolean {
  if (Platform.OS === 'web') return false;
  return Constants.appOwnership === 'expo';
}

export function isDevBuild(): boolean {
  if (Platform.OS === 'web') return false;
  return Constants.appOwnership !== 'expo';
}

export function getRuntimeLabel(): 'web' | 'expo-go' | 'dev-build' {
  if (Platform.OS === 'web') return 'web';
  if (isExpoGo()) return 'expo-go';
  return 'dev-build';
}
