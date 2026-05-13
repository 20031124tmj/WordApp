import { Request, Response } from 'express';
import { VocabularyService } from './vocabulary.service';
import { AuthRequest } from '../../middleware/auth';
import { success, error } from '../../utils/response';

export class VocabularyController {
  constructor(private vocabularyService: VocabularyService) {}

  async list(req: Request, res: Response) {
    const { search, language_pair, is_official, page, page_size } = req.query;
    const result = await this.vocabularyService.listWordBooks(
      {
        search: search as string | undefined,
        language_pair: language_pair as string | undefined,
        is_official: is_official === 'true' ? true : is_official === 'false' ? false : undefined,
      },
      Number(page) || 1,
      Number(page_size) || 20
    );
    return success(res, result.data);
  }

  async get(req: Request, res: Response) {
    const data = await this.vocabularyService.getWordBook(req.params.id as string);
    if (!data) return error(res, 'NOT_FOUND', '词库不存在', 404);
    return success(res, data);
  }

  async getWords(req: Request, res: Response) {
    const { page, page_size } = req.query;
    const result = await this.vocabularyService.getWordBookWords(
      req.params.id as string,
      Number(page) || 1,
      Number(page_size) || 20
    );
    return success(res, result.data);
  }

  async create(req: AuthRequest, res: Response) {
    const { name, description, language_pair } = req.body;
    const data = await this.vocabularyService.createWordBook(
      req.userId!,
      name,
      description || '',
      language_pair || 'en-zh'
    );
    return success(res, data, 201);
  }

  async update(req: AuthRequest, res: Response) {
    try {
      const data = await this.vocabularyService.updateWordBook(req.params.id as string, req.userId!, req.body);
      return success(res, data);
    } catch (err: any) {
      if (err.message === 'NOT_FOUND') return error(res, 'NOT_FOUND', '词库不存在', 404);
      if (err.message === 'FORBIDDEN') return error(res, 'FORBIDDEN', '无权限修改此词库', 403);
      throw err;
    }
  }

  async remove(req: AuthRequest, res: Response) {
    try {
      await this.vocabularyService.deleteWordBook(req.params.id as string, req.userId!);
      return success(res, { message: '已删除' });
    } catch (err: any) {
      if (err.message === 'NOT_FOUND') return error(res, 'NOT_FOUND', '词库不存在', 404);
      if (err.message === 'FORBIDDEN') return error(res, 'FORBIDDEN', '无权限删除此词库', 403);
      if (err.message === 'CANNOT_DELETE_OFFICIAL') return error(res, 'FORBIDDEN', '不能删除官方词库', 403);
      throw err;
    }
  }

  async importWords(req: AuthRequest, res: Response) {
    const { words } = req.body;
    if (!Array.isArray(words)) return error(res, 'VALIDATION_ERROR', 'words 必须是数组', 400);
    const data = await this.vocabularyService.importWords(req.params.id as string, words);
    return success(res, data);
  }

  async subscribe(req: AuthRequest, res: Response) {
    try {
      await this.vocabularyService.subscribe(req.userId!, req.params.id as string);
      return success(res, { message: '已订阅' });
    } catch (err: any) {
      if (err.message === 'NOT_FOUND') return error(res, 'NOT_FOUND', '词库不存在', 404);
      throw err;
    }
  }

  async unsubscribe(req: AuthRequest, res: Response) {
    await this.vocabularyService.unsubscribe(req.userId!, req.params.id as string);
    return success(res, { message: '已取消订阅' });
  }
}
