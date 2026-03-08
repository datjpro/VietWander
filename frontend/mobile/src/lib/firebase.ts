import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, type Persistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { Platform } from 'react-native';
import * as reactNativeAuth from '@firebase/auth';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? 'AIzaSyCevIsxM9c-dU5kswzg6AiXY5sFVzxtAOQ',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ?? 'vietwander-fdf99.firebaseapp.com',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? 'vietwander-fdf99',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ?? 'vietwander-fdf99.firebasestorage.app',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '121533003805',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID ?? '1:121533003805:web:bafe967b94f4a4fe10eef4',
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID ?? 'G-290RLYJ2E4',
};

type ReactNativeAuthModule = typeof reactNativeAuth & {
  getReactNativePersistence?: (storage: typeof AsyncStorage) => Persistence;
};

const nativeAuthModule = reactNativeAuth as ReactNativeAuthModule;

export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = (() => {
  if (Platform.OS === 'web') {
    return getAuth(firebaseApp);
  }

  try {
    if (nativeAuthModule.getReactNativePersistence) {
      return initializeAuth(firebaseApp, {
        persistence: nativeAuthModule.getReactNativePersistence(AsyncStorage),
      });
    }

    return initializeAuth(firebaseApp);
  } catch {
    return getAuth(firebaseApp);
  }
})();

export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);
