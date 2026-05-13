const fs = require('fs');
const path = require('path');

const dictPath = path.join(__dirname, 'dict_compact.txt');
const existingLines = fs.readFileSync(dictPath, 'utf-8').split('\n');
const existingWords = new Set();
for (const line of existingLines) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const eqIdx = trimmed.indexOf('=');
  if (eqIdx === -1) continue;
  const word = trimmed.substring(0, eqIdx).trim().toLowerCase();
  existingWords.add(word);
}

const cet4Words = fs.readFileSync(path.join(__dirname, 'words_cet4.txt'), 'utf-8')
  .split('\n').map(w => w.trim()).filter(w => w);
const cet6Words = fs.readFileSync(path.join(__dirname, 'words_cet6.txt'), 'utf-8')
  .split('\n').map(w => w.trim()).filter(w => w);

const allWords = [...new Set([...cet4Words, ...cet6Words])];
const missing = allWords.filter(w => !existingWords.has(w.toLowerCase()));

console.log(`Dictionary: ${existingWords.size} words`);
console.log(`Total unique words in lists: ${allWords.length}`);
console.log(`Missing words: ${missing.length}`);
console.log('\nMissing words list:');
missing.sort().forEach(w => console.log(w));
