import { Router } from 'express';
import { SocialController } from './social.controller';
import { SocialService } from './social.service';
import { authMiddleware, AuthRequest } from '../../middleware/auth';
import { Db } from '../../database/connection';

export function createSocialRoutes(db: Db) {
  const router = Router();
  const socialService = new SocialService(db);
  const socialController = new SocialController(socialService);

  router.post('/share', authMiddleware, (req, res) => socialController.share(req as AuthRequest, res));
  router.get('/share/:id', (req, res) => socialController.getShare(req as AuthRequest, res));
  router.post('/recommend/:word_book_id', authMiddleware, (req, res) => socialController.recommend(req as AuthRequest, res));

  return router;
}
