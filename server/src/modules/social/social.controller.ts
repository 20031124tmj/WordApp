import { Response } from 'express';
import { SocialService } from './social.service';
import { AuthRequest } from '../../middleware/auth';
import { success, error } from '../../utils/response';

export class SocialController {
  constructor(private socialService: SocialService) {}

  async share(req: AuthRequest, res: Response) {
    const { type, content } = req.body;
    const data = await this.socialService.createShare(req.userId!, type, content);
    return success(res, data, 201);
  }

  async getShare(req: AuthRequest, res: Response) {
    const data = await this.socialService.getShare(req.params.id as string);
    if (!data) return error(res, 'NOT_FOUND', '分享不存在', 404);
    return success(res, data);
  }

  async recommend(req: AuthRequest, res: Response) {
    try {
      const data = await this.socialService.recommendWordBook(req.userId!, req.params.word_book_id as string);
      return success(res, data);
    } catch (err: any) {
      if (err.message === 'NOT_FOUND') return error(res, 'NOT_FOUND', '词库不存在', 404);
      throw err;
    }
  }
}
