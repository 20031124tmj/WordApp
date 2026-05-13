const fs = require('fs');
const path = require('path');

const dictFile = path.join(__dirname, 'dict_compact.txt');
const dictLines = fs.readFileSync(dictFile, 'utf-8').split('\n');
const existingWords = new Set();
for (const line of dictLines) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const eqIdx = trimmed.indexOf('=');
  if (eqIdx === -1) continue;
  const word = trimmed.substring(0, eqIdx).trim().toLowerCase();
  existingWords.add(word);
}

const cet4File = path.join(__dirname, 'words_cet4.txt');
const cet6File = path.join(__dirname, 'words_cet6.txt');

const cet4Words = fs.readFileSync(cet4File, 'utf-8').split('\n').map(w => w.trim()).filter(w => w);
const cet6Words = fs.readFileSync(cet6File, 'utf-8').split('\n').map(w => w.trim()).filter(w => w);

const allWords = [...new Set([...cet4Words, ...cet6Words])];
const missing = allWords.filter(w => !existingWords.has(w.toLowerCase()));

console.log(`Total words in lists: ${allWords.length}`);
console.log(`Words in dict: ${existingWords.size}`);
console.log(`Missing words: ${missing.length}`);
console.log('\nMissing words list:');
console.log(missing.sort().join('\n'));
