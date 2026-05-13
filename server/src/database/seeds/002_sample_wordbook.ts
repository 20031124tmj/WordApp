import type { Knex } from 'knex';
import { v4 as uuidv4 } from 'uuid';
import { cet4Words } from './cet4_words_data';
import { cet6Words } from './cet6_words_data';
import { ieltsWords } from './ielts_words_data';
import { postgraduateWords } from './postgraduate_words_data';

async function seedWordBook(
  knex: Knex,
  words: Array<{ word: string; phonetic: string; definitions: Array<{ pos: string; meaning: string; examples: Array<{ en: string; zh: string }> }> }>,
  bookName: string,
  bookDescription: string,
) {
  const wordIds: string[] = [];
  const seen = new Set<string>();

  for (const w of words) {
    const lower = w.word.toLowerCase();
    if (seen.has(lower)) continue;
    seen.add(lower);

    const existing = await knex('words').where({ word: w.word }).first();
    if (existing) {
      wordIds.push(existing.id);
    } else {
      const wordId = uuidv4();
      await knex('words').insert({
        id: wordId,
        word: w.word,
        phonetic: w.phonetic,
        definitions: JSON.stringify(w.definitions),
        language: 'en',
      });
      wordIds.push(wordId);
    }
  }

  const existingBook = await knex('word_books').where({ name: bookName }).first();
  if (!existingBook) {
    const bookId = uuidv4();
    await knex('word_books').insert({
      id: bookId,
      name: bookName,
      description: bookDescription,
      language_pair: 'en-zh',
      is_official: true,
      word_count: wordIds.length,
    });

    for (let i = 0; i < wordIds.length; i++) {
      await knex('word_book_items').insert({
        id: uuidv4(),
        word_book_id: bookId,
        word_id: wordIds[i],
        position: i + 1,
      });
    }
  }

  return wordIds.length;
}

export async function seed(knex: Knex): Promise<void> {
  const c4 = await seedWordBook(knex, cet4Words, 'CET-4 核心词汇', '大学英语四级核心高频词汇，涵盖考试必备词汇2100+');
  console.log(`CET-4: ${c4} words seeded`);

  const c6 = await seedWordBook(knex, cet6Words, 'CET-6 核心词汇', '大学英语六级核心高频词汇，涵盖考试必备词汇2000+');
  console.log(`CET-6: ${c6} words seeded`);

  const ielts = await seedWordBook(knex, ieltsWords, 'IELTS 雅思词汇', '雅思考试核心词汇，涵盖听说读写高频词汇700+');
  console.log(`IELTS: ${ielts} words seeded`);

  const postgrad = await seedWordBook(knex, postgraduateWords, '考研英语词汇', '考研英语核心词汇，涵盖历年真题高频词600+');
  console.log(`Postgraduate: ${postgrad} words seeded`);
}
