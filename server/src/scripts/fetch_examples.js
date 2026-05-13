const fs = require('fs');
const path = require('path');

const CACHE_FILE = path.join(__dirname, 'examples_cache.json');
const FAILED_FILE = path.join(__dirname, 'failed_words.txt');

function loadCache() {
  if (fs.existsSync(CACHE_FILE)) {
    return JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
  }
  return {};
}

function saveCache(cache) {
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), 'utf-8');
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchWordExamples(word, retryCount = 2) {
  for (let attempt = 0; attempt <= retryCount; attempt++) {
    try {
      const resp = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
      if (resp.status === 404) return null;
      if (resp.status === 429) {
        console.log(`  Rate limited on "${word}", waiting 5s...`);
        await sleep(5000);
        continue;
      }
      if (!resp.ok) {
        if (attempt < retryCount) {
          await sleep(2000);
          continue;
        }
        return null;
      }
      const data = await resp.json();
      const examples = [];
      for (const entry of data) {
        for (const meaning of entry.meanings || []) {
          const pos = meaning.partOfSpeech || '';
          for (const def of meaning.definitions || []) {
            if (def.example && def.example.trim()) {
              examples.push({
                pos: pos,
                en: def.example.trim(),
                definition: def.definition ? def.definition.trim() : '',
              });
            }
          }
        }
      }
      return examples.length > 0 ? examples : null;
    } catch (err) {
      if (attempt < retryCount) {
        await sleep(2000);
        continue;
      }
      console.log(`  Error fetching "${word}": ${err.message}`);
      return null;
    }
  }
  return null;
}

async function main() {
  const cache = loadCache();
  const cachedCount = Object.keys(cache).length;
  console.log(`Loaded cache: ${cachedCount} words`);

  const cet4 = fs.readFileSync(path.join(__dirname, 'words_cet4.txt'), 'utf-8')
    .split('\n').map(w => w.trim()).filter(w => w);
  const cet6 = fs.readFileSync(path.join(__dirname, 'words_cet6.txt'), 'utf-8')
    .split('\n').map(w => w.trim()).filter(w => w);

  const allWords = [...new Set([...cet4, ...cet6])];
  const needFetch = allWords.filter(w => !cache[w.toLowerCase()]);
  console.log(`Total words: ${allWords.length}, Already cached: ${cachedCount}, Need fetch: ${needFetch.length}`);

  const failed = [];
  let fetched = 0;
  const BATCH_SIZE = 50;
  const SAVE_INTERVAL = 100;

  for (let i = 0; i < needFetch.length; i++) {
    const word = needFetch[i];
    const examples = await fetchWordExamples(word);

    if (examples && examples.length > 0) {
      cache[word.toLowerCase()] = examples;
      fetched++;
    } else {
      failed.push(word);
    }

    if ((i + 1) % SAVE_INTERVAL === 0 || i === needFetch.length - 1) {
      saveCache(cache);
      fs.writeFileSync(FAILED_FILE, failed.join('\n'), 'utf-8');
      console.log(`Progress: ${i + 1}/${needFetch.length} | Fetched: ${fetched} | Failed: ${failed.length} | Last: ${word}`);
    }

    await sleep(300);
  }

  saveCache(cache);
  fs.writeFileSync(FAILED_FILE, failed.join('\n'), 'utf-8');
  console.log(`\nDone! Fetched: ${fetched}, Failed: ${failed.length}`);
  console.log(`Cache saved to: ${CACHE_FILE}`);
  console.log(`Failed words saved to: ${FAILED_FILE}`);
}

main().catch(console.error);
