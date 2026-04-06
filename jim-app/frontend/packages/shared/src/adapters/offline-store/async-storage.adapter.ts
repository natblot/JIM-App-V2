// Adapter AsyncStorage — compatible Expo Go (pas de module natif C++)
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { OfflineStore } from './offline-store.interface';

export const asyncStorageAdapter: OfflineStore = {
  async getItem(key: string): Promise<string | null> {
    return AsyncStorage.getItem(key);
  },

  async setItem(key: string, value: string): Promise<void> {
    await AsyncStorage.setItem(key, value);
  },

  async removeItem(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  },

  async getAllKeys(): Promise<string[]> {
    const keys = await AsyncStorage.getAllKeys();
    return [...keys];
  },

  async clear(): Promise<void> {
    await AsyncStorage.clear();
  },
};
