import React, { useMemo } from 'react';
import AES from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';

function Result({puzzles, answers, ciphertext}) {
    const rezult = puzzles
    .map(puzzle => eval(puzzle.m))
    .reduce((state, rightAnswer, index) => {
        const isOk = (String(rightAnswer) === String(answers[index]));
        return {
            good: state.good + (isOk?1:0),
            bad: state.bad + (isOk?0:1)
        }
    }, { good: 0, bad: 0});
    const answersPwd = answers.join('_');
    const decrypted = useMemo(() => {
        return AES.decrypt(ciphertext, answersPwd).toString(Utf8);
    }, [answersPwd, ciphertext]);
    return (
        <article>
            <h1 className="App-goods">Правильных ответов: {rezult.good}</h1>
            <h1 className="App-bads">Неправильных ответов: {rezult.bad}</h1>
            <h1 className="App-bads">Пароль: {decrypted}</h1>
        </article>
    )
}

export default Result;