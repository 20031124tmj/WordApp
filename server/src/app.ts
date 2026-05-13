import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from './middleware/errorHandler';
import { createDb } from './database/connection';
import { createAuthRoutes } from './modules/auth/auth.routes';
import { createLearningRoutes } from './modules/learning/learning.routes';
import { createVocabularyRoutes } from './modules/vocabulary/vocabulary.routes';
import { createStatsRoutes } from './modules/stats/stats.routes';
import { createAchievementRoutes } from './modules/achievement/achievement.routes';
import { createSocialRoutes } from './modules/social/social.routes';
import { createMediaRoutes } from './modules/media/media.routes';
import { createUserRoutes } from './modules/user/user.routes';
import { generalLimiter } from './middleware/rateLimiter';

export function createApp() {
  const app = express();
  app.set('trust proxy', 1);
  const db = createDb();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(generalLimiter);

  app.get('/api/v1/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.use('/api/v1/auth', createAuthRoutes(db));
  app.use('/api/v1/learning', createLearningRoutes(db));
  app.use('/api/v1/word-books', createVocabularyRoutes(db));
  app.use('/api/v1/stats', createStatsRoutes(db));
  app.use('/api/v1', createAchievementRoutes(db));
  app.use('/api/v1/social', createSocialRoutes(db));
  app.use('/api/v1/media', createMediaRoutes(db));
  app.use('/api/v1/user', createUserRoutes(db));

  app.use(errorHandler);

  return app;
}
