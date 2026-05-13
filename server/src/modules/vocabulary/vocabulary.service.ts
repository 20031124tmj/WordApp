import { v4 as uuidv4 } from 'uuid';
import { Db } from '../../database/connection';

export class VocabularyService {
  constructor(private db: Db) {}

  async listWordBooks(filters: { search?: string; language_pair?: string; is_official?: boolean }, page: number = 1, pageSize: number = 20) {
    let query = this.db('word_books');

    if (filters.search) {
      query = query.where('name', 'like', `%${filters.search}%`);
    }
    if (filters.language_pair) {
      query = query.where({ language_pair: filters.language_pair });
    }
    if (filters.is_official !== undefined) {
      query = query.where({ is_official: filters.is_official });
    }

    const total = await query.clone().count('* as count').first();
    const data = await query
      .orderBy('is_official', 'desc')
      .orderBy('created_at', 'desc')
      .offset((page - 1) * pageSize)
      .limit(pageSize);

    return { data, total: Number(total?.count || 0), page, page_size: pageSize };
  }

  async getWordBook(wordBookId: string) {
    const wordBook = await this.db('word_books').where({ id: wordBookId }).first();
    if (!wordBook) return null;
    return wordBook;
  }

  async getWordBookWords(wordBookId: string, page: number = 1, pageSize: number = 20) {
    const total = await this.db('word_book_items')
      .where({ word_book_id: wordBookId })
      .count('* as count')
      .first();

    const items = await this.db('word_book_items')
      .where({ word_book_id: wordBookId })
      .orderBy('position', 'asc')
      .offset((page - 1) * pageSize)
      .limit(pageSize);

    const wordIds = items.map((i) => i.word_id);
    const rawWords = await this.db('words').whereIn('id', wordIds);
    const words = rawWords.map((w: any) => {
      if (w.definitions && typeof w.definitions === 'string') {
        try { w.definitions = JSON.parse(w.definitions); } catch { w.definitions = []; }
      }
      return w;
    });

    return { data: words, total: Number(total?.count || 0), page, page_size: pageSize };
  }

  async createWordBook(userId: string, name: string, description: string, languagePair: string) {
    const id = uuidv4();
    await this.db('word_books').insert({
      id,
      name,
      description,
      language_pair: languagePair,
      is_official: false,
      created_by: userId,
    });
    return this.db('word_books').where({ id }).first();
  }

  async updateWordBook(wordBookId: string, userId: string, updates: { name?: string; description?: string }) {
    const wordBook = await this.db('word_books').where({ id: wordBookId }).first();
    if (!wordBook) throw new Error('NOT_FOUND');
    if (wordBook.created_by !== userId) throw new Error('FORBIDDEN');

    await this.db('word_books').where({ id: wordBookId }).update({
      ...updates,
      updated_at: new Date(),
    });

    return this.db('word_books').where({ id: wordBookId }).first();
  }

  async deleteWordBook(wordBookId: string, userId: string) {
    const wordBook = await this.db('word_books').where({ id: wordBookId }).first();
    if (!wordBook) throw new Error('NOT_FOUND');
    if (wordBook.created_by !== userId) throw new Error('FORBIDDEN');
    if (wordBook.is_official) throw new Error('CANNOT_DELETE_OFFICIAL');

    await this.db('word_book_items').where({ word_book_id: wordBookId }).del();
    await this.db('word_books').where({ id: wordBookId }).del();
  }

  async importWords(wordBookId: string, words: Array<{ word: string; phonetic?: string; definitions: any }>) {
    const wordRecords = [];
    for (const w of words) {
      let existing = await this.db('words').where({ word: w.word }).first();
      if (!existing) {
        const wordId = uuidv4();
        await this.db('words').insert({
          id: wordId,
          word: w.word,
          phonetic: w.phonetic || null,
          definitions: JSON.stringify(w.definitions),
          language: 'en',
        });
        existing = await this.db('words').where({ id: wordId }).first();
      }
      wordRecords.push(existing);
    }

    const maxPos = await this.db('word_book_items')
      .where({ word_book_id: wordBookId })
      .max('position as max_pos')
      .first();

    let position = Number(maxPos?.max_pos || 0) + 1;
    for (const wr of wordRecords) {
      const exists = await this.db('word_book_items')
        .where({ word_book_id: wordBookId, word_id: wr.id })
        .first();
      if (!exists) {
        await this.db('word_book_items').insert({
          id: uuidv4(),
          word_book_id: wordBookId,
          word_id: wr.id,
          position,
        });
        position++;
      }
    }

    const countResult = await this.db('word_book_items')
      .where({ word_book_id: wordBookId })
      .count('* as cnt')
      .first();

    await this.db('word_books').where({ id: wordBookId }).update({
      word_count: Number(countResult?.cnt || 0),
      updated_at: new Date(),
    });

    return { imported: wordRecords.length };
  }

  async subscribe(userId: string, wordBookId: string) {
    const wordBook = await this.db('word_books').where({ id: wordBookId }).first();
    if (!wordBook) throw new Error('NOT_FOUND');

    const items = await this.db('word_book_items')
      .where({ word_book_id: wordBookId })
      .select('word_id');

    for (const item of items) {
      const existing = await this.db('user_word_progress')
        .where({ user_id: userId, word_id: item.word_id, word_book_id: wordBookId })
        .first();
      if (!existing) {
        await this.db('user_word_progress').insert({
          id: uuidv4(),
          user_id: userId,
          word_id: item.word_id,
          word_book_id: wordBookId,
          ease_factor: 2.5,
          interval: 0,
          repetitions: 0,
          status: 'new',
        });
      }
    }
  }

  async searchWords(query: string, page: number = 1, pageSize: number = 20) {
    let qb = this.db('words');
    if (query) {
      qb = qb.where('word', 'like', `${query}%`);
    }
    const total = await qb.clone().count('* as count').first();
    const rows = await qb
      .orderBy('word', 'asc')
      .offset((page - 1) * pageSize)
      .limit(pageSize);
    const words = rows.map((w: any) => {
      if (w.definitions && typeof w.definitions === 'string') {
        try { w.definitions = JSON.parse(w.definitions); } catch { w.definitions = []; }
      }
      return w;
    });
    return { data: words, total: Number(total?.count || 0), page, page_size: pageSize };
  }

  async getWordDetail(wordId: string) {
    const w = await this.db('words').where({ id: wordId }).first();
    if (!w) return null;
    if (w.definitions && typeof w.definitions === 'string') {
      try { w.definitions = JSON.parse(w.definitions); } catch { w.definitions = []; }
    }
    return w;
  }

  async unsubscribe(userId: string, wordBookId: string) {
    await this.db('user_word_progress')
      .where({ user_id: userId, word_book_id: wordBookId })
      .del();
  }
}
