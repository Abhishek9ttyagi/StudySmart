"use client";

import { useState } from "react";
import { Loader2, Settings2 } from "lucide-react";

interface QuizConfigProps {
  topics: string[];
  onGenerate: (config: {
    selectedTopics: string[];
    difficulty: string;
    count: number;
    questionType: "multiple-choice" | "fill-in-the-blank" | "mixed";
  }) => void;
  isLoading: boolean;
}

export function QuizConfig({ topics, onGenerate, isLoading }: QuizConfigProps) {
  const [selectedTopics, setSelectedTopics] = useState<string[]>(topics);
  const [difficulty, setDifficulty] = useState("medium");
  const [count, setCount] = useState(5);
  const [questionType, setQuestionType] = useState<"multiple-choice" | "fill-in-the-blank" | "mixed">("mixed");

  const handleTopicToggle = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTopics.length === 0) return;
    onGenerate({ selectedTopics, difficulty, count, questionType });
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-sm border border-slate-200">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-emerald-100 p-2 rounded-xl text-emerald-600">
          <Settings2 className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Configure Quiz</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-3">
            Select Topics to Cover
          </label>
          <div className="flex flex-wrap gap-2">
            {topics.map((topic) => (
              <button
                key={topic}
                type="button"
                onClick={() => handleTopicToggle(topic)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                  selectedTopics.includes(topic)
                    ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                {topic}
              </button>
            ))}
          </div>
          {selectedTopics.length === 0 && (
            <p className="text-rose-500 text-sm mt-2">Please select at least one topic.</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Difficulty Level
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-white"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Number of Questions
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value) || 5)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Question Type
          </label>
          <select
            value={questionType}
            onChange={(e) => setQuestionType(e.target.value as any)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-white"
          >
            <option value="mixed">Mixed (Multiple Choice & Fill-in-the-blank)</option>
            <option value="multiple-choice">Multiple Choice Only</option>
            <option value="fill-in-the-blank">Fill-in-the-blank Only</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isLoading || selectedTopics.length === 0}
          className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
              Generating Quiz...
            </>
          ) : (
            "Start Quiz"
          )}
        </button>
      </form>
    </div>
  );
}
