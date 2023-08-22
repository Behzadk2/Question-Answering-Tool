import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./QuestionAnsweringTool.css";

//for example section
const fixedText =
  "Xylitol is also known as birch sugar. Xylitol tastes just as sweet as sugar, and you can replace it one-to-one in recipes. But why should you do that? Birch sugar has some positive advantages over table sugar. On the one hand, it is tooth-friendly and even has a non-cariogenic effect, i.e. it does not cause caries. Secondly, xylitol is particularly popular because of its low glycemic index. It has a glycemic index of 7 to 11, while that of regular sugar is 65 to 100. So if you want to consciously avoid the negative properties of sugar, but not its sweetness, you should give xylitol a try. However, in moderation, because in high doses it can have a laxative effect. Birch sugar should also be kept away from dogs, as it can even be fatal for the four-legged friends.";
const fixedQuestion = "What is the advantage of birch sugar?";

const QuestionAnsweringTool = () => {
  const [inputText, setInputText] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [contextBefore, setContextBefore] = useState("");
  const [contextAfter, setContextAfter] = useState("");

  //functionHandler section
  const handleAnswer = async () => {
    try {
      const response = await axios.post(
        "https://api-inference.huggingface.co/models/deepset/roberta-base-squad2",
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
      console.error("Error fetching answer:", error);
    }
  };

  const handleLoadFixedTextAndQuestion = () => {
    setInputText(fixedText);
    setQuestion(fixedQuestion);
  };

  return (
    <div className="login-box">
      <h2 className="h1 h3">Question Answering Tool</h2>
      <div className="user-box">
        <textarea
          className="form-control custom-input"
          placeholder="Enter the input text..."
          rows="6"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
      </div>
      <div className="user-box">
        <input
          type="text"
          className=""
          placeholder="Enter your question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <button
          className="question btn custom-btn custom-btn-primary"
          onClick={handleAnswer}
        >
          Get Answer
        </button>
        <button
          className="question btn custom-btn custom-btn-primary "
          onClick={handleLoadFixedTextAndQuestion}
        >
          for example
        </button>
      </div>
      {answer && (
        <div className="use user-box">
          <h2>Answer:</h2>
          <p className="bg-lightgreen p-2 rounded">
            {contextBefore}
            <span className="bg-success text-white p-1 rounded">{answer}</span>
            {contextAfter}
          </p>
        </div>
      )}
    </div>
  );
};

export default QuestionAnsweringTool;
