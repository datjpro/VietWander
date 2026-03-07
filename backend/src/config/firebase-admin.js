import { applicationDefault, cert, getApps, initializeApp } from 'firebase-admin/app';
import { Firestore, getFirestore } from 'firebase-admin/firestore';
import { env, hasFirebaseAdminConfig } from './env.js';

let firestoreInstance = null;

export function getFirestoreAdmin() {
  if (firestoreInstance) {
    return firestoreInstance;
  }

  if (!hasFirebaseAdminConfig()) {
    return null;
  }

  const existingApp = getApps()[0];
  const app =
    existingApp ??
    initializeApp({
      credential:
        env.firebaseClientEmail && env.firebasePrivateKey
          ? cert({
              projectId: env.firebaseProjectId,
              clientEmail: env.firebaseClientEmail,
              privateKey: env.firebasePrivateKey,
            })
          : applicationDefault(),
      projectId: env.firebaseProjectId,
      storageBucket: env.firebaseStorageBucket || undefined,
    });

  firestoreInstance = getFirestore(app);
  firestoreInstance.settings({ ignoreUndefinedProperties: true });

  return firestoreInstance;
}

export function getDatabaseMode() {
  if (env.useMemoryDatabase) {
    return 'memory';
  }

  return getFirestoreAdmin() instanceof Firestore ? 'firestore' : 'memory';
}
