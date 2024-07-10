import React, { useState, useEffect } from 'react';
import './App.css';

// Fisher-Yatesアルゴリズムを使用したシャッフル関数
const shuffleArray = (array) => {
  let newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

function App() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [timeOver, setTimeOver] = useState(false);

  useEffect(() => {
    fetch('/questions.json')
      .then(response => response.json())
      .then(data => {
        const shuffledData = data.map(q => ({
          ...q,
          options: shuffleArray(q.options)
        }));
        setQuestions(shuffledData);
      });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (selectedOption === null && questions.length > 0) {
        setIncorrectCount(incorrectCount + 1);
        setTimeOver(true);
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [selectedOption, incorrectCount, questions]);

  const handleOptionClick = (option) => {
    if (selectedOption === null) {
      setSelectedOption(option);
      if (option === questions[currentQuestionIndex].correctOption) {
        setCorrectCount(correctCount + 1);
      } else {
        setIncorrectCount(incorrectCount + 1);
      }
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setTimeOver(false);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      alert("Quiz finished!");
    }
  };

  if (questions.length === 0) {
    return <div>Loading...</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="App">
      <h1>{currentQuestion.question}</h1>
      <div className="options-container">
        {currentQuestion.options.map((option, index) => (
          <button 
            key={index} 
            onClick={() => handleOptionClick(option)}
            className={selectedOption === option ? (option === currentQuestion.correctOption ? 'correct' : 'incorrect') : ''}
          >
            {option}
          </button>
        ))}
      </div>
      <div className="scoreboard">
        <p>Correct: {correctCount}</p>
        <p>Incorrect: {incorrectCount}</p>
      </div>
      {timeOver && <p>Time Over! The correct answer was {currentQuestion.correctOption}</p>}
      <button onClick={handleNextQuestion} disabled={selectedOption === null && !timeOver}>
        Next Question
      </button>
    </div>
  );
}

export default App;
