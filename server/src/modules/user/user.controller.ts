import { Response } from 'express';
import { UserService } from './user.service';
import { AuthRequest } from '../../middleware/auth';
import { success, error } from '../../utils/response';

export class UserController {
  constructor(private userService: UserService) {}

  async getProfile(req: AuthRequest, res: Response) {
    const data = await this.userService.getProfile(req.userId!);
    if (!data) return error(res, 'NOT_FOUND', '用户不存在', 404);
    return success(res, data);
  }

  async updateProfile(req: AuthRequest, res: Response) {
    const data = await this.userService.updateProfile(req.userId!, req.body);
    return success(res, data);
  }

  async updateSettings(req: AuthRequest, res: Response) {
    const data = await this.userService.updateSettings(req.userId!, req.body);
    return success(res, data);
  }

  async updatePassword(req: AuthRequest, res: Response) {
    try {
      const { current_password, new_password } = req.body;
      if (!current_password || !new_password) return error(res, 'MISSING_PARAM', '缺少密码参数', 400);
      const data = await this.userService.updatePassword(req.userId!, current_password, new_password);
      return success(res, data);
    } catch (err: any) {
      if (err.message === 'INVALID_PASSWORD') return error(res, 'INVALID_PASSWORD', '当前密码错误', 401);
      throw err;
    }
  }

  async getSubscribedWordBooks(req: AuthRequest, res: Response) {
    const data = await this.userService.getSubscribedWordBooks(req.userId!);
    return success(res, data);
  }
}
