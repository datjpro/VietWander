import { Router } from 'express';
import { env } from '../config/env.js';
import { asyncHandler } from '../lib/async-handler.js';
import { validateBootstrapDemoPayload } from '../lib/request-validation.js';
import { requireAnyRole } from '../middleware/authorize.js';
import { createRateLimitMiddleware } from '../middleware/rate-limit.js';
import { requireWriteIntent } from '../middleware/require-write-intent.js';

export function createBootstrapRouter({ travelService }) {
  const router = Router();
  const writeRateLimit = createRateLimitMiddleware({
    keyPrefix: 'bootstrap-write',
    max: env.writeRateLimitMax,
    windowMs: env.writeRateLimitWindowMs
  });

  router.post(
    '/demo-data',
    requireAnyRole(['admin', 'demo-manager']),
    requireWriteIntent,
    writeRateLimit,
    asyncHandler(async (req, res) => {
      validateBootstrapDemoPayload(req.body);
      const result = await travelService.bootstrapDemoData();
      res.status(201).json(result);
    })
  );

  return router;
}
