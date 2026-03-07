import { Router } from 'express';
import { asyncHandler } from '../lib/async-handler.js';
import { parseLimit } from '../lib/validation.js';

export function createPostsRouter({ travelService }) {
  const router = Router();

  router.get(
    '/',
    asyncHandler(async (req, res) => {
      const limit = parseLimit(req.query.limit, 20);
      const items = await travelService.listPosts({
        provinceId: req.query.provinceId,
        userId: req.query.userId,
        limit,
      });
      res.json({ items, count: items.length });
    })
  );

  router.post(
    '/',
    asyncHandler(async (req, res) => {
      const post = await travelService.createPost(req.body);
      res.status(201).json(post);
    })
  );

  return router;
}
