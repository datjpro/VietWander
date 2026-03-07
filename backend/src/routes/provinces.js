import { Router } from 'express';
import { provinces } from '../data/mock.js';

export const provincesRouter = Router();

provincesRouter.get('/', (_req, res) => {
  res.json({ items: provinces });
});

provincesRouter.get('/:provinceId', (req, res) => {
  const province = provinces.find((item) => item.id === req.params.provinceId);

  if (!province) {
    res.status(404).json({ message: 'Province not found' });
    return;
  }

  res.json(province);
});
