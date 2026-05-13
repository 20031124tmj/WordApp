const axios = require('axios');
const fs = require('fs');

const SLEEP_MS = 200;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const posMap = {
  noun: 'n.', verb: 'v.', adjective: 'adj.', adverb: 'adv.',
  preposition: 'prep.', conjunction: 'conj.', pronoun: 'pron.',
  interjection: 'interj.', determiner: 'det.', abbreviation: 'abbr.',
};

async function fetchWord(word) {
  try {
    const res = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`, { timeout: 8000 });
    const entry = res.data[0];
    if (!entry) return null;

    const phonetic = entry.phonetic || (entry.phonetics && entry.phonetics.find(p => p.text) ? entry.phonetics.find(p => p.text).text : '') || '';
    const definitions = [];

    for (const meaning of (entry.meanings || []).slice(0, 3)) {
      const pos = posMap[meaning.partOfSpeech] || meaning.partOfSpeech;
      for (const def of (meaning.definitions || []).slice(0, 1)) {
        const cnMeaning = def.definition.split(';')[0].split(',')[0];
        const example = def.example ? [{ en: def.example, zh: '' }] : undefined;
        definitions.push({
          pos,
          meaning: cnMeaning,
          ...(example ? { examples: example } : {}),
        });
        break;
      }
    }

    if (definitions.length === 0) return null;
    return { word, phonetic, definitions };
  } catch (e) {
    return null;
  }
}

async function main() {
  const type = process.argv[2];
  const inputFile = process.argv[3];
  const outputFile = process.argv[4];

  if (!type || !inputFile || !outputFile) {
    console.log('Usage: node fetch_words.js <type> <input.txt> <output.json>');
    process.exit(1);
  }

  const words = fs.readFileSync(inputFile, 'utf-8')
    .split('\n')
    .map(w => w.trim())
    .filter(w => w && !w.startsWith('#'));

  console.log(`Fetching ${words.length} words for ${type}...`);

  const results = [];
  let fetched = 0;
  let failed = 0;
  const batchSize = 10;

  for (let i = 0; i < words.length; i += batchSize) {
    const batch = words.slice(i, i + batchSize);
    const promises = batch.map(w => fetchWord(w));
    const batchResults = await Promise.all(promises);

    for (const data of batchResults) {
      if (data) {
        results.push(data);
        fetched++;
      } else {
        failed++;
      }
    }

    if ((i + batchSize) % 100 === 0 || i + batchSize >= words.length) {
      console.log(`  Progress: ${Math.min(i + batchSize, words.length)}/${words.length} (ok: ${fetched}, fail: ${failed})`);
    }

    await sleep(SLEEP_MS);
  }

  fs.writeFileSync(outputFile, JSON.stringify(results, null, 2), 'utf-8');
  console.log(`Done! Fetched: ${fetched}, Failed: ${failed}, Saved to: ${outputFile}`);
}

main().catch(console.error);
