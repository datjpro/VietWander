import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { asyncHandler } from './lib/async-handler.js';
import { HttpError } from './lib/http-error.js';
import { getRepository } from './repositories/index.js';
import { createBootstrapRouter } from './routes/bootstrap.js';
import { createCheckinsRouter } from './routes/checkins.js';
import { createFeedRouter } from './routes/feed.js';
import { createHealthRouter } from './routes/health.js';
import { createLeaderboardRouter } from './routes/leaderboard.js';
import { createPostsRouter } from './routes/posts.js';
import { createProvincesRouter } from './routes/provinces.js';
import { createUsersRouter } from './routes/users.js';
import { createTravelService } from './services/travel-service.js';

export function createApp({ repository = getRepository(), travelService = createTravelService(repository) } = {}) {
  const app = express();
  const apiRouter = express.Router();

  app.disable('x-powered-by');
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  app.locals.repository = repository;
  app.locals.travelService = travelService;

  app.get('/', (_req, res) => {
    res.json({
      name: 'VietWander backend',
      environment: env.nodeEnv,
      databaseMode: repository.mode,
      health: '/health',
      api: '/api',
    });
  });

  app.use('/health', createHealthRouter({ travelService }));

  apiRouter.get(
    '/',
    asyncHandler(async (_req, res) => {
      res.json(await travelService.getApiIndex());
    })
  );
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
      message: 'Endpoint không tồn tại.',
      path: req.originalUrl,
    });
  });

  app.use((error, _req, res, _next) => {
    if (error?.type === 'entity.parse.failed') {
      return res.status(400).json({
        message: 'JSON body không hợp lệ.',
      });
    }

    if (error instanceof HttpError) {
      return res.status(error.statusCode).json({
        message: error.message,
        details: error.details ?? undefined,
      });
    }

    console.error('[vietwander-backend] unexpected error', error);

    return res.status(500).json({
      message: 'Lỗi nội bộ server.',
      details: env.nodeEnv === 'development' ? error?.message ?? String(error) : undefined,
    });
  });

  return app;
}
