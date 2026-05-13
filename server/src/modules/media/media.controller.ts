import { Response } from 'express';
import { MediaService } from './media.service';
import { AuthRequest } from '../../middleware/auth';
import { success, error } from '../../utils/response';

export class MediaController {
  constructor(private mediaService: MediaService) {}

  async pronounce(req: AuthRequest, res: Response) {
    try {
      const data = await this.mediaService.getPronunciation(req.params.word_id as string);
      return success(res, data);
    } catch (err: any) {
      if (err.message === 'NOT_FOUND') return error(res, 'NOT_FOUND', '单词不存在', 404);
      throw err;
    }
  }

  async listeningQuiz(req: AuthRequest, res: Response) {
    const { word_book_id, count } = req.body;
    if (!word_book_id) return error(res, 'MISSING_PARAM', '缺少 word_book_id', 400);
    const data = await this.mediaService.generateListeningQuiz(req.userId!, word_book_id, count || 10);
    return success(res, data);
  }

  async spellingQuiz(req: AuthRequest, res: Response) {
    const { word_book_id, count } = req.body;
    if (!word_book_id) return error(res, 'MISSING_PARAM', '缺少 word_book_id', 400);
    const data = await this.mediaService.generateSpellingQuiz(req.userId!, word_book_id, count || 10);
    return success(res, data);
  }
}
