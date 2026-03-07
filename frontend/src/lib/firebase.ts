import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, type Persistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { Platform } from 'react-native';
import * as reactNativeAuth from '@firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyCevIsxM9c-dU5kswzg6AiXY5sFVzxtAOQ',
  authDomain: 'vietwander-fdf99.firebaseapp.com',
  projectId: 'vietwander-fdf99',
  storageBucket: 'vietwander-fdf99.firebasestorage.app',
  messagingSenderId: '121533003805',
  appId: '1:121533003805:web:bafe967b94f4a4fe10eef4',
  measurementId: 'G-290RLYJ2E4',
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
