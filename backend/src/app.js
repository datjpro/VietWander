import express from 'express';
import cors from 'cors';
import { healthRouter } from './routes/health.js';
import { provincesRouter } from './routes/provinces.js';
import { feedRouter } from './routes/feed.js';

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use('/health', healthRouter);
  app.use('/api/provinces', provincesRouter);
  app.use('/api/feed', feedRouter);

  return app;
}
