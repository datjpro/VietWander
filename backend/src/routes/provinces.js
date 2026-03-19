import { Router } from 'express';
import { env } from '../config/env.js';
import { asyncHandler } from '../lib/async-handler.js';
import {
  readLimitQuery,
  validateBootstrapDemoPayload,
  validateProvinceIdParam,
  validateProvinceUpsertInput
} from '../lib/request-validation.js';
import { requireAdmin } from '../middleware/authorize.js';
import { createRateLimitMiddleware } from '../middleware/rate-limit.js';
import { requireWriteIntent } from '../middleware/require-write-intent.js';

export function createProvincesRouter({ travelService }) {
  const router = Router();
  const writeRateLimit = createRateLimitMiddleware({
    keyPrefix: 'provinces-write',
    max: env.writeRateLimitMax,
    windowMs: env.writeRateLimitWindowMs
  });

  router.post(
    '/seed',
    requireAdmin,
    requireWriteIntent,
    writeRateLimit,
    asyncHandler(async (req, res) => {
      const options = validateBootstrapDemoPayload(req.body);
      const items = await travelService.seedProvinces({ overwrite: options.overwrite });
      res.status(201).json({ items, count: items.length });
    })
  );

  router.get(
    '/',
    asyncHandler(async (_req, res) => {
      const items = await travelService.listProvinces();
      res.json({ items, count: items.length });
    })
  );

  router.get(
    '/:provinceId/posts',
    asyncHandler(async (req, res) => {
      const provinceId = validateProvinceIdParam(req.params.provinceId);
      const limit = readLimitQuery(req.query.limit, 20);
      const items = await travelService.listProvincePosts(provinceId, { limit });
      res.json({ items, count: items.length });
    })
  );

  router.get(
    '/:provinceId',
    asyncHandler(async (req, res) => {
      const provinceId = validateProvinceIdParam(req.params.provinceId);
      res.json(await travelService.getProvince(provinceId));
    })
  );

  router.put(
    '/:provinceId',
    requireAdmin,
    requireWriteIntent,
    writeRateLimit,
    asyncHandler(async (req, res) => {
      const provinceId = validateProvinceIdParam(req.params.provinceId);
      const payload = validateProvinceUpsertInput(req.body);
      res.json(await travelService.upsertProvince(provinceId, payload));
    })
  );

  return router;
}
