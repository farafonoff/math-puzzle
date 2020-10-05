const AES = require('crypto-js/aes');
const wordlist = require('wordlist-english');
const fs = require('fs');
const { uniqBy } = require('lodash');
const MIN_LENGTH = 3;
const MAX_LENGTH = 8;
const dict = wordlist['english'];

function getRandomInt(max) {
    const res =  Math.floor(Math.random() * Math.floor(max));
    if (res === max) --res;
    return res;
}
function getRandomIntMin(min, max) {
  return getRandomInt(max-min) + min;
}
function randomWord() {
    let word ;
    do {
        const value = getRandomInt(dict.length);
        word = dict[value];    
    } while (word.length < MIN_LENGTH || word.length > MAX_LENGTH);
    return word;
}
function randomPuzzleDivMul() {
    let a = getRandomIntMin(2,10);
    let b = getRandomIntMin(6,10);
    const s = getRandomInt(2);
    const k = getRandomInt(3);
    if (s) {
      [a, b] = [b, a]
    }
    switch(k) {
        case 0: return {h: `${a}*${b}`, m: `${a}*${b}`};
        default: return {h: `${a*b}:${a}`, m: `${a*b}/${a}`};
    }
}
function generatePuzzleData(date) {
    const puzzles_count = 30;
    let puzzles = uniqBy(Array.from(new Array(puzzles_count*3)).map(() => randomPuzzleDivMul()), 'h');
    puzzles = puzzles.slice(0, puzzles_count);
    const password = puzzles.map(puz => eval(puz.m)).join('_');
    const word = randomWord();
    return {
        date: date.toDateString(),
        puzzles,
        ciphertext: AES.encrypt(word, password).toString(),
        plaintext: word
    }
}
//console.log(randomWord());
//console.log(randomPuzzleDivMul());
const nowDate = new Date();
const puzzles = [];
for(let i=0;i<50;++i) {
    const puzzle = generatePuzzleData(nowDate);
    nowDate.setDate(nowDate.getDate() + 1);
    puzzles.push(puzzle);
}

const publicData = puzzles.map(puz => {
    return {
        ...puz,
        plaintext: undefined
    }
});
const privateData = puzzles.map(puz => {
    return {
        ...puz,
        puzzles: undefined
    }
});
fs.writeFileSync('public/passwords.json', JSON.stringify(publicData, null, 2));
fs.writeFileSync('passwords.json', JSON.stringify(privateData, null, 2));
