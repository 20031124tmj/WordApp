import { v4 as uuidv4 } from 'uuid';
import { Db } from '../../database/connection';
import { calculateSM2, mapAnswerTypeToQuality } from './sm2';

export class LearningService {
  constructor(private db: Db) {}

  private getLocalDateStr(date: Date = new Date()): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  async getDashboard(userId: string) {
    const today = this.getLocalDateStr();

    const overdueReview = await this.db('user_word_progress')
      .where({ user_id: userId })
      .whereIn('status', ['learning', 'review'])
      .where('next_review', '<=', new Date())
      .count('* as count')
      .first();

    const learningStudied = await this.db('user_word_progress')
      .where({ user_id: userId, status: 'learning' })
      .whereNotNull('last_review')
      .where('next_review', '>', new Date())
      .count('* as count')
      .first();

    const toLearn = await this.db('user_word_progress')
      .where({ user_id: userId, status: 'new' })
      .count('* as count')
      .first();

    const checkIn = await this.db('check_ins')
      .where({ user_id: userId, check_in_date: today })
      .first();

    const user = await this.db('users').where({ id: userId }).first();

    const wordsLearned = Number(checkIn?.words_learned || 0);
    const wordsReviewed = Number(checkIn?.words_reviewed || 0);
    const dailyGoal = Number(user?.daily_goal || 20);

    return {
      words_to_review: Number(overdueReview?.count || 0) + Number(learningStudied?.count || 0),
      words_to_learn: Number(toLearn?.count || 0),
      streak_days: checkIn?.streak_days || 0,
      today_learned: wordsLearned,
      today_reviewed: wordsReviewed,
      daily_goal: dailyGoal,
      daily_goal_progress: Math.min(100, Math.round((wordsLearned + wordsReviewed) / dailyGoal * 100)),
    };
  }

  private parseWordDefinitions(word: any): any {
    if (!word) return word;
    if (word.definitions && typeof word.definitions === 'string') {
      try {
        word.definitions = JSON.parse(word.definitions);
      } catch {
        word.definitions = [];
      }
    }
    return word;
  }

  async getNextReview(userId: string) {
    const progress = await this.db('user_word_progress')
      .where({ user_id: userId })
      .where('status', 'in', ['learning', 'review'])
      .where('next_review', '<=', new Date())
      .orderBy('next_review', 'asc')
      .limit(20);

    if (progress.length === 0) return [];

    const wordIds = progress.map((p) => p.word_id);
    const words = await this.db('words').whereIn('id', wordIds);

    const wordMap = new Map(words.map((w: any) => [w.id, this.parseWordDefinitions(w)]));
    return progress.map((p) => ({
      ...wordMap.get(p.word_id),
      progress: p,
    }));
  }

  async getNextNew(userId: string, wordBookId: string, count: number = 20) {
    const progressEntries = await this.db('user_word_progress')
      .where({ user_id: userId, word_book_id: wordBookId, status: 'new' })
      .limit(count);

    if (progressEntries.length === 0) return [];

    const wordIds = progressEntries.map((p) => p.word_id);
    const words = await this.db('words').whereIn('id', wordIds);

    const wordMap = new Map(words.map((w: any) => [w.id, this.parseWordDefinitions(w)]));
    return progressEntries.map((p) => ({
      ...wordMap.get(p.word_id),
      progress: p,
    })).filter((item: any) => item && item.word);
  }

  async startSession(userId: string, wordBookId: string, type: string) {
    let words: any[] = [];

    if (type === 'learn') {
      words = await this.getNextNew(userId, wordBookId, 20);
    } else if (type === 'review') {
      const overdueProgress = await this.db('user_word_progress')
        .where({ user_id: userId, word_book_id: wordBookId })
        .whereIn('status', ['learning', 'review'])
        .where('next_review', '<=', new Date())
        .orderBy('next_review', 'asc')
        .limit(20);

      let progress = overdueProgress;
      if (progress.length < 20) {
        const overdueIds = new Set(overdueProgress.map((p: any) => p.id));
        const recentLearning = await this.db('user_word_progress')
          .where({ user_id: userId, word_book_id: wordBookId, status: 'learning' })
          .whereNotIn('id', Array.from(overdueIds))
          .orderBy('last_review', 'desc')
          .limit(20 - progress.length);
        progress = [...progress, ...recentLearning];
      }

      const wordIds = progress.map((p) => p.word_id);
      const rawWords = await this.db('words').whereIn('id', wordIds);
      const wordMap = new Map(rawWords.map((w: any) => [w.id, this.parseWordDefinitions(w)]));
      words = progress.map((p) => ({
        ...wordMap.get(p.word_id),
        progress: p,
      })).filter((item: any) => item && item.word);
    }

    const sessionId = uuidv4();
    await this.db('learning_sessions').insert({
      id: sessionId,
      user_id: userId,
      word_book_id: wordBookId,
      type,
      words_total: words.length,
    });

    return { session_id: sessionId, words };
  }

