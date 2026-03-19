import { getApp, getApps, initializeApp } from 'firebase/app';
import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

const runtimeConfig = globalThis.__VIETWANDER_CONFIG__ || {};

const defaultFirebaseConfig = {
  apiKey: 'AIzaSyCevIsxM9c-dU5kswzg6AiXY5sFVzxtAOQ',
  authDomain: 'vietwander-fdf99.firebaseapp.com',
  projectId: 'vietwander-fdf99',
  storageBucket: 'vietwander-fdf99.firebasestorage.app',
  messagingSenderId: '121533003805',
  appId: '1:121533003805:web:bafe967b94f4a4fe10eef4',
  measurementId: 'G-290RLYJ2E4'
};

const firebaseConfig = {
  apiKey: runtimeConfig.VITE_FIREBASE_API_KEY || defaultFirebaseConfig.apiKey,
  authDomain: runtimeConfig.VITE_FIREBASE_AUTH_DOMAIN || defaultFirebaseConfig.authDomain,
  projectId: runtimeConfig.VITE_FIREBASE_PROJECT_ID || defaultFirebaseConfig.projectId,
  storageBucket: runtimeConfig.VITE_FIREBASE_STORAGE_BUCKET || defaultFirebaseConfig.storageBucket,
  messagingSenderId: runtimeConfig.VITE_FIREBASE_MESSAGING_SENDER_ID || defaultFirebaseConfig.messagingSenderId,
  appId: runtimeConfig.VITE_FIREBASE_APP_ID || defaultFirebaseConfig.appId,
  measurementId: runtimeConfig.VITE_FIREBASE_MEASUREMENT_ID || defaultFirebaseConfig.measurementId
};

const requiredKeys = ['apiKey', 'authDomain', 'projectId', 'appId'];
export const firebaseEnabled = requiredKeys.every((key) => Boolean(firebaseConfig[key]));

export const firebaseApp = firebaseEnabled
  ? getApps().length
    ? getApp()
    : initializeApp(firebaseConfig)
  : null;

export const auth = firebaseApp ? getAuth(firebaseApp) : null;
export const storage = firebaseApp ? getStorage(firebaseApp) : null;
export const canUploadCheckinImages = Boolean(storage);

if (auth) {
  setPersistence(auth, browserLocalPersistence).catch(() => undefined);
}

export function observeAuth(callback) {
  if (!auth) {
    callback(null);
    return () => undefined;
  }

  return onAuthStateChanged(auth, callback);
}

export async function loginWithEmail({ email, password }) {
  if (!auth) {
    throw new Error('Firebase Auth chưa được cấu hình cho web.');
  }

  const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
  return credential.user;
}

export async function registerWithEmail({ displayName, email, password }) {
  if (!auth) {
    throw new Error('Firebase Auth chưa được cấu hình cho web.');
  }

  const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);

  if (displayName.trim()) {
    await updateProfile(credential.user, { displayName: displayName.trim() });
  }

  return credential.user;
}

export async function logoutCurrentUser() {
  if (!auth) {
    return;
  }

  await signOut(auth);
}

function normalizeFileName(fileName) {
  return fileName.toLowerCase().replace(/[^a-z0-9.\-_]/g, '-');
}

export async function uploadCheckinImage(file, userId) {
  if (!storage) {
    throw new Error('Firebase Storage chưa được cấu hình cho web.');
  }

  const storageRef = ref(storage, `checkins/${userId}/${Date.now()}-${normalizeFileName(file.name)}`);
  const snapshot = await uploadBytes(storageRef, file, {
    contentType: file.type || 'image/jpeg'
  });

  return getDownloadURL(snapshot.ref);
}
