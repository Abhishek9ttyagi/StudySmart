"use client";

import { QuizAttempt, Document } from "@/types";
import { CheckCircle2, XCircle, Calendar, Trophy, BookOpen, ChevronRight } from "lucide-react";
import { useState } from "react";

interface HistoryViewerProps {
  history: QuizAttempt[];
  documents: Document[];
  onSelectDocument: (doc: Document) => void;
}

export function HistoryViewer({ history, documents, onSelectDocument }: HistoryViewerProps) {
  const [activeTab, setActiveTab] = useState<"quizzes" | "documents">("quizzes");

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Your Learning Journey</h2>
        <div className="flex bg-slate-100 p-1 rounded-xl self-start md:self-auto">
          <button
            onClick={() => setActiveTab("quizzes")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "quizzes" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Quiz History
          </button>
          <button
            onClick={() => setActiveTab("documents")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "documents" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Saved Documents
          </button>
        </div>
      </div>

      {activeTab === "quizzes" && (
        history.length === 0 ? (
          <div className="p-12 bg-white rounded-2xl shadow-sm border border-slate-200 text-center">
            <Trophy className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">No Quiz History Yet</h2>
            <p className="text-slate-500">
              Complete a practice quiz to see your performance history here.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {history.slice().reverse().map((attempt) => (
              <div key={attempt.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 p-6 border-b border-slate-100 flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-1">{attempt.topic}</h3>
                    <div className="flex items-center text-sm text-slate-500 space-x-4">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1.5" />
                        {new Date(attempt.date).toLocaleDateString()}
                      </span>
                      <span className="capitalize px-2 py-0.5 bg-slate-200 rounded-md text-xs font-semibold">
                        {attempt.difficulty}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black text-emerald-600">
                      {Math.round((attempt.score / attempt.total) * 100)}%
                    </div>
                    <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                      {attempt.score} of {attempt.total} Correct
                    </div>
                  </div>
                </div>
                
                <div className="p-6 space-y-6">
                  {attempt.questions.map((q, idx) => (
                    <div key={idx} className="border-b border-slate-100 last:border-0 pb-6 last:pb-0">
                      <div className="flex items-start space-x-3 mb-3">
                        {q.isCorrect ? (
                          <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="w-6 h-6 text-rose-500 flex-shrink-0 mt-0.5" />
                        )}
                        <p className="font-medium text-slate-900 leading-relaxed">{q.question}</p>
                      </div>
                      
                      <div className="pl-9 space-y-2 text-sm">
                        <div className="flex items-start">
                          <span className="font-semibold text-slate-500 w-24 flex-shrink-0">Your Answer:</span>
                          <span className={q.isCorrect ? "text-emerald-700 font-medium" : "text-rose-700 font-medium"}>
                            {q.selectedAnswer || "(Blank)"}
                          </span>
                        </div>
                        {!q.isCorrect && (
                          <div className="flex items-start">
                            <span className="font-semibold text-slate-500 w-24 flex-shrink-0">Correct:</span>
                            <span className="text-slate-900 font-medium">{q.correctAnswer}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {activeTab === "documents" && (
        documents.length === 0 ? (
          <div className="p-12 bg-white rounded-2xl shadow-sm border border-slate-200 text-center">
            <BookOpen className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">No Saved Documents</h2>
            <p className="text-slate-500">
              Upload a document or enter a topic to save it to your account.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.slice().reverse().map((doc) => (
              <button
                key={doc.id}
                onClick={() => onSelectDocument(doc)}
                className="flex flex-col text-left p-6 bg-white rounded-2xl shadow-sm border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between w-full mb-4">
                  <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2">{doc.title}</h3>
                <div className="flex items-center text-xs text-slate-500 mt-auto">
                  <Calendar className="w-3.5 h-3.5 mr-1" />
                  {new Date(doc.date).toLocaleDateString()}
                </div>
              </button>
            ))}
          </div>
        )
      )}
    </div>
  );
}
