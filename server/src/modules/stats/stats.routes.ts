import { Router } from 'express';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { authMiddleware, AuthRequest } from '../../middleware/auth';
import { Db } from '../../database/connection';

export function createStatsRoutes(db: Db) {
  const router = Router();
  const statsService = new StatsService(db);
  const statsController = new StatsController(statsService);

  router.use(authMiddleware);

  router.get('/overview', (req, res) => statsController.overview(req as AuthRequest, res));
  router.get('/daily', (req, res) => statsController.daily(req as AuthRequest, res));
  router.get('/word-book/:id', (req, res) => statsController.wordBookStats(req as AuthRequest, res));
  router.get('/trend', (req, res) => statsController.trend(req as AuthRequest, res));

  return router;
}
