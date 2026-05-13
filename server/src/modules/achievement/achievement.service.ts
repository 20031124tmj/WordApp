import { v4 as uuidv4 } from 'uuid';
import { Db } from '../../database/connection';

export class AchievementService {
  constructor(private db: Db) {}

  async listAchievements() {
    return this.db('achievements').orderBy('created_at', 'asc');
  }

  async getUserAchievements(userId: string) {
    const all = await this.db('achievements').orderBy('created_at', 'asc');
    const unlocked = await this.db('user_achievements')
      .where({ user_id: userId })
      .select('achievement_id', 'unlocked_at');

    const unlockedMap = new Map(unlocked.map((u) => [u.achievement_id, u.unlocked_at]));

    return all.map((a) => ({
      ...a,
      unlocked: unlockedMap.has(a.id),
      unlocked_at: unlockedMap.get(a.id) || null,
    }));
  }

  async checkAndUnlock(userId: string) {
    const overview = await this.getOverviewStats(userId);
    const allAchievements = await this.db('achievements');
    const unlocked = await this.db('user_achievements')
      .where({ user_id: userId })
      .select('achievement_id');

    const unlockedIds = new Set(unlocked.map((u) => u.achievement_id));
    const newlyUnlocked = [];

    for (const achievement of allAchievements) {
      if (unlockedIds.has(achievement.id)) continue;
      const condition = typeof achievement.condition === 'string' ? JSON.parse(achievement.condition) : achievement.condition;
      if (this.meetsCondition(condition, overview)) {
        await this.db('user_achievements').insert({
          user_id: userId,
          achievement_id: achievement.id,
        });
        newlyUnlocked.push(achievement);
      }
    }

    return newlyUnlocked;
  }

  async checkIn(userId: string) {
    const today = new Date().toISOString().split('T')[0];
    const existing = await this.db('check_ins')
      .where({ user_id: userId, check_in_date: today })
      .first();

    if (existing) return existing;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    const yesterdayCheckIn = await this.db('check_ins')
      .where({ user_id: userId, check_in_date: yesterdayStr })
      .first();

    const streakDays = yesterdayCheckIn ? yesterdayCheckIn.streak_days + 1 : 1;

    const checkInId = uuidv4();
    await this.db('check_ins')
      .insert({
        id: checkInId,
        user_id: userId,
        check_in_date: today,
        streak_days: streakDays,
      });

    const checkIn = await this.db('check_ins').where({ id: checkInId }).first();

    await this.checkAndUnlock(userId);

    return checkIn;
  }

  async getCheckIns(userId: string, month: string) {
    const startDate = `${month}-01`;
    const [year, mon] = month.split('-').map(Number);
    const endDate = new Date(year, mon, 0).toISOString().split('T')[0];

    return this.db('check_ins')
      .where({ user_id: userId })
      .whereBetween('check_in_date', [startDate, endDate])
      .orderBy('check_in_date', 'asc');
  }

  private async getOverviewStats(userId: string) {
    const totalWords = await this.db('user_word_progress')
      .where({ user_id: userId })
      .whereNot('status', 'new')
      .count('* as count')
      .first();

    const streakDays = await this.db('check_ins')
      .where({ user_id: userId })
      .max('streak_days as max_streak')
      .first();

    const perfectSessions = await this.db('learning_sessions')
      .where({ user_id: userId })
      .whereRaw('words_total > 0 AND words_correct = words_total')
      .count('* as count')
      .first();

    return {
      total_words: Number(totalWords?.count || 0),
      streak_days: Number(streakDays?.max_streak || 0),
      perfect_sessions: Number(perfectSessions?.count || 0),
    };
  }

  private meetsCondition(condition: any, stats: any): boolean {
    switch (condition.type) {
      case 'total_words': return stats.total_words >= condition.threshold;
      case 'streak_days': return stats.streak_days >= condition.threshold;
      case 'perfect_session': return stats.perfect_sessions >= condition.threshold;
      default: return false;
    }
  }
}
