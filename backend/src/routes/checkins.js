import { Router } from 'express';
import { asyncHandler } from '../lib/async-handler.js';
import { parseLimit } from '../lib/validation.js';

export function createCheckinsRouter({ travelService }) {
  const router = Router();

  router.get(
    '/',
    asyncHandler(async (req, res) => {
      const limit = parseLimit(req.query.limit, 20);
      const items = await travelService.listCheckins({
        userId: req.query.userId,
        provinceId: req.query.provinceId,
        limit,
      });
      res.json({ items, count: items.length });
    })
  );

  router.post(
    '/',
    asyncHandler(async (req, res) => {
      const result = await travelService.createCheckin(req.body);
      res.status(201).json(result);
    })
  );

  return router;
}
