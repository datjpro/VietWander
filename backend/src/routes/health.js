import { Router } from 'express';

export function createHealthRouter({ travelService }) {
  const router = Router();

  router.get('/', async (_req, res) => {
    res.json(await travelService.getHealth());
  });

  return router;
}
