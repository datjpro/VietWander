import { env, hasFirebaseAdminConfig } from '../config/env.js';
import { createFirestoreRepository } from './firestore-repository.js';
import { createMemoryRepository } from './memory-repository.js';

let repositoryInstance = null;

export function getRepository() {
  if (repositoryInstance) {
    return repositoryInstance;
  }

  if (!env.useMemoryDatabase && hasFirebaseAdminConfig()) {
    repositoryInstance = createFirestoreRepository();
    return repositoryInstance;
  }

  repositoryInstance = createMemoryRepository();
  return repositoryInstance;
}
