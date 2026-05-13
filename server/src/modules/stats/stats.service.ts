import { Db } from '../../database/connection';

export class StatsService {
  constructor(private db: Db) {}

  async getOverview(userId: string) {
    const totalLearned = await this.db('user_word_progress')
      .where({ user_id: userId })
      .whereNot('status', 'new')
      .count('* as count')
      .first();

    const totalMastered = await this.db('user_word_progress')
      .where({ user_id: userId, status: 'mastered' })
      .count('* as count')
      .first();

    const totalDays = await this.db('check_ins')
      .where({ user_id: userId })
      .countDistinct('check_in_date as count')
      .first();

    const totalReviews = await this.db('user_answers')
      .where({ user_id: userId, is_correct: true })
      .count('* as count')
      .first();

    const totalAnswers = await this.db('user_answers')
      .where({ user_id: userId })
      .count('* as count')
      .first();

    return {
      total_words_learned: Number(totalLearned?.count || 0),
      total_words_mastered: Number(totalMastered?.count || 0),
      total_learning_days: Number(totalDays?.count || 0),
      total_reviews: Number(totalReviews?.count || 0),
      average_accuracy: totalAnswers?.count ? Math.round((Number(totalReviews?.count || 0) / Number(totalAnswers.count)) * 100) : 0,
    };
  }

  async getDaily(userId: string, startDate: string, endDate: string) {
    return this.db('check_ins')
      .where({ user_id: userId })
      .whereBetween('check_in_date', [startDate, endDate])
      .orderBy('check_in_date', 'asc');
  }

  async getWordBookStats(userId: string, wordBookId: string) {
    const byStatus = await this.db('user_word_progress')
      .where({ user_id: userId, word_book_id: wordBookId })
      .select('status')
      .count('* as count')
      .groupBy('status');

    const statusMap: Record<string, number> = { new: 0, learning: 0, review: 0, mastered: 0 };
    byStatus.forEach((row: any) => {
      statusMap[row.status] = Number(row.count);
    });

    const sessions = await this.db('learning_sessions')
      .where({ user_id: userId, word_book_id: wordBookId })
      .count('* as count')
      .first();

    return {
      ...statusMap,
      total_sessions: Number(sessions?.count || 0),
    };
  }

  async getTrend(userId: string, period: string) {
    const days = period === '90d' ? 90 : period === '30d' ? 30 : 7;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startDateStr = startDate.toISOString().split('T')[0];

    return this.db('check_ins')
      .where({ user_id: userId })
      .where('check_in_date', '>=', startDateStr)
      .orderBy('check_in_date', 'asc');
  }
}
