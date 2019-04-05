const fs = require('fs');
const { sentences } = require('sbd');
let wordArray: string[];
let inputText: string;
const str: string = fs.readFileSync("input.txt", { encoding: "utf-8"});

const START = Symbol("START");
const END = Symbol("END");
const strSentences = sentences(str).map(s => s.split(/\s+|(?=[?!.]$)/))
  .map(sArr => [START, ...sArr.filter(s => s), END]);
wordArray = [].concat.apply([], strSentences);

console.log(strSentences);
console.log(wordArray);
interface Acc {
  chain: {
    [START]?: (string | Symbol)[]
    [word: string]: (string | Symbol)[]
  };
  lookback: string;
}
const markhovChain = wordArray.reduce<Acc>(
  (acc: Acc, word: string) => {
    if (acc.lookback) {
      acc.chain[acc.lookback].push(word);
    }
    if (!acc.chain[word]) {
      acc.chain[word] = [];
    }
    acc.lookback = word;
    return acc;
  },
  { chain: {}, lookback: null }
).chain;

const pickRandom = <T>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

function markhov(word: string | Symbol, maxLength: number = 500): string {
  if (word === END || maxLength < 0) return '';
  const nexts = markhovChain[word as string];
  if (!nexts) 
    throw new Error("Initial word not in corpus");
  let nextWord = pickRandom(nexts);
  let rest = markhov(nextWord, maxLength - 1);
  return (word !== START ? word : '') + (['!','?','.'].includes(rest[0]) ? '' : " ") + rest;
}

console.log(markhov(START));
