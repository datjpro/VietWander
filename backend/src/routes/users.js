import { Router } from 'express';
import { asyncHandler } from '../lib/async-handler.js';

export function createUsersRouter({ travelService }) {
  const router = Router();

  router.get(
    '/:userId',
    asyncHandler(async (req, res) => {
      res.json(await travelService.getUser(req.params.userId));
    })
  );

  router.put(
    '/:userId',
    asyncHandler(async (req, res) => {
      res.json(await travelService.upsertUser(req.params.userId, req.body));
    })
  );

  router.patch(
    '/:userId',
    asyncHandler(async (req, res) => {
      res.json(await travelService.upsertUser(req.params.userId, req.body));
    })
  );

  return router;
}
