import { Router } from 'express';
import { feedPosts } from '../data/mock.js';

export const feedRouter = Router();

feedRouter.get('/', (_req, res) => {
  res.json({ items: feedPosts });
});
