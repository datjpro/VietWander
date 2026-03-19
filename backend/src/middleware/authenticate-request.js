import { resolveRequestAuth } from '../services/auth-service.js';

export function createAuthenticateRequestMiddleware() {
  return async (req, _res, next) => {
    try {
      req.auth = await resolveRequestAuth(req);
      next();
    } catch (error) {
      next(error);
    }
  };
}
