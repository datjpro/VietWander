import { onRequest } from 'firebase-functions/v2/https';
import { createApp } from './src/app.js';

const app = createApp();

export const api = onRequest(
  {
    region: 'asia-southeast1',
    timeoutSeconds: 60,
    memory: '512MiB',
  },
  app
);
