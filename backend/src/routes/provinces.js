import { Router } from 'express';
import { asyncHandler } from '../lib/async-handler.js';
import { parseLimit } from '../lib/validation.js';

export function createProvincesRouter({ travelService }) {
  const router = Router();

  router.post(
    '/seed',
    asyncHandler(async (req, res) => {
      const items = await travelService.seedProvinces({ overwrite: Boolean(req.body?.overwrite) });
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
      const limit = parseLimit(req.query.limit, 20);
      const items = await travelService.listProvincePosts(req.params.provinceId, { limit });
      res.json({ items, count: items.length });
    })
  );

  router.get(
    '/:provinceId',
    asyncHandler(async (req, res) => {
      res.json(await travelService.getProvince(req.params.provinceId));
    })
  );

  router.put(
    '/:provinceId',
    asyncHandler(async (req, res) => {
      res.json(await travelService.upsertProvince(req.params.provinceId, req.body));
    })
  );

  return router;
}
