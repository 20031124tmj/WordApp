import { Router } from 'express';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { authMiddleware, AuthRequest } from '../../middleware/auth';
import { Db } from '../../database/connection';

export function createMediaRoutes(db: Db) {
  const router = Router();
  const mediaService = new MediaService(db);
  const mediaController = new MediaController(mediaService);

  router.use(authMiddleware);

  router.get('/pronounce/:word_id', (req, res) => mediaController.pronounce(req as AuthRequest, res));
  router.post('/listening-quiz', (req, res) => mediaController.listeningQuiz(req as AuthRequest, res));
  router.post('/spelling-quiz', (req, res) => mediaController.spellingQuiz(req as AuthRequest, res));

  return router;
}
