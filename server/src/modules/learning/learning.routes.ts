import { Router } from 'express';
import { LearningController } from './learning.controller';
import { LearningService } from './learning.service';
import { authMiddleware, AuthRequest } from '../../middleware/auth';
import { Db } from '../../database/connection';

export function createLearningRoutes(db: Db) {
  const router = Router();
  const learningService = new LearningService(db);
  const learningController = new LearningController(learningService);

  router.use(authMiddleware);

  router.get('/dashboard', (req, res) => learningController.dashboard(req as AuthRequest, res));
  router.get('/next-review', (req, res) => learningController.nextReview(req as AuthRequest, res));
  router.get('/next-new', (req, res) => learningController.nextNew(req as AuthRequest, res));
  router.post('/session/start', (req, res) => learningController.startSession(req as AuthRequest, res));
  router.post('/session/:id/answer', (req, res) => learningController.submitAnswer(req as AuthRequest, res));
  router.post('/session/:id/end', (req, res) => learningController.endSession(req as AuthRequest, res));
  router.get('/progress/:word_book_id', (req, res) => learningController.getProgress(req as AuthRequest, res));

  return router;
}
