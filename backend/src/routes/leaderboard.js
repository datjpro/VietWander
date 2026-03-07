import { Router } from 'express';
import { asyncHandler } from '../lib/async-handler.js';
import { parseLimit } from '../lib/validation.js';

export function createLeaderboardRouter({ travelService }) {
  const router = Router();

  router.get(
    '/',
    asyncHandler(async (req, res) => {
      const limit = parseLimit(req.query.limit, 10, 50);
      const items = await travelService.getLeaderboard(limit);
      res.json({ items, count: items.length });
    })
  );

  return router;
}
