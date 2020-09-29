import React from 'react';

function Puzzle({puzzle, answer, updateAnswer}) {
    return (
    <article>
        <h1>{puzzle.h}</h1>
        <input id="ianswer" type="number" value={answer} onChange={(event)=>{updateAnswer(event.target.value)}}></input>
    </article>
    );
}
export default Puzzle;