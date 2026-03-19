import { Router } from 'express';
import { env } from '../config/env.js';
import { asyncHandler } from '../lib/async-handler.js';
import { validateUserIdParam, validateUserUpdateInput } from '../lib/request-validation.js';
import { requireSelfOrAdmin } from '../middleware/authorize.js';
import { createRateLimitMiddleware } from '../middleware/rate-limit.js';
import { requireWriteIntent } from '../middleware/require-write-intent.js';

export function createUsersRouter({ travelService }) {
  const router = Router();
  const writeRateLimit = createRateLimitMiddleware({
    keyPrefix: 'users-write',
    max: env.writeRateLimitMax,
    windowMs: env.writeRateLimitWindowMs
  });

  router.get(
    '/:userId',
    requireSelfOrAdmin('userId'),
    asyncHandler(async (req, res) => {
      const userId = validateUserIdParam(req.params.userId);
      res.json(await travelService.getUser(userId));
    })
  );

  router.put(
    '/:userId',
    requireSelfOrAdmin('userId'),
    requireWriteIntent,
    writeRateLimit,
    asyncHandler(async (req, res) => {
      const userId = validateUserIdParam(req.params.userId);
      const payload = validateUserUpdateInput(req.body);

      if (req.auth?.email) {
        payload.email = req.auth.email;
      }

      res.json(await travelService.upsertUser(userId, payload));
    })
  );

  router.patch(
    '/:userId',
    requireSelfOrAdmin('userId'),
    requireWriteIntent,
    writeRateLimit,
    asyncHandler(async (req, res) => {
      const userId = validateUserIdParam(req.params.userId);
      const payload = validateUserUpdateInput(req.body);

      if (req.auth?.email) {
        payload.email = req.auth.email;
      }

      res.json(await travelService.upsertUser(userId, payload));
    })
  );

  return router;
}
