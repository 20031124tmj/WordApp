import { Db } from '../../database/connection';

export class MediaService {
  constructor(private db: Db) {}

  async getPronunciation(wordId: string) {
    const word = await this.db('words').where({ id: wordId }).first();
    if (!word) throw new Error('NOT_FOUND');
    return {
      word: word.word,
      phonetic: word.phonetic,
      audio_url: word.audio_url || `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(word.word)}&type=2`,
    };
  }

  async generateListeningQuiz(userId: string, wordBookId: string, count: number = 10) {
    const progress = await this.db('user_word_progress')
      .where({ user_id: userId, word_book_id: wordBookId })
      .whereNot('status', 'new')
      .limit(count);

    const wordIds = progress.map((p) => p.word_id);
    const words = await this.db('words').whereIn('id', wordIds);

    return words.map((word) => ({
      word_id: word.id,
      audio_url: word.audio_url || `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(word.word)}&type=2`,
      correct_meaning: (typeof word.definitions === 'string' ? JSON.parse(word.definitions) : word.definitions)[0]?.meaning || '',
    }));
  }

  async generateSpellingQuiz(userId: string, wordBookId: string, count: number = 10) {
    const progress = await this.db('user_word_progress')
      .where({ user_id: userId, word_book_id: wordBookId })
      .whereNot('status', 'new')
      .limit(count);

    const wordIds = progress.map((p) => p.word_id);
    const words = await this.db('words').whereIn('id', wordIds);

    return words.map((word) => ({
      word_id: word.id,
      meaning: (typeof word.definitions === 'string' ? JSON.parse(word.definitions) : word.definitions)[0]?.meaning || '',
      hint: word.word[0] + '_'.repeat(word.word.length - 1),
      answer: word.word,
      phonetic: word.phonetic,
    }));
  }
}
