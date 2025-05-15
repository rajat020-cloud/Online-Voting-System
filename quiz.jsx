import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";

// PageOne Component
function PageOne() {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    navigate("/page-two", { state: { name } });
  };

  return (
    <div>
      <h1>Enter Your Name</h1>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

// PageTwo Component
function PageTwo() {
  const navigate = useNavigate();
  const location = useLocation();
  const { name } = location.state || { name: "Guest" };

  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);

  const questions = [
    { question: "What is React?", correct: "A library for building UI" },
    { question: "What is JSX?", correct: "JavaScript XML" },
    { question: "Which hook is used for state management?", correct: "useState" },
  ];

  const handleChange = (index, value) => {
    setAnswers({ ...answers, [index]: value });
  };

  const handleSubmit = () => {
    let calculatedScore = 0;
    questions.forEach((q, index) => {
      if (answers[index] === q.correct) {
        calculatedScore++;
      }
    });
    navigate("/page-three", { state: { name, score: calculatedScore } });
  };

  return (
    <div>
      <h1>Hello, {name}! Here's a React Quiz:</h1>
      {questions.map((q, index) => (
        <div key={index}>
          <p>{q.question}</p>
          <input
            type="text"
            placeholder="Your answer"
            onChange={(e) => handleChange(index, e.target.value)}
          />
        </div>
      ))}
      <button onClick={handleSubmit}>Submit Quiz</button>
    </div>
  );
}

// PageThree Component
function PageThree() {
  const location = useLocation();
  const { name, score } = location.state || { name: "Guest", score: 0 };

  return (
    <div>
      <h1>Quiz Results</h1>
      <p>Great job, {name}!</p>
      <p>Your score: {score}</p>
    </div>
  );
}

// Main App Component
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PageOne />} />
        <Route path="/page-two" element={<PageTwo />} />
        <Route path="/page-three" element={<PageThree />} />
      </Routes>
    </Router>
  );
}

export default App;
