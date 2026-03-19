import { Router } from 'express';
import { env } from '../config/env.js';
import { asyncHandler } from '../lib/async-handler.js';
import { createRateLimitMiddleware } from '../middleware/rate-limit.js';
import { clearAuthSession, issueDemoSession } from '../services/auth-service.js';

export function createAuthRouter() {
  const router = Router();
  const authRateLimit = createRateLimitMiddleware({
    keyPrefix: 'auth',
    max: env.authRateLimitMax,
    windowMs: env.authRateLimitWindowMs
  });

  router.get(
    '/session',
    asyncHandler(async (req, res) => {
      res.json({
        authenticated: Boolean(req.auth?.uid),
        auth: req.auth ?? null,
        demoAuthEnabled: env.demoAuthEnabled
      });
    })
  );

  router.post(
    '/demo-session',
    authRateLimit,
    asyncHandler(async (_req, res) => {
      const auth = issueDemoSession(res);
      res.status(201).json({
        authenticated: true,
        auth
      });
    })
  );

  router.post(
    '/logout',
    asyncHandler(async (_req, res) => {
      clearAuthSession(res);
      res.json({ ok: true });
    })
  );

  return router;
}
