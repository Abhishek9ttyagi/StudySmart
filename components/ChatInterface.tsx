"use client";

import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "@/types";
import { Send, Loader2, Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

export function ChatInterface({ messages, onSendMessage, isLoading }: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput("");
    }
  };

  return (
    <div className="flex flex-col h-[600px] w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
            <Bot className="w-12 h-12 text-slate-300" />
            <p className="text-center max-w-sm">
              Ask me anything about the study guide, or request more quiz questions!
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${
                msg.role === "user" ? "flex-row-reverse space-x-reverse" : ""
              }`}
            >
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  msg.role === "user" ? "bg-indigo-100 text-indigo-600" : "bg-blue-100 text-blue-600"
                }`}
              >
                {msg.role === "user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>
              <div
                className={`max-w-[80%] rounded-2xl px-5 py-3 shadow-sm ${
                  msg.role === "user"
                    ? "bg-indigo-600 text-white rounded-tr-none"
                    : "bg-white border border-slate-100 text-slate-800 rounded-tl-none prose prose-sm prose-slate max-w-none"
                }`}
              >
                {msg.role === "model" ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                ) : (
                  msg.text
                )}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none px-5 py-3 shadow-sm flex items-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
              <span className="text-sm text-slate-500">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-slate-100">
        <form onSubmit={handleSubmit} className="flex space-x-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-slate-50"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-5 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