  async submitAnswer(userId: string, sessionId: string, wordId: string, answerType: string, responseTimeMs: number | null) {
    const quality = mapAnswerTypeToQuality(answerType);

    const session = await this.db('learning_sessions').where({ id: sessionId }).first();
    if (!session) throw new Error('SESSION_NOT_FOUND');

    let progress = await this.db('user_word_progress')
      .where({ user_id: userId, word_id: wordId, word_book_id: session.word_book_id })
      .first();

    if (!progress) {
      const progressId = uuidv4();
      await this.db('user_word_progress').insert({
        id: progressId,
        user_id: userId,
        word_id: wordId,
        word_book_id: session.word_book_id,
        ease_factor: 2.5,
        interval: 0,
        repetitions: 0,
        status: 'new',
      });
      progress = await this.db('user_word_progress').where({ id: progressId }).first();
    }

    const result = calculateSM2(
      {
        ease_factor: Number(progress.ease_factor),
        interval: progress.interval,
        repetitions: progress.repetitions,
        status: progress.status,
      },
      quality
    );

    await this.db('user_word_progress').where({ id: progress.id }).update({
      ease_factor: result.ease_factor,
      interval: result.interval,
      repetitions: result.repetitions,
      next_review: result.next_review,
      last_review: new Date(),
      status: result.status,
    });

    const isCorrect = quality >= 3;
    await this.db('user_answers').insert({
      id: uuidv4(),
      session_id: sessionId,
      word_id: wordId,
      user_id: userId,
      answer_type: answerType,
      response_time_ms: responseTimeMs,
      is_correct: isCorrect,
    });

    if (isCorrect) {
      await this.db('learning_sessions').where({ id: sessionId }).update({
        words_correct: this.db.raw('words_correct + 1'),
      });
    } else {
      await this.db('learning_sessions').where({ id: sessionId }).update({
        words_wrong: this.db.raw('words_wrong + 1'),
      });
    }

    const today = this.getLocalDateStr();
    const existingCheckIn = await this.db('check_ins')
      .where({ user_id: userId, check_in_date: today })
      .first();

    if (!existingCheckIn) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = this.getLocalDateStr(yesterday);
      const yesterdayCheckIn = await this.db('check_ins')
        .where({ user_id: userId, check_in_date: yesterdayStr })
        .first();

      const streakDays = yesterdayCheckIn ? yesterdayCheckIn.streak_days + 1 : 1;

      await this.db('check_ins').insert({
        id: uuidv4(),
        user_id: userId,
        check_in_date: today,
        words_learned: session.type === 'learn' ? 1 : 0,
        words_reviewed: session.type === 'review' ? 1 : 0,
        streak_days: streakDays,
      });
    } else {
      const field = session.type === 'learn' ? 'words_learned' : 'words_reviewed';
      await this.db('check_ins')
        .where({ id: existingCheckIn.id })
        .update({ [field]: this.db.raw(`${field} + 1`) });
    }

    return {
      next_review: result.next_review,
      ease_factor: result.ease_factor,
      interval: result.interval,
      status: result.status,
    };
  }

  async endSession(userId: string, sessionId: string) {
    await this.db('learning_sessions').where({ id: sessionId, user_id: userId }).update({
      ended_at: new Date(),
    });

    const session = await this.db('learning_sessions').where({ id: sessionId }).first();
    return session;
  }

  async getProgress(userId: string, wordBookId: string) {
    const total = await this.db('word_book_items')
      .where({ word_book_id: wordBookId })
      .count('* as count')
      .first();

    const byStatus = await this.db('user_word_progress')
      .where({ user_id: userId, word_book_id: wordBookId })
      .select('status')
      .count('* as count')
      .groupBy('status');

    const statusMap: Record<string, number> = { new: 0, learning: 0, review: 0, mastered: 0 };
    byStatus.forEach((row: any) => {
      statusMap[row.status] = Number(row.count);
    });

    return {
      total_words: Number(total?.count || 0),
      learned_words: statusMap.learning + statusMap.review + statusMap.mastered,
      mastered_words: statusMap.mastered,
      new_words: Number(total?.count || 0) - statusMap.learning - statusMap.review - statusMap.mastered,
    };
  }
}
