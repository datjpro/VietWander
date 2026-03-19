import { Router } from 'express';
import { asyncHandler } from '../lib/async-handler.js';
import { readLimitQuery, validateProvinceIdParam, validateUserIdParam } from '../lib/request-validation.js';
import { assertSelfOrAdmin } from '../middleware/authorize.js';

export function createFeedRouter({ travelService }) {
  const router = Router();

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

  return router;
}
