"use client";

import { useState } from "react";
import { QuizQuestion, QuizAttempt } from "@/types";
import { CheckCircle2, XCircle, ArrowRight, RotateCcw } from "lucide-react";

interface QuizInterfaceProps {
  questions: QuizQuestion[];
  topic: string;
  difficulty: string;
  documentId: string;
  onComplete: (attempt: QuizAttempt) => void;
  onRetake: () => void;
}

export function QuizInterface({ questions, topic, difficulty, documentId, onComplete, onRetake }: QuizInterfaceProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<QuizAttempt["questions"]>([]);
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = questions[currentIndex];

  const handleSelect = (option: string) => {
    if (isAnswered) return;
    setSelectedAnswer(option);
  };

  const handleSubmit = () => {
    if (!selectedAnswer.trim()) return;

    const isCorrect = 
      currentQuestion.type === "multiple-choice" 
        ? selectedAnswer === currentQuestion.correctAnswer
        : selectedAnswer.toLowerCase().trim() === currentQuestion.correctAnswer.toLowerCase().trim();
        
    if (isCorrect) setScore((s) => s + 1);

    setAnswers((prev) => [
      ...prev,
      {
        question: currentQuestion.question,
        selectedAnswer,
        correctAnswer: currentQuestion.correctAnswer,
        isCorrect,
      },
    ]);

    setIsAnswered(true);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer("");
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      onComplete({
        id: Date.now().toString(),
        userId: "", // Will be set by parent
        documentId,
        date: new Date().toISOString(),
        topic,
        difficulty,
        score: score + (
          currentQuestion.type === "multiple-choice" 
            ? (selectedAnswer === currentQuestion.correctAnswer ? 1 : 0)
            : (selectedAnswer.toLowerCase().trim() === currentQuestion.correctAnswer.toLowerCase().trim() ? 1 : 0)
        ),
        total: questions.length,
        questions: answers,
      });
    }
  };

  if (isFinished) {
    return (
      <div className="w-full max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-sm border border-slate-200 text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Quiz Complete!</h2>
        <div className="text-6xl font-black text-emerald-600 mb-6">
          {score} / {questions.length}
        </div>
        <p className="text-slate-600 mb-8">
          {score === questions.length
            ? "Perfect score! You mastered this topic."
            : "Great effort! Review the guide to brush up on the concepts you missed."}
        </p>
        <button
          onClick={onRetake}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          Configure New Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-sm border border-slate-200">
      <div className="flex justify-between items-center mb-8">
        <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">
          Question {currentIndex + 1} of {questions.length}
        </span>
        <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
          Score: {score}
        </span>
      </div>

      <h3 className="text-xl font-semibold text-slate-900 mb-6 leading-relaxed">
        {currentQuestion.question}
      </h3>

      <div className="space-y-3 mb-8">
        {currentQuestion.type === "multiple-choice" && currentQuestion.options ? (
          currentQuestion.options.map((option, idx) => {
            const isSelected = selectedAnswer === option;
            const isCorrect = option === currentQuestion.correctAnswer;
            
            let optionClass = "border-slate-200 hover:border-emerald-300 hover:bg-slate-50";
            if (isAnswered) {
              if (isCorrect) {
                optionClass = "border-emerald-500 bg-emerald-50 text-emerald-900";
              } else if (isSelected && !isCorrect) {
                optionClass = "border-rose-500 bg-rose-50 text-rose-900";
              } else {
                optionClass = "border-slate-200 opacity-50";
              }
            } else if (isSelected) {
              optionClass = "border-emerald-500 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-500";
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(option)}
                disabled={isAnswered}
                className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-200 flex justify-between items-center ${optionClass}`}
              >
                <span className="font-medium">{option}</span>
                {isAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />}
                {isAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />}
              </button>
            );
          })
        ) : (
          <div>
            <input
              type="text"
              value={selectedAnswer}
              onChange={(e) => setSelectedAnswer(e.target.value)}
              disabled={isAnswered}
              placeholder="Type your answer here..."
              className={`w-full px-5 py-4 rounded-xl border-2 transition-all duration-200 font-medium outline-none
                ${isAnswered 
                  ? (selectedAnswer.toLowerCase().trim() === currentQuestion.correctAnswer.toLowerCase().trim()
                    ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                    : "border-rose-500 bg-rose-50 text-rose-900")
                  : "border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                }`}
            />
            {isAnswered && selectedAnswer.toLowerCase().trim() !== currentQuestion.correctAnswer.toLowerCase().trim() && (
              <p className="mt-3 text-sm font-medium text-emerald-600">
                Correct answer: {currentQuestion.correctAnswer}
              </p>
            )}
          </div>
        )}
      </div>

      {isAnswered && (
        <div className="mb-8 p-5 bg-slate-50 rounded-xl border border-slate-100">
          <h4 className="font-semibold text-slate-900 mb-2">Explanation</h4>
          <p className="text-slate-700 leading-relaxed">{currentQuestion.explanation}</p>
        </div>
      )}

      <div className="flex justify-end">
        {!isAnswered ? (
          <button
            onClick={handleSubmit}
            disabled={!selectedAnswer.trim()}
            className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Submit Answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex items-center px-6 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors"
          >
            {currentIndex < questions.length - 1 ? "Next Question" : "Finish Quiz"}
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        )}
      </div>
    </div>
  );
}
