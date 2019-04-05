const fs = require('fs');
const { sentences } = require('sbd');
let wordArray: string[];
let inputText: string;
const mobyDick: string = fs.readFileSync("input.txt", { encoding: "utf-8"});

// Moby Dick
console.log(mobyDick.slice(0,100))

const START = Symbol("START");
const END = Symbol("END");
console.log(sentences(mobyDick));
const strSentences: string[][] = sentences(mobyDick)
  .map(s => s.split(/\s+|(?=[?!.]$)/))
  .map(sArr => [START, ...sArr.filter(s => s), END]);
wordArray = [].concat.apply([], strSentences);

type FavoriteThing = 'puppies' | 'rainbows' | 'typescript';

let foo: FavoriteThing;

console.log(strSentences);
console.log(wordArray);
interface Accumulator {
  chain: {
    [START]?: {
      [bigramWord: string]: (string | typeof END)[];
    }
    [word: string]: {
      [bigramWord: string]: (string | typeof END)[];
    }
  };
  lookback: [string, string];
}

const markhovChain = wordArray.reduce<Accumulator>(

  (acc: Accumulator, word: string) => {
    const [x, y] = acc.lookback; 

    if (acc.lookback) {
      acc.chain[x][y].push(word);
    }
    if (!acc.chain[word]) {
      acc.chain[word] = {};
    }
    if(!acc.chain[y][word]) {
      acc.chain[y][word] = [];
    }

    acc.lookback = [acc.lookback[1], word];
    return acc;
  },
  { chain: {}, lookback: [null, null] }
).chain;

const pickRandom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

function markhov(word: string | typeof START | typeof END = START, maxLength: number = 500): string {
  if (word === END || maxLength < 0) return '';
  const nexts = markhovChain[word];
  if (!nexts) 
    throw new Error("Initial word not in corpus");
  let nextWord = pickRandom(nexts);
  let rest = markhov(nextWord, maxLength - 1);
  return (word !== START ? word : '') + (['!','?','.'].includes(rest[0]) ? '' : " ") + rest;
}

console.log(markhov());
console.log(markhov());
console.log(markhov());
console.log(markhov("Call"));

