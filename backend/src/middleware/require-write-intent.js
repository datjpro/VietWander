import { forbidden } from '../lib/http-error.js';

const demoWriteIntentHeader = 'x-vietwander-intent';
const expectedDemoWriteIntentValue = 'web';

export function requireWriteIntent(req, _res, next) {
  if (req.auth?.authType !== 'demo') {
    return next();
  }

  if (req.headers[demoWriteIntentHeader] !== expectedDemoWriteIntentValue) {
    return next(forbidden('Yêu c?u demo guest thi?u header b?o v? h?p l?.'));
  }

  return next();
}
