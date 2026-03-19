import { Router } from 'express';
import { env } from '../config/env.js';
import { asyncHandler } from '../lib/async-handler.js';
import {
  readLimitQuery,
  validateCreateCheckinInput,
  validateProvinceIdParam,
  validateUserIdParam
} from '../lib/request-validation.js';
import { assertSelfOrAdmin, requireAuth } from '../middleware/authorize.js';
import { createRateLimitMiddleware } from '../middleware/rate-limit.js';
import { requireWriteIntent } from '../middleware/require-write-intent.js';

export function createCheckinsRouter({ travelService }) {
  const router = Router();
  const writeRateLimit = createRateLimitMiddleware({
    keyPrefix: 'checkins-write',
    max: env.writeRateLimitMax,
    windowMs: env.writeRateLimitWindowMs
  });

  router.get(
    '/',
    asyncHandler(async (req, res) => {
      const limit = readLimitQuery(req.query.limit, 20);
      const userId = req.query.userId === undefined ? undefined : validateUserIdParam(req.query.userId);
      const provinceId = req.query.provinceId === undefined ? undefined : validateProvinceIdParam(req.query.provinceId);

      if (userId) {
        assertSelfOrAdmin(req, userId);
      }

      const items = await travelService.listCheckins({
        userId,
        provinceId,
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
      const input = validateCreateCheckinInput(req.body);
      const result = await travelService.createCheckin({
        ...input,
        userId: req.auth.uid
      });
      res.status(201).json(result);
    })
  );

  return router;
}
