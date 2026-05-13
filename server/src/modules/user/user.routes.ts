import { Router } from 'express';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { authMiddleware, AuthRequest } from '../../middleware/auth';
import { Db } from '../../database/connection';

export function createUserRoutes(db: Db) {
  const router = Router();
  const userService = new UserService(db);
  const userController = new UserController(userService);

  router.use(authMiddleware);

  router.get('/profile', (req, res) => userController.getProfile(req as AuthRequest, res));
  router.put('/profile', (req, res) => userController.updateProfile(req as AuthRequest, res));
  router.put('/settings', (req, res) => userController.updateSettings(req as AuthRequest, res));
  router.put('/password', (req, res) => userController.updatePassword(req as AuthRequest, res));
  router.get('/word-books', (req, res) => userController.getSubscribedWordBooks(req as AuthRequest, res));

  return router;
}
