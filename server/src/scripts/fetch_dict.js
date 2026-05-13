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
console.log(`Existing dictionary: ${existingWords.size} words`);

const cet4Path = path.join(__dirname, 'words_cet4.txt');
const cet6Path = path.join(__dirname, 'words_cet6.txt');
const cet4Words = fs.readFileSync(cet4Path, 'utf-8').split('\n').map(w => w.trim()).filter(w => w);
const cet6Words = fs.readFileSync(cet6Path, 'utf-8').split('\n').map(w => w.trim()).filter(w => w);

const allWords = [...new Set([...cet4Words, ...cet6Words])];
const missing = allWords.filter(w => !existingWords.has(w.toLowerCase()));
console.log(`Total unique words: ${allWords.length}`);
console.log(`Missing words: ${missing.length}`);

const BATCH_SIZE = 5;
const DELAY_MS = 1500;
const MAX_RETRIES = 3;

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchWord(word, retryCount = 0) {
  try {
    const https = require('https');
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`;

    return new Promise((resolve, reject) => {
      https.get(url, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          if (res.statusCode === 200) {
            try {
              const json = JSON.parse(data);
              resolve(json);
            } catch (e) {
              reject(new Error(`JSON parse error for ${word}`));
            }
          } else {
            reject(new Error(`HTTP ${res.statusCode} for ${word}`));
          }
        });
      }).on('error', (e) => reject(e));
    });
  } catch (e) {
    if (retryCount < MAX_RETRIES) {
      await delay(2000);
      return fetchWord(word, retryCount + 1);
    }
    throw e;
  }
}

function extractDefinition(apiData) {
  if (!apiData || !apiData[0]) return null;

  const entry = apiData[0];
  const phonetic = entry.phonetic || '';
  const definitions = [];

  for (const meaning of (entry.meanings || [])) {
    const pos = meaning.partOfSpeech || '';
    const def = meaning.definitions?.[0]?.definition || '';
    if (pos && def) {
      definitions.push({ pos: pos.substring(0, 4), meaning: def });
      if (definitions.length >= 3) break;
    }
  }

  if (definitions.length === 0) return null;

  return { phonetic, definitions };
}

function posToChinese(pos) {
  const map = {
    'noun': 'n.', 'n': 'n.',
    'verb': 'v.', 'v': 'v.',
    'adjective': 'adj.', 'adj': 'adj.',
    'adverb': 'adv.', 'adv': 'adv.',
    'preposition': 'prep.', 'prep': 'prep.',
    'conjunction': 'conj.', 'conj': 'conj.',
    'pronoun': 'pron.', 'pron': 'pron.',
    'interjection': 'interj.', 'interj': 'interj.',
    'determiner': 'det.', 'det': 'det.',
    'abbreviation': 'abbr.', 'abbr': 'abbr.',
  };
  return map[pos.toLowerCase()] || pos + '.';
}

function translateMeaning(englishDef) {
  return englishDef;
}

async function main() {
  const results = {};
  const failed = [];

  for (let i = 0; i < missing.length; i += BATCH_SIZE) {
    const batch = missing.slice(i, i + BATCH_SIZE);
    console.log(`Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(missing.length / BATCH_SIZE)}: ${batch.join(', ')}`);

    const promises = batch.map(async (word) => {
      try {
        const apiData = await fetchWord(word);
        const def = extractDefinition(apiData);
        if (def) {
          const posDefs = def.definitions.map(d => {
            const pos = posToChinese(d.pos);
            return `${pos}|${d.meaning}`;
          }).join('||');
          results[word.toLowerCase()] = `${def.phonetic}|${posDefs}`;
          console.log(`  ✓ ${word}`);
        } else {
          failed.push(word);
          console.log(`  ✗ ${word} (no definition)`);
        }
      } catch (e) {
        failed.push(word);
        console.log(`  ✗ ${word} (${e.message})`);
      }
    });

    await Promise.all(promises);
    await delay(DELAY_MS);
  }

  console.log(`\nFetched: ${Object.keys(results).length} words`);
  console.log(`Failed: ${failed.length} words`);

  const newEntries = [];
  for (const [word, entry] of Object.entries(results)) {
    newEntries.push(`${word}=${entry}`);
  }
  newEntries.sort();

  const allContent = existingLines.filter(l => l.trim()).join('\n') + '\n' + newEntries.join('\n') + '\n';
  fs.writeFileSync(dictPath, allContent, 'utf-8');
  console.log(`\nDictionary updated: ${existingWords.size + Object.keys(results).length} total words`);

  if (failed.length > 0) {
    const failedPath = path.join(__dirname, 'dict_failed.txt');
    fs.writeFileSync(failedPath, failed.join('\n'), 'utf-8');
    console.log(`Failed words saved to: ${failedPath}`);
  }
}

main().catch(console.error);
