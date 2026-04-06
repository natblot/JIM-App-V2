// Storage adapter pour Zustand persist — détecte l'environnement et choisit le bon backend
// Expo Go → AsyncStorage | Dev Build → MMKV | Web → localStorage | SSR → noop
import { Platform } from 'react-native';
import type { StateStorage } from 'zustand/middleware';

// Déclarations pour environnements sans lib DOM (le package est cross-platform)
declare const window: unknown;

// Interface minimale localStorage (pas de lib DOM dans ce package)
interface WebStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

function isExpoGo(): boolean {
  if (Platform.OS === 'web') return false;
  try {
    const Constants = require('expo-constants').default;
    return Constants.appOwnership === 'expo';
  } catch {
    return false;
  }
}

export function createStorageAdapter(): StateStorage {
  // SSR (Next.js)
  if (typeof window === 'undefined') {
    return createNoopStorage();
  }

  // Web → localStorage
  if (Platform.OS === 'web') {
    return createWebStorage();
  }

  // Mobile Expo Go → AsyncStorage (async, pas de module natif)
  if (isExpoGo()) {
    return createAsyncStorageAdapter();
  }

  // Mobile Dev Build / Production → MMKV (sync, performance optimale)
  return createMMKVAdapter();
}

function createAsyncStorageAdapter(): StateStorage {
  const AsyncStorage = require('@react-native-async-storage/async-storage').default;
  return {
    getItem: async (name: string) => {
      const value = await AsyncStorage.getItem(name);
      return value ?? null;
    },
    setItem: async (name: string, value: string) => {
      await AsyncStorage.setItem(name, value);
    },
    removeItem: async (name: string) => {
      await AsyncStorage.removeItem(name);
    },
  };
}

function createMMKVAdapter(): StateStorage {
  const { MMKV } = require('react-native-mmkv');
  const mmkv = new MMKV();
  return {
    getItem: (name: string) => mmkv.getString(name) ?? null,
    setItem: (name: string, value: string) => mmkv.set(name, value),
    removeItem: (name: string) => mmkv.delete(name),
  };
}

function createNoopStorage(): StateStorage {
  return {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
  };
}

function createWebStorage(): StateStorage {
  const storage = (globalThis as unknown as { localStorage: WebStorage }).localStorage;
  return {
    getItem: (name: string) => storage.getItem(name),
    setItem: (name: string, value: string) => storage.setItem(name, value),
    removeItem: (name: string) => storage.removeItem(name),
  };
}
