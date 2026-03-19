import { applicationDefault, cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { Firestore, getFirestore } from 'firebase-admin/firestore';
import { env, hasFirebaseAdminConfig } from './env.js';

let adminAppInstance = null;
let firestoreInstance = null;
let authInstance = null;

export function getFirebaseAdminApp() {
  if (adminAppInstance) {
    return adminAppInstance;
  }

  if (!hasFirebaseAdminConfig()) {
    return null;
  }

  const existingApp = getApps()[0];
  adminAppInstance =
    existingApp ??
    initializeApp({
      credential:
        env.firebaseClientEmail && env.firebasePrivateKey
          ? cert({
              projectId: env.firebaseProjectId,
              clientEmail: env.firebaseClientEmail,
              privateKey: env.firebasePrivateKey
            })
          : applicationDefault(),
      projectId: env.firebaseProjectId,
      storageBucket: env.firebaseStorageBucket || undefined
    });

  return adminAppInstance;
}

export function getFirestoreAdmin() {
  if (firestoreInstance) {
    return firestoreInstance;
  }

  const app = getFirebaseAdminApp();

  if (!app) {
    return null;
  }

  firestoreInstance = getFirestore(app);
  firestoreInstance.settings({ ignoreUndefinedProperties: true });

  return firestoreInstance;
}

export function getFirebaseAuthAdmin() {
  if (authInstance) {
    return authInstance;
  }

  const app = getFirebaseAdminApp();

  if (!app) {
    return null;
  }

  authInstance = getAuth(app);
  return authInstance;
}

export function getDatabaseMode() {
  if (env.useMemoryDatabase) {
    return 'memory';
  }

  return getFirestoreAdmin() instanceof Firestore ? 'firestore' : 'memory';
}
