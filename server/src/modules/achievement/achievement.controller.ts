import { Response } from 'express';
import { AchievementService } from './achievement.service';
import { AuthRequest } from '../../middleware/auth';
import { success } from '../../utils/response';

export class AchievementController {
  constructor(private achievementService: AchievementService) {}

  async list(req: AuthRequest, res: Response) {
    const data = await this.achievementService.listAchievements();
    return success(res, data);
  }

  async mine(req: AuthRequest, res: Response) {
    const data = await this.achievementService.getUserAchievements(req.userId!);
    return success(res, data);
  }

  async checkIn(req: AuthRequest, res: Response) {
    const data = await this.achievementService.checkIn(req.userId!);
    return success(res, data);
  }

  async getCheckIns(req: AuthRequest, res: Response) {
    const month = (req.query.month as string) || new Date().toISOString().slice(0, 7);
    const data = await this.achievementService.getCheckIns(req.userId!, month);
    return success(res, data);
  }
}
