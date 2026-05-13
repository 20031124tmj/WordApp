export interface User {
  id: string;
  email: string;
  nickname: string;
  avatar_url: string | null;
  daily_goal: number;
  timezone: string;
}

export interface WordBook {
  id: string;
  name: string;
  description: string | null;
  language_pair: string;
  is_official: boolean;
  word_count: number;
  cover_url: string | null;
  created_by: string | null;
  subscribed: boolean;
}

export interface Word {
  id: string;
  word: string;
  phonetic: string | null;
  definitions: WordDefinition[];
  audio_url: string | null;
  frequency_rank: number | null;
}

export interface WordDefinition {
  pos: string;
  meaning: string;
  examples: { en: string; zh: string }[];
}

export interface WordProgress {
  id: string;
  word_id: string;
  word_book_id: string;
  ease_factor: number;
  interval: number;
  repetitions: number;
  next_review: string | null;
  last_review: string | null;
  status: 'new' | 'learning' | 'review' | 'mastered';
}

export interface LearningSession {
  id: string;
  word_book_id: string;
  type: 'learn' | 'review' | 'listen' | 'spell';
  started_at: string;
  ended_at: string | null;
  words_total: number;
  words_correct: number;
  words_wrong: number;
}

export interface Dashboard {
  words_to_review: number;
  words_to_learn: number;
  streak_days: number;
  today_learned: number;
  today_reviewed: number;
  daily_goal: number;
  daily_goal_progress: number;
}

export interface StatsOverview {
  total_words_learned: number;
  total_words_mastered: number;
  total_learning_days: number;
  total_reviews: number;
  average_accuracy: number;
}

export interface CheckIn {
  id: string;
  check_in_date: string;
  words_learned: number;
  words_reviewed: number;
  streak_days: number;
}

export interface Achievement {
  id: string;
  code: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlocked_at: string | null;
}

export interface AuthResponse {
  user: User;
  access_token: string;
  refresh_token: string;
}
