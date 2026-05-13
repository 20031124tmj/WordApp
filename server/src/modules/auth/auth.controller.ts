import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { success, error } from '../../utils/response';

export class AuthController {
  constructor(private authService: AuthService) {}

  async register(req: Request, res: Response) {
    try {
      const result = await this.authService.register(req.body.email, req.body.password, req.body.nickname);
      return success(res, result, 201);
    } catch (err: any) {
      if (err.message === 'EMAIL_EXISTS') {
        return error(res, 'EMAIL_EXISTS', '该邮箱已注册', 409);
      }
      throw err;
    }
  }

  async login(req: Request, res: Response) {
    try {
      const result = await this.authService.login(req.body.email, req.body.password);
      return success(res, result);
    } catch (err: any) {
      if (err.message === 'INVALID_CREDENTIALS') {
        return error(res, 'INVALID_CREDENTIALS', '邮箱或密码错误', 401);
      }
      throw err;
    }
  }

  async refresh(req: Request, res: Response) {
    try {
      const result = await this.authService.refresh(req.body.refresh_token);
      return success(res, result);
    } catch (err: any) {
      if (err.message === 'INVALID_TOKEN') {
        return error(res, 'INVALID_TOKEN', '无效的刷新令牌', 401);
      }
      throw err;
    }
  }
}
