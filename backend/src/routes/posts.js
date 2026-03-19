import { Router } from 'express';
import { env } from '../config/env.js';
import { asyncHandler } from '../lib/async-handler.js';
import {
  readLimitQuery,
  validateCreatePostInput,
  validateProvinceIdParam,
  validateUserIdParam
} from '../lib/request-validation.js';
import { assertSelfOrAdmin, requireAuth } from '../middleware/authorize.js';
import { createRateLimitMiddleware } from '../middleware/rate-limit.js';
import { requireWriteIntent } from '../middleware/require-write-intent.js';

export function createPostsRouter({ travelService }) {
  const router = Router();
  const writeRateLimit = createRateLimitMiddleware({
    keyPrefix: 'posts-write',
    max: env.writeRateLimitMax,
    windowMs: env.writeRateLimitWindowMs
  });

  router.get(
    '/',
    asyncHandler(async (req, res) => {
      const limit = readLimitQuery(req.query.limit, 20);
      const provinceId = req.query.provinceId === undefined ? undefined : validateProvinceIdParam(req.query.provinceId);
      const userId = req.query.userId === undefined ? undefined : validateUserIdParam(req.query.userId);

      if (userId) {
        assertSelfOrAdmin(req, userId);
      }

      const items = await travelService.listPosts({
        provinceId,
        userId,
        limit
      });
      res.json({ items, count: items.length });
    })
  );

  router.post(
    '/',
    requireAuth,
    requireWriteIntent,
    writeRateLimit,
    asyncHandler(async (req, res) => {
      const input = validateCreatePostInput(req.body);
      const post = await travelService.createPost({
        ...input,
        userId: req.auth.uid
      });
      res.status(201).json(post);
    })
  );

  return router;
}
