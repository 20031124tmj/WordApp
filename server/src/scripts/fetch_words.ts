import axios from 'axios';
import * as fs from 'fs';

const SLEEP_MS = 300;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const posMap: Record<string, string> = {
  noun: 'n.', verb: 'v.', adjective: 'adj.', adverb: 'adv.',
  preposition: 'prep.', conjunction: 'conj.', pronoun: 'pron.',
  interjection: 'interj.', determiner: 'det.', abbreviation: 'abbr.',
};

const simpleCnMap: Record<string, string> = {
  'the': '这；那', 'be': '是；存在', 'to': '到；向', 'of': '…的', 'and': '和',
  'a': '一个', 'in': '在…里', 'that': '那个', 'have': '有', 'I': '我',
  'it': '它', 'for': '为了', 'not': '不', 'on': '在…上', 'with': '和…一起',
  'he': '他', 'as': '作为', 'you': '你', 'do': '做', 'at': '在',
  'this': '这个', 'but': '但是', 'his': '他的', 'by': '通过', 'from': '从',
  'they': '他们', 'we': '我们', 'say': '说', 'her': '她的', 'she': '她',
  'or': '或者', 'an': '一个', 'will': '将', 'my': '我的', 'one': '一',
  'all': '所有', 'would': '会', 'there': '那里', 'their': '他们的', 'what': '什么',
  'so': '所以', 'up': '向上', 'out': '出去', 'if': '如果', 'about': '关于',
  'who': '谁', 'get': '得到', 'which': '哪个', 'go': '去', 'me': '我',
  'when': '当…时', 'make': '制造', 'can': '能', 'like': '喜欢', 'time': '时间',
  'no': '不', 'just': '仅仅', 'him': '他', 'know': '知道', 'take': '拿',
  'people': '人们', 'into': '进入', 'year': '年', 'your': '你的', 'good': '好的',
  'some': '一些', 'could': '能够', 'them': '他们', 'see': '看见', 'other': '其他的',
  'than': '比', 'then': '然后', 'now': '现在', 'look': '看', 'only': '只',
  'come': '来', 'its': '它的', 'over': '超过', 'think': '想', 'also': '也',
  'back': '回来', 'after': '之后', 'use': '使用', 'two': '二', 'how': '如何',
  'our': '我们的', 'work': '工作', 'first': '第一', 'well': '好', 'way': '方式',
  'even': '甚至', 'new': '新的', 'want': '想要', 'because': '因为', 'any': '任何',
  'these': '这些', 'give': '给', 'day': '天', 'most': '大多数', 'us': '我们',
};

async function fetchWord(word: string): Promise<any | null> {
  try {
    const res = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`, { timeout: 5000 });
    const entry = res.data[0];
    if (!entry) return null;

    const phonetic = entry.phonetic || entry.phonetics?.find((p: any) => p.text)?.text || '';
    const definitions: any[] = [];

    for (const meaning of (entry.meanings || []).slice(0, 3)) {
      const pos = posMap[meaning.partOfSpeech] || meaning.partOfSpeech;
      for (const def of (meaning.definitions || []).slice(0, 2)) {
        const cnMeaning = simpleCnMap[word.toLowerCase()] || def.definition.split(';')[0];
        const example = def.example ? { en: def.example, zh: '' } : undefined;
        definitions.push({
          pos,
          meaning: cnMeaning,
          ...(example ? { examples: [example] } : {}),
        });
        break;
      }
    }

    if (definitions.length === 0) return null;
    return { word, phonetic, definitions };
  } catch {
    return null;
  }
}

async function main() {
  const type = process.argv[2];
  const inputFile = process.argv[3];
  const outputFile = process.argv[4];

  if (!type || !inputFile || !outputFile) {
    console.log('Usage: npx ts-node fetch_words.ts <type> <input.txt> <output.json>');
    process.exit(1);
  }

  const words = fs.readFileSync(inputFile, 'utf-8')
    .split('\n')
    .map((w) => w.trim())
    .filter((w) => w && !w.startsWith('#'));

  console.log(`Fetching ${words.length} words for ${type}...`);

  const results: any[] = [];
  let fetched = 0;
  let failed = 0;

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const data = await fetchWord(word);
    if (data) {
      results.push(data);
      fetched++;
    } else {
      failed++;
    }

    if ((i + 1) % 50 === 0) {
      console.log(`  Progress: ${i + 1}/${words.length} (fetched: ${fetched}, failed: ${failed})`);
    }

    await sleep(SLEEP_MS);
  }

  fs.writeFileSync(outputFile, JSON.stringify(results, null, 2), 'utf-8');
  console.log(`Done! Fetched: ${fetched}, Failed: ${failed}, Saved to: ${outputFile}`);
}

main().catch(console.error);
