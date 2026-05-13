import { Router } from 'express';
import { AchievementController } from './achievement.controller';
import { AchievementService } from './achievement.service';
import { authMiddleware, AuthRequest } from '../../middleware/auth';
import { Db } from '../../database/connection';

export function createAchievementRoutes(db: Db) {
  const router = Router();
  const achievementService = new AchievementService(db);
  const achievementController = new AchievementController(achievementService);

  router.use(authMiddleware);

  router.get('/achievements', (req, res) => achievementController.list(req as AuthRequest, res));
  router.get('/achievements/mine', (req, res) => achievementController.mine(req as AuthRequest, res));
  router.get('/check-ins', (req, res) => achievementController.getCheckIns(req as AuthRequest, res));
  router.post('/check-ins', (req, res) => achievementController.checkIn(req as AuthRequest, res));

  return router;
}
