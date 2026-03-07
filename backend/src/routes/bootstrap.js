import { Router } from 'express';
import { asyncHandler } from '../lib/async-handler.js';

export function createBootstrapRouter({ travelService }) {
  const router = Router();

  router.post(
    '/demo-data',
    asyncHandler(async (_req, res) => {
      const result = await travelService.bootstrapDemoData();
      res.status(201).json(result);
    })
  );

  return router;
}
