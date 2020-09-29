const AES = require('crypto-js/aes');
const wordlist = require('wordlist-english');
const fs = require('fs');
const MIN_LENGTH = 3;
const MAX_LENGTH = 8;
const dict = wordlist['english'];

function getRandomInt(max) {
    const res =  Math.floor(Math.random() * Math.floor(max));
    if (res === max) --res;
    return res;
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
    const a = getRandomInt(8) + 2;
    const b = getRandomInt(8) + 2;
    const k = getRandomInt(2);
    switch(k) {
        case 0: return {h: `${a}*${b}`, m: `${a}*${b}`};
        case 1: return {h: `${a*b}:${a}`, m: `${a*b}/${a}`};
    }
}
function generatePuzzleData(date) {
    const puzzles = Array.from(new Array(10)).map(() => randomPuzzleDivMul());
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
