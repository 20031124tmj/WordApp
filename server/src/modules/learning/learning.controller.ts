import { Request, Response } from 'express';
import { LearningService } from './learning.service';
import { AuthRequest } from '../../middleware/auth';
import { success, error } from '../../utils/response';

export class LearningController {
  constructor(private learningService: LearningService) {}

  async dashboard(req: AuthRequest, res: Response) {
    const data = await this.learningService.getDashboard(req.userId!);
    return success(res, data);
  }

  async nextReview(req: AuthRequest, res: Response) {
    const data = await this.learningService.getNextReview(req.userId!);
    return success(res, data);
  }

  async nextNew(req: AuthRequest, res: Response) {
    const wordBookId = req.query.word_book_id as string;
    const count = Number(req.query.count) || 20;
    if (!wordBookId) return error(res, 'MISSING_PARAM', '缺少 word_book_id 参数', 400);
    const data = await this.learningService.getNextNew(req.userId!, wordBookId, count);
    return success(res, data);
  }

  async startSession(req: AuthRequest, res: Response) {
    const { word_book_id, type } = req.body;
    if (!word_book_id || !type) return error(res, 'MISSING_PARAM', '缺少必要参数', 400);
    const data = await this.learningService.startSession(req.userId!, word_book_id, type);
    return success(res, data);
  }

  async submitAnswer(req: AuthRequest, res: Response) {
    const sessionId = req.params.id as string;
    const { word_id, answer_type, response_time_ms } = req.body;
    if (!word_id || !answer_type) return error(res, 'MISSING_PARAM', '缺少必要参数', 400);
    try {
      const data = await this.learningService.submitAnswer(req.userId!, sessionId, word_id, answer_type, response_time_ms || null);
      return success(res, data);
    } catch (err: any) {
      if (err.message === 'SESSION_NOT_FOUND') return error(res, 'NOT_FOUND', '会话不存在', 404);
      throw err;
    }
  }

  async endSession(req: AuthRequest, res: Response) {
    const sessionId = req.params.id as string;
    const data = await this.learningService.endSession(req.userId!, sessionId);
    return success(res, data);
  }

  async getProgress(req: AuthRequest, res: Response) {
    const wordBookId = req.params.word_book_id as string;
    const data = await this.learningService.getProgress(req.userId!, wordBookId);
    return success(res, data);
  }
}
