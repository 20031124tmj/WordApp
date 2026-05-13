import { Router } from 'express';
import { z } from 'zod';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { validate } from '../../middleware/validate';
import { authLimiter } from '../../middleware/rateLimiter';
import { authMiddleware, AuthRequest } from '../../middleware/auth';
import { Db } from '../../database/connection';
import { success } from '../../utils/response';

const registerSchema = z.object({
  email: z.string().email('邮箱格式不正确'),
  password: z.string().min(8, '密码至少8位'),
  nickname: z.string().min(1, '昵称不能为空').max(100),
});

const loginSchema = z.object({
  email: z.string().email('邮箱格式不正确'),
  password: z.string().min(1, '密码不能为空'),
});

const refreshSchema = z.object({
  refresh_token: z.string().min(1, '刷新令牌不能为空'),
});

export function createAuthRoutes(db: Db) {
  const router = Router();
  const authService = new AuthService(db);
  const authController = new AuthController(authService);

  router.post('/register', authLimiter, validate(registerSchema), (req, res) => authController.register(req, res));
  router.post('/login', authLimiter, validate(loginSchema), (req, res) => authController.login(req, res));
  router.post('/refresh', validate(refreshSchema), (req, res) => authController.refresh(req, res));
  router.post('/logout', authMiddleware, (_req: AuthRequest, res) => {
    return success(res, { message: '已登出' });
  });

  return router;
}
