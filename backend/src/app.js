import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { asyncHandler } from './lib/async-handler.js';
import { HttpError } from './lib/http-error.js';
import { createAuthenticateRequestMiddleware } from './middleware/authenticate-request.js';
import { attachRequestContext, applySecurityHeaders } from './middleware/security.js';
import { getRepository } from './repositories/index.js';
import { createAuthRouter } from './routes/auth.js';
import { createBootstrapRouter } from './routes/bootstrap.js';
import { createCheckinsRouter } from './routes/checkins.js';
import { createFeedRouter } from './routes/feed.js';
import { createHealthRouter } from './routes/health.js';
import { createLeaderboardRouter } from './routes/leaderboard.js';
import { createPostsRouter } from './routes/posts.js';
import { createProvincesRouter } from './routes/provinces.js';
import { createUsersRouter } from './routes/users.js';
import { createTravelService } from './services/travel-service.js';

const allowedCorsMethods = ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'];
const allowedCorsHeaders = ['Accept', 'Content-Type', 'Authorization', 'X-VietWander-Intent'];
const exposedCorsHeaders = ['X-Request-Id'];

function isLoopbackHostname(hostname) {
  return ['localhost', '127.0.0.1', '::1', '[::1]'].includes(hostname);
}

function isAllowedCorsOrigin(origin) {
  try {
    const parsedOrigin = new URL(origin);

    if (!['http:', 'https:'].includes(parsedOrigin.protocol)) {
      return false;
    }

    if (isLoopbackHostname(parsedOrigin.hostname)) {
      return true;
    }

    return env.allowedOrigins.includes(origin);
  } catch {
    return false;
  }
}

function buildCorsOptions(req, callback) {
  const requestOrigin = req.header('Origin');

  if (!requestOrigin || !isAllowedCorsOrigin(requestOrigin)) {
    callback(null, { origin: false });
    return;
  }

  callback(null, {
    origin: requestOrigin,
    credentials: true,
    methods: allowedCorsMethods,
    allowedHeaders: allowedCorsHeaders,
    exposedHeaders: exposedCorsHeaders
  });
}

export function createApp({ repository = getRepository(), travelService = createTravelService(repository) } = {}) {
  const app = express();
  const apiRouter = express.Router();

  if (env.trustProxy) {
    app.set('trust proxy', 1);
  }

  app.disable('x-powered-by');
  app.use(attachRequestContext);
  app.use(applySecurityHeaders);
  app.use(cors(buildCorsOptions));
  app.options('*', cors(buildCorsOptions));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '100kb', parameterLimit: 50 }));
  app.use(createAuthenticateRequestMiddleware());

  app.locals.repository = repository;
  app.locals.travelService = travelService;

  app.get('/', (_req, res) => {
    res.json({
      name: 'VietWander backend',
      environment: env.nodeEnv,
      databaseMode: repository.mode,
      health: '/health',
      api: '/api'
    });
  });

  app.use('/health', createHealthRouter({ travelService }));

  apiRouter.get(
    '/',
    asyncHandler(async (_req, res) => {
      res.json(await travelService.getApiIndex());
    })
  );
  apiRouter.use('/auth', createAuthRouter());
  apiRouter.use('/bootstrap', createBootstrapRouter({ travelService }));
  apiRouter.use('/users', createUsersRouter({ travelService }));
  apiRouter.use('/provinces', createProvincesRouter({ travelService }));
  apiRouter.use('/checkins', createCheckinsRouter({ travelService }));
  apiRouter.use('/posts', createPostsRouter({ travelService }));
  apiRouter.use('/leaderboard', createLeaderboardRouter({ travelService }));
  apiRouter.use('/feed', createFeedRouter({ travelService }));

  app.use('/api', apiRouter);

  app.use((req, res) => {
    res.status(404).json({
      message: 'Endpoint không t?n t?i.',
      path: req.originalUrl,
      requestId: req.requestId
    });
  });

  app.use((error, req, res, _next) => {
    if (error?.type === 'entity.parse.failed') {
      return res.status(400).json({
        message: 'JSON body không h?p l?.',
        requestId: req.requestId
      });
    }

    if (error instanceof HttpError) {
      return res.status(error.statusCode).json({
        message: error.message,
        details: error.details ?? undefined,
        requestId: req.requestId
      });
    }

    console.error('[vietwander-backend] unexpected error', {
      requestId: req.requestId,
      error
    });

    return res.status(500).json({
      message: 'L?i n?i b? server.',
      details: env.nodeEnv === 'development' ? error?.message ?? String(error) : undefined,
      requestId: req.requestId
    });
  });

  return app;
}
