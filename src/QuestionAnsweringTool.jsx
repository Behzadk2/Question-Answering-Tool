import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const QuestionAnsweringTool = () => {
  const [inputText, setInputText] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [contextBefore, setContextBefore] = useState('');
  const [contextAfter, setContextAfter] = useState('');

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleQuestionChange = (event) => {
    setQuestion(event.target.value);
  };

  const handleAnswer = async () => {
    try {
      const response = await axios.post(
        'https://api-inference.huggingface.co/models/deepset/roberta-base-squad2',
        {
          inputs: {
            context: inputText,
            question: question,
          },
        }
      );

      const { answer, start, end } = response.data;

      const contextBefore = inputText.slice(
        Math.max(0, start - 15),
        Math.max(0, start)
      );
      const contextAfter = inputText.slice(end, end + 15);

      setAnswer(answer);
      setContextBefore(contextBefore);
      setContextAfter(contextAfter);
    } catch (error) {
      console.error('Error fetching answer:', error);
    }
  };

  return (
    <div
      style={{
        background: '#fafafa',
        padding: '20px',
      }}
    >
      <div
        style={{
          background: '#ffffff',
          padding: '10px',
          borderRadius: '5px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
          animation: 'fadein 0.5s',
        }}
      >
        <h1 class="text-center mb-4">Question Answering Tool</h1>
        <div style={{ margin: '10px 0' }}>
          <textarea
            class="form-control"
            placeholder="Enter the input text..."
            rows="6"
            value={inputText}
            onChange={handleInputChange}
          />
        </div>
        <div style={{ margin: '10px 0' }}>
          <input
            type="text"
            class="form-control"
            placeholder="Enter your question..."
            value={question}
            onChange={handleQuestionChange}
          />
          <button
            class="btn btn-primary mt-2"
            style={{ color: '#ffffff', background: '#337ab7' }}
            onClick={handleAnswer}
          >
            Get Answer
          </button>
        </div>
        {answer && (
          <div style={{ margin: '10px 0' }}>
            <h2>Answer:</h2>
            <p class="bg-lightgreen p-2 rounded animate__animated animate__fadeInUp">
              {contextBefore}
              <span class="bg-success text-white p-1 rounded">
                {answer}
              </span>
              {contextAfter}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionAnsweringTool;
