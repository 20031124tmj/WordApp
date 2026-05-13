import { Response } from 'express';
import { StatsService } from './stats.service';
import { AuthRequest } from '../../middleware/auth';
import { success, error } from '../../utils/response';

export class StatsController {
  constructor(private statsService: StatsService) {}

  async overview(req: AuthRequest, res: Response) {
    const data = await this.statsService.getOverview(req.userId!);
    return success(res, data);
  }

  async daily(req: AuthRequest, res: Response) {
    const start_date = req.query.start_date as string;
    const end_date = req.query.end_date as string;
    if (!start_date || !end_date) return error(res, 'MISSING_PARAM', '缺少日期参数', 400);
    const data = await this.statsService.getDaily(req.userId!, start_date, end_date);
    return success(res, data);
  }

  async wordBookStats(req: AuthRequest, res: Response) {
    const data = await this.statsService.getWordBookStats(req.userId!, req.params.id as string);
    return success(res, data);
  }

  async trend(req: AuthRequest, res: Response) {
    const period = (req.query.period as string) || '7d';
    const data = await this.statsService.getTrend(req.userId!, period);
    return success(res, data);
  }
}
