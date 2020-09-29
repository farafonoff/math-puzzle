import React, { useEffect, useState } from 'react';
import Puzzle from './Puzzle';
import './App.css';
import { loadData, getTodayPuzzle } from './passwordsService';
import { get } from 'lodash-es'
import Result from './Result';
import classNames from 'classnames';

function App() {
  const [passwordData, setPasswordData] = useState({});
  const [animClass, setAnimClass] = useState('');
  const [answers, updateAnswers] = useState([]);
  const [step, setStep] = useState(0);
  useEffect(() => {
    loadData()
    .then(data => getTodayPuzzle(data))
    .then((data) => {
      updateAnswers(JSON.parse(localStorage.getItem(`myanswers_${data.date}`)) || []);
      return data;
    })
    .then(data => setPasswordData(data))
  }, []);
  const puzzlesCount = get(passwordData, 'puzzles.length', 0);
  const patchStep = (shift) => {
    let newStep = step + shift;
    if (newStep < 0) {
      newStep = 0;
    }
    if (newStep > puzzlesCount) {
      newStep = puzzlesCount;
    }
    localStorage.setItem(`myanswers_${passwordData.date}`, JSON.stringify(answers));
    switch(shift) {
      case -1: setAnimClass('App-changeb'); break;
      case 1: setAnimClass('App-changef'); break;
    }
    setTimeout(() => {
      setAnimClass('')
    }, 500);
    setStep(newStep);
  };
  const saveAnswer = (step, answer) => {
    const newAnswers = [...answers];
    newAnswers[step] = answer;
    updateAnswers(newAnswers);
  };
  if (puzzlesCount === 0) {
    return (<h1>LOADING</h1>)
  }
  const onSubmit = (event) => {
    patchStep(1);
    event.preventDefault();
  }
  return (
    <div className={classNames('App', 'App-change', animClass)}>
      <header className={classNames('App-header')}>
        <h1>Реши примеры, чтобы получить пароль</h1>
        <nav className="App-nav">
          <button className="Nav-button" onClick={() => patchStep(-1)} tabIndex="-1" onTouchStart={event => event.preventDefault()}>Назад</button>
          <h2>{step + 1}/{puzzlesCount}</h2>        
          <button className="Nav-button" onClick={() => patchStep(1)} tabIndex="-1" onTouchStart={event => event.preventDefault()}>Вперед</button>
        </nav>
      </header>
      {(step < puzzlesCount) &&  <form onSubmit={onSubmit}><Puzzle 
        puzzle={get(passwordData, ['puzzles', step], '')}
        answer={get(answers, step, '')}
        updateAnswer={answer => saveAnswer(step, answer)}></Puzzle></form>}
      {(step === puzzlesCount) &&  <Result 
        puzzles={passwordData.puzzles} 
        answers={answers}
        ciphertext={passwordData.ciphertext}></Result>}

    </div>
  );
}

export default App;
