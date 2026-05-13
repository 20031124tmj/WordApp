import { Db } from '../../database/connection';

export class UserService {
  constructor(private db: Db) {}

  async getProfile(userId: string) {
    const user = await this.db('users').where({ id: userId }).first();
    if (!user) return null;
    return {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      avatar_url: user.avatar_url,
      daily_goal: user.daily_goal,
      timezone: user.timezone,
    };
  }

  async updateProfile(userId: string, updates: { nickname?: string; avatar_url?: string }) {
    await this.db('users').where({ id: userId }).update({
      ...updates,
      updated_at: new Date(),
    });
    return this.getProfile(userId);
  }

  async updateSettings(userId: string, settings: { daily_goal?: number; timezone?: string }) {
    await this.db('users').where({ id: userId }).update({
      ...settings,
      updated_at: new Date(),
    });
    return this.getProfile(userId);
  }

  async updatePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.db('users').where({ id: userId }).first();
    if (!user) throw new Error('USER_NOT_FOUND');

    const bcrypt = require('bcryptjs');
    const valid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!valid) throw new Error('INVALID_PASSWORD');

    const hash = await bcrypt.hash(newPassword, 12);
    await this.db('users').where({ id: userId }).update({
      password_hash: hash,
      updated_at: new Date(),
    });
    return { success: true };
  }

  async getSubscribedWordBooks(userId: string) {
    const progress = await this.db('user_word_progress')
      .where({ user_id: userId })
      .select('word_book_id')
      .groupBy('word_book_id');

    const wordBookIds = progress.map((p: any) => p.word_book_id);
    if (wordBookIds.length === 0) return [];

    return this.db('word_books').whereIn('id', wordBookIds);
  }
}
