const knex = require('knex');
const path = require('path');

const db = knex({
  client: 'better-sqlite3',
  connection: { filename: path.join(process.cwd(), 'data', 'wordmaster.db') },
  useNullAsDefault: true
});

(async () => {
  const total = await db('words').count('* as c');
  console.log('Total words:', total[0].c);

  const emptyPhonetic = await db('words').where('phonetic', '').count('* as c');
  console.log('Words with empty phonetic:', emptyPhonetic[0].c);

  const sample = await db('words').limit(15).offset(50);
  console.log('\nSample words (offset 50):');
  sample.forEach(w => {
    const defs = JSON.parse(w.definitions);
    const hasPos = defs.some(d => d.pos && d.pos.trim());
    const hasMeaning = defs.some(d => d.meaning && d.meaning.trim() && d.meaning !== w.word);
    console.log(`  ${w.word} | ${w.phonetic || '(no phonetic)'} | pos: ${hasPos ? '✓' : '✗'} | meaning: ${hasMeaning ? '✓' : '✗'} | ${defs.map(d => d.pos + ' ' + d.meaning).join('; ')}`);
  });

  const eWords = await db('words').whereLike('word', 'e%').limit(10);
  console.log('\nE-words sample:');
  eWords.forEach(w => {
    const defs = JSON.parse(w.definitions);
    const hasPos = defs.some(d => d.pos && d.pos.trim());
    const hasMeaning = defs.some(d => d.meaning && d.meaning.trim() && d.meaning !== w.word);
    console.log(`  ${w.word} | ${w.phonetic || '(no phonetic)'} | pos: ${hasPos ? '✓' : '✗'} | meaning: ${hasMeaning ? '✓' : '✗'} | ${defs.map(d => d.pos + ' ' + d.meaning).join('; ')}`);
  });

  const sWords = await db('words').whereLike('word', 's%').limit(10);
  console.log('\nS-words sample:');
  sWords.forEach(w => {
    const defs = JSON.parse(w.definitions);
    const hasPos = defs.some(d => d.pos && d.pos.trim());
    const hasMeaning = defs.some(d => d.meaning && d.meaning.trim() && d.meaning !== w.word);
    console.log(`  ${w.word} | ${w.phonetic || '(no phonetic)'} | pos: ${hasPos ? '✓' : '✗'} | meaning: ${hasMeaning ? '✓' : '✗'} | ${defs.map(d => d.pos + ' ' + d.meaning).join('; ')}`);
  });

  let badCount = 0;
  const allWords = await db('words').select('*');
  for (const w of allWords) {
    const defs = JSON.parse(w.definitions);
    const hasPos = defs.some(d => d.pos && d.pos.trim());
    const hasMeaning = defs.some(d => d.meaning && d.meaning.trim() && d.meaning !== w.word);
    if (!hasPos || !hasMeaning) badCount++;
  }
  console.log(`\nWords missing pos or meaning: ${badCount} / ${allWords.length}`);

  await db.destroy();
})();
