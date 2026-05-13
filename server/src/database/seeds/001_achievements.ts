import type { Knex } from 'knex';
import { v4 as uuidv4 } from 'uuid';

export async function seed(knex: Knex): Promise<void> {
  await knex('achievements').del();
  await knex('achievements').insert([
    { id: uuidv4(), code: 'first_word', name: '初出茅庐', description: '学习第一个单词', icon: '🌱', condition: JSON.stringify({ type: 'total_words', threshold: 1 }) },
    { id: uuidv4(), code: 'words_10', name: '小试牛刀', description: '学习10个单词', icon: '📖', condition: JSON.stringify({ type: 'total_words', threshold: 10 }) },
    { id: uuidv4(), code: 'words_50', name: '渐入佳境', description: '学习50个单词', icon: '📚', condition: JSON.stringify({ type: 'total_words', threshold: 50 }) },
    { id: uuidv4(), code: 'words_100', name: '百词斩', description: '学习100个单词', icon: '💯', condition: JSON.stringify({ type: 'total_words', threshold: 100 }) },
    { id: uuidv4(), code: 'words_500', name: '词汇达人', description: '学习500个单词', icon: '🏆', condition: JSON.stringify({ type: 'total_words', threshold: 500 }) },
    { id: uuidv4(), code: 'words_1000', name: '词海无涯', description: '学习1000个单词', icon: '🌟', condition: JSON.stringify({ type: 'total_words', threshold: 1000 }) },
    { id: uuidv4(), code: 'streak_3', name: '三天成习', description: '连续打卡3天', icon: '🔥', condition: JSON.stringify({ type: 'streak_days', threshold: 3 }) },
    { id: uuidv4(), code: 'streak_7', name: '一周坚持', description: '连续打卡7天', icon: '💪', condition: JSON.stringify({ type: 'streak_days', threshold: 7 }) },
    { id: uuidv4(), code: 'streak_30', name: '月度之星', description: '连续打卡30天', icon: '⭐', condition: JSON.stringify({ type: 'streak_days', threshold: 30 }) },
    { id: uuidv4(), code: 'streak_100', name: '百日筑基', description: '连续打卡100天', icon: '👑', condition: JSON.stringify({ type: 'streak_days', threshold: 100 }) },
    { id: uuidv4(), code: 'perfect_1', name: '完美一轮', description: '完成一次全对学习会话', icon: '🎯', condition: JSON.stringify({ type: 'perfect_session', threshold: 1 }) },
    { id: uuidv4(), code: 'perfect_10', name: '十全十美', description: '完成10次全对学习会话', icon: '✨', condition: JSON.stringify({ type: 'perfect_session', threshold: 10 }) },
  ]);
}
