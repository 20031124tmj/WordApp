import { Db } from '../../database/connection';
import { v4 as uuidv4 } from 'uuid';

export class SocialService {
  constructor(private db: Db) {}

  async createShare(userId: string, type: string, content: any) {
    const shareId = uuidv4();
    await this.db('social_shares')
      .insert({
        id: shareId,
        user_id: userId,
        type,
        content: JSON.stringify(content),
      });

    return this.db('social_shares').where({ id: shareId }).first();
  }

  async getShare(shareId: string) {
    const share = await this.db('social_shares').where({ id: shareId }).first();
    if (!share) return null;

    const user = await this.db('users').where({ id: share.user_id }).first();
    return {
      ...share,
      user: user ? { nickname: user.nickname, avatar_url: user.avatar_url } : null,
    };
  }

  async recommendWordBook(userId: string, wordBookId: string) {
    const wordBook = await this.db('word_books').where({ id: wordBookId }).first();
    if (!wordBook) throw new Error('NOT_FOUND');
    return { recommended: true };
  }
}
