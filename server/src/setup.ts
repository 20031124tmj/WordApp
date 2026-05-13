import { createDb } from './database/connection';
import { v4 as uuidv4 } from 'uuid';
import { cet4Words } from './database/seeds/cet4_words_data';
import { cet6Words } from './database/seeds/cet6_words_data';
import { ieltsWords } from './database/seeds/ielts_words_data';
import { postgraduateWords } from './database/seeds/postgraduate_words_data';

async function setup() {
  const db = createDb();

  console.log('Running migrations...');

  const hasUsers = await db.schema.hasTable('users');
  if (!hasUsers) {
    await db.schema.createTable('users', (table) => {
      table.string('id').primary();
      table.string('email', 255).unique().notNullable();
      table.string('password_hash', 255).notNullable();
      table.string('nickname', 100).notNullable();
      table.string('avatar_url', 500).nullable();
      table.integer('daily_goal').defaultTo(20);
      table.string('timezone', 50).defaultTo('Asia/Shanghai');
      table.timestamp('created_at').defaultTo(db.fn.now());
      table.timestamp('updated_at').defaultTo(db.fn.now());
    });
    console.log('  Created: users');
  }

  const hasWordBooks = await db.schema.hasTable('word_books');
  if (!hasWordBooks) {
    await db.schema.createTable('word_books', (table) => {
      table.string('id').primary();
      table.string('name', 200).notNullable();
      table.text('description').nullable();
      table.string('language_pair', 20).notNullable().defaultTo('en-zh');
      table.boolean('is_official').defaultTo(false);
      table.integer('word_count').defaultTo(0);
      table.string('cover_url', 500).nullable();
      table.string('created_by').references('id').inTable('users').nullable();
      table.timestamp('created_at').defaultTo(db.fn.now());
      table.timestamp('updated_at').defaultTo(db.fn.now());
    });
    console.log('  Created: word_books');
  }

  const hasWords = await db.schema.hasTable('words');
  if (!hasWords) {
    await db.schema.createTable('words', (table) => {
      table.string('id').primary();
      table.string('word', 200).notNullable();
      table.string('phonetic', 200).nullable();
      table.json('definitions').notNullable();
      table.string('audio_url', 500).nullable();
      table.integer('frequency_rank').nullable();
      table.string('language', 10).defaultTo('en');
    });
    console.log('  Created: words');
  }

  const hasWordBookItems = await db.schema.hasTable('word_book_items');
  if (!hasWordBookItems) {
    await db.schema.createTable('word_book_items', (table) => {
      table.string('id').primary();
      table.string('word_book_id').references('id').inTable('word_books').notNullable();
      table.string('word_id').references('id').inTable('words').notNullable();
      table.integer('position').notNullable();
      table.unique(['word_book_id', 'word_id']);
    });
    console.log('  Created: word_book_items');
  }

  const hasProgress = await db.schema.hasTable('user_word_progress');
  if (!hasProgress) {
    await db.schema.createTable('user_word_progress', (table) => {
      table.string('id').primary();
      table.string('user_id').references('id').inTable('users').notNullable();
      table.string('word_id').references('id').inTable('words').notNullable();
      table.string('word_book_id').references('id').inTable('word_books').notNullable();
      table.float('ease_factor').defaultTo(2.5);
      table.integer('interval').defaultTo(0);
      table.integer('repetitions').defaultTo(0);
      table.timestamp('next_review').nullable();
      table.timestamp('last_review').nullable();
      table.string('status', 20).defaultTo('new');
      table.timestamp('created_at').defaultTo(db.fn.now());
      table.unique(['user_id', 'word_id', 'word_book_id']);
    });
    console.log('  Created: user_word_progress');
  }

  const hasSessions = await db.schema.hasTable('learning_sessions');
  if (!hasSessions) {
    await db.schema.createTable('learning_sessions', (table) => {
      table.string('id').primary();
      table.string('user_id').references('id').inTable('users').notNullable();
      table.string('word_book_id').references('id').inTable('word_books').notNullable();
      table.string('type', 20).notNullable();
      table.timestamp('started_at').defaultTo(db.fn.now());
      table.timestamp('ended_at').nullable();
      table.integer('words_total').defaultTo(0);
      table.integer('words_correct').defaultTo(0);
      table.integer('words_wrong').defaultTo(0);
    });
    console.log('  Created: learning_sessions');
  }

  const hasAnswers = await db.schema.hasTable('user_answers');
  if (!hasAnswers) {
    await db.schema.createTable('user_answers', (table) => {
      table.string('id').primary();
      table.string('session_id').references('id').inTable('learning_sessions').notNullable();
      table.string('word_id').references('id').inTable('words').notNullable();
      table.string('user_id').references('id').inTable('users').notNullable();
      table.string('answer_type', 20).notNullable();
      table.integer('response_time_ms').nullable();
      table.boolean('is_correct').notNullable();
      table.timestamp('answered_at').defaultTo(db.fn.now());
    });
    console.log('  Created: user_answers');
  }

  const hasCheckIns = await db.schema.hasTable('check_ins');
  if (!hasCheckIns) {
    await db.schema.createTable('check_ins', (table) => {
      table.string('id').primary();
      table.string('user_id').references('id').inTable('users').notNullable();
      table.string('check_in_date').notNullable();
      table.integer('words_learned').defaultTo(0);
      table.integer('words_reviewed').defaultTo(0);
      table.integer('streak_days').defaultTo(1);
      table.unique(['user_id', 'check_in_date']);
    });
    console.log('  Created: check_ins');
  }

  const hasAchievements = await db.schema.hasTable('achievements');
  if (!hasAchievements) {
    await db.schema.createTable('achievements', (table) => {
      table.string('id').primary();
      table.string('code', 50).unique().notNullable();
      table.string('name', 100).notNullable();
      table.text('description').notNullable();
      table.string('icon', 100).notNullable();
      table.json('condition').notNullable();
    });
    console.log('  Created: achievements');
  }

  const hasUserAchievements = await db.schema.hasTable('user_achievements');
  if (!hasUserAchievements) {
    await db.schema.createTable('user_achievements', (table) => {
      table.string('id').primary();
      table.string('user_id').references('id').inTable('users').notNullable();
      table.string('achievement_id').references('id').inTable('achievements').notNullable();
      table.timestamp('unlocked_at').defaultTo(db.fn.now());
      table.unique(['user_id', 'achievement_id']);
    });
    console.log('  Created: user_achievements');
  }

  const hasSocialShares = await db.schema.hasTable('social_shares');
  if (!hasSocialShares) {
    await db.schema.createTable('social_shares', (table) => {
      table.string('id').primary();
      table.string('user_id').references('id').inTable('users').notNullable();
      table.string('type', 50).notNullable();
      table.json('content').notNullable();
      table.timestamp('created_at').defaultTo(db.fn.now());
    });
    console.log('  Created: social_shares');
  }

  console.log('\nSeeding data...');

  const achievementCount = await db('achievements').count('* as cnt').first();
  if (Number(achievementCount?.cnt || 0) === 0) {
    await db('achievements').insert([
      { id: uuidv4(), code: 'first_word', name: '初出茅庐', description: '学习第一个单词', icon: '🌱', condition: JSON.stringify({ type: 'total_words', threshold: 1 }) },
      { id: uuidv4(), code: 'words_10', name: '小试牛刀', description: '学习10个单词', icon: '📖', condition: JSON.stringify({ type: 'total_words', threshold: 10 }) },
      { id: uuidv4(), code: 'words_50', name: '渐入佳境', description: '学习50个单词', icon: '📚', condition: JSON.stringify({ type: 'total_words', threshold: 50 }) },
      { id: uuidv4(), code: 'words_100', name: '百词斩', description: '学习100个单词', icon: '💯', condition: JSON.stringify({ type: 'total_words', threshold: 100 }) },
      { id: uuidv4(), code: 'streak_3', name: '三天成习', description: '连续打卡3天', icon: '🔥', condition: JSON.stringify({ type: 'streak_days', threshold: 3 }) },
      { id: uuidv4(), code: 'streak_7', name: '一周坚持', description: '连续打卡7天', icon: '💪', condition: JSON.stringify({ type: 'streak_days', threshold: 7 }) },
      { id: uuidv4(), code: 'streak_30', name: '月度之星', description: '连续打卡30天', icon: '⭐', condition: JSON.stringify({ type: 'streak_days', threshold: 30 }) },
      { id: uuidv4(), code: 'perfect_1', name: '完美一轮', description: '完成一次全对学习会话', icon: '🎯', condition: JSON.stringify({ type: 'perfect_session', threshold: 1 }) },
    ]);
    console.log('  Seeded: achievements');
  }

  const wordCount = await db('words').count('* as cnt').first();
  if (Number(wordCount?.cnt || 0) === 0) {
    const wordIds: string[] = [];
    for (const w of cet4Words) {
      const wordId = uuidv4();
      await db('words').insert({
        id: wordId,
        word: w.word,
        phonetic: w.phonetic,
        definitions: JSON.stringify(w.definitions),
        language: 'en',
      });
      wordIds.push(wordId);
    }

    const bookId = uuidv4();
    await db('word_books').insert({
      id: bookId,
      name: 'CET-4 核心词汇',
      description: '大学英语四级核心高频词汇，涵盖真题高频词2000+',
      language_pair: 'en-zh',
      is_official: true,
      word_count: wordIds.length,
    });

    for (let i = 0; i < wordIds.length; i++) {
      await db('word_book_items').insert({
        id: uuidv4(),
        word_book_id: bookId,
        word_id: wordIds[i],
        position: i + 1,
      });
    }
    console.log(`  Seeded: CET-4 wordbook with ${wordIds.length} words`);
  }

  const bookCount = await db('word_books').count('* as cnt').first();
  if (Number(bookCount?.cnt || 0) <= 1) {
    const seedWordBook = async (words: typeof cet6Words, name: string, description: string) => {
      const existing = await db('word_books').where({ name }).first();
      if (existing) return;
      const wIds: string[] = [];
      const seenWords = new Set<string>();
      for (const w of words) {
        if (seenWords.has(w.word.toLowerCase())) continue;
        seenWords.add(w.word.toLowerCase());
        let wordId: string;
        const existingWord = await db('words').where({ word: w.word }).first();
        if (existingWord) {
          wordId = existingWord.id;
        } else {
          wordId = uuidv4();
          await db('words').insert({
            id: wordId,
            word: w.word,
            phonetic: w.phonetic,
            definitions: JSON.stringify(w.definitions),
            language: 'en',
          });
        }
        wIds.push(wordId);
      }
      const bId = uuidv4();
      await db('word_books').insert({
        id: bId,
        name,
        description,
        language_pair: 'en-zh',
        is_official: true,
        word_count: wIds.length,
      });
      for (let i = 0; i < wIds.length; i++) {
        await db('word_book_items').insert({
          id: uuidv4(),
          word_book_id: bId,
          word_id: wIds[i],
          position: i + 1,
        });
      }
      console.log(`  Seeded: ${name} with ${wIds.length} words`);
    };

    await seedWordBook(cet6Words, 'CET-6 核心词汇', '大学英语六级核心高频词汇，涵盖学术、社会、心理等主题');
    await seedWordBook(ieltsWords, '雅思核心词汇', 'IELTS雅思考试核心词汇，覆盖听说读写高频词');
    await seedWordBook(postgraduateWords, '考研英语词汇', '研究生入学考试英语核心词汇，涵盖学术写作与阅读高频词');
  }

  console.log('\nSetup complete!');
  await db.destroy();
}

setup().catch((err) => {
  console.error('Setup failed:', err);
  process.exit(1);
});
