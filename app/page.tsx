"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { InputSection } from "@/components/InputSection";
import { GuideViewer } from "@/components/GuideViewer";
import { QuizConfig } from "@/components/QuizConfig";
import { QuizInterface } from "@/components/QuizInterface";
import { ChatInterface } from "@/components/ChatInterface";
import { HistoryViewer } from "@/components/HistoryViewer";
import { AuthModal } from "@/components/AuthModal";
import { generateGuide, generateQuiz, createChatSession } from "@/lib/gemini";
import { QuizQuestion, QuizAttempt, ChatMessage, Document } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { BookOpen, BrainCircuit, MessageSquare, History, Settings2, Menu } from "lucide-react";


export default function Home() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"guide" | "quiz" | "chat" | "history">("guide");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [topic, setTopic] = useState<string>("");
  const [guideContent, setGuideContent] = useState<string | null>(null);
  const [extractedTopics, setExtractedTopics] = useState<string[]>([]);
  const [currentDocumentId, setCurrentDocumentId] = useState<string>("");
  
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[] | null>(null);
  const [quizDifficulty, setQuizDifficulty] = useState<string>("medium");
  
  const [quizHistory, setQuizHistory] = useState<QuizAttempt[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatSession, setChatSession] = useState<any>(null);

  useEffect(() => {
    if (user) {
      const savedHistory = localStorage.getItem(`studybuddy_history_${user.id}`);
      const savedDocs = localStorage.getItem(`studybuddy_docs_${user.id}`);
      if (savedHistory) {
        try { setQuizHistory(JSON.parse(savedHistory)); } catch (e) { console.error(e); }
      } else {
        setQuizHistory([]);
      }
      if (savedDocs) {
        try { setDocuments(JSON.parse(savedDocs)); } catch (e) { console.error(e); }
      } else {
        setDocuments([]);
      }
    } else {
      setQuizHistory([]);
      setDocuments([]);
    }
  }, [user]);

  const saveHistory = (newHistory: QuizAttempt[]) => {
    setQuizHistory(newHistory);
    if (user) {
      localStorage.setItem(`studybuddy_history_${user.id}`, JSON.stringify(newHistory));
    }
  };

  const saveDocument = (newDoc: Document) => {
    const newDocs = [...documents, newDoc];
    setDocuments(newDocs);
    if (user) {
      localStorage.setItem(`studybuddy_docs_${user.id}`, JSON.stringify(newDocs));
    }
  };

  const handleNewTopic = () => {
    setTopic("");
    setGuideContent(null);
    setExtractedTopics([]);
    setQuizQuestions(null);
    setChatMessages([]);
    setChatSession(null);
    setCurrentDocumentId("");
    setActiveTab("guide");
  };

  const handleSubmitInput = async (data: { text?: string; file?: { data: string; mimeType: string } }) => {
    setIsLoading(true);
    try {
      const currentTopic = data.text || "Uploaded Document";
      setTopic(currentTopic);
      
      const { guideContent: guide, topics } = await generateGuide(data);
      setGuideContent(guide);
      setExtractedTopics(topics);
      
      const docId = Date.now().toString();
      setCurrentDocumentId(docId);
      
      if (user) {
        saveDocument({
          id: docId,
          userId: user.id,
          title: currentTopic,
          date: new Date().toISOString(),
          guideContent: guide,
          topics,
        });
      }
      
      const session = createChatSession(guide);
      setChatSession(session);
      
      setActiveTab("guide");
    } catch (error) {
      console.error("Error generating content:", error);
      alert("Failed to generate content. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectDocument = (doc: Document) => {
    setTopic(doc.title);
    setGuideContent(doc.guideContent);
    setExtractedTopics(doc.topics);
    setCurrentDocumentId(doc.id);
    setQuizQuestions(null);
    setChatMessages([]);
    const session = createChatSession(doc.guideContent);
    setChatSession(session);
    setActiveTab("guide");
  };

  const handleGenerateQuiz = async (config: {
    selectedTopics: string[];
    difficulty: string;
    count: number;
    questionType: "multiple-choice" | "fill-in-the-blank" | "mixed";
  }) => {
    setIsLoading(true);
    try {
      const questions = await generateQuiz(
        guideContent!,
        config.selectedTopics,
        config.difficulty,
        config.count,
        config.questionType
      );
      setQuizQuestions(questions);
      setQuizDifficulty(config.difficulty);
    } catch (error) {
      console.error("Error generating quiz:", error);
      alert("Failed to generate quiz. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuizComplete = (attempt: QuizAttempt) => {
    if (user) {
      const attemptWithUser = { ...attempt, userId: user.id };
      saveHistory([...quizHistory, attemptWithUser]);
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!chatSession) return;
    
    const newUserMsg: ChatMessage = { id: Date.now().toString(), role: "user", text };
    setChatMessages((prev) => [...prev, newUserMsg]);
    setIsLoading(true);
    
    try {
      let streamResponse = await chatSession.sendMessageStream({ message: text });
      let fullText = "";
      
      const modelMsgId = (Date.now() + 1).toString();
      setChatMessages((prev) => [...prev, { id: modelMsgId, role: "model", text: "" }]);
      
      for await (const chunk of streamResponse) {
        fullText += chunk.text;
        setChatMessages((prev) => 
          prev.map(msg => msg.id === modelMsgId ? { ...msg, text: fullText } : msg)
        );
      }
    } catch (error) {
      console.error("Chat error:", error);
      const errorMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: "model", text: "Sorry, I encountered an error processing your request." };
      setChatMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
       {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-30 flex items-center px-4 justify-between">
        <div className="flex items-center space-x-2 text-indigo-600">
          <BrainCircuit className="w-6 h-6" />
          <span className="text-lg font-bold text-slate-900 tracking-tight">StudyBuddy</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onNewTopic={handleNewTopic}
        hasTopic={!!guideContent}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {!guideContent && activeTab !== "history" ? (
            <div className="flex flex-col items-center justify-center min-h-[80vh]">
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
                  Master Any Topic
                </h1>
                <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto px-4">
                  Upload a document, image, or enter a topic to instantly generate a comprehensive study guide, practice quizzes, and an AI tutor.
                </p>
              </div>
              <InputSection onSubmit={handleSubmitInput} isLoading={isLoading} />
            </div>
          ) : (
            <>
              {activeTab === "guide" && guideContent && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center space-x-3 mb-8">
                    <div className="bg-indigo-100 p-3 rounded-2xl text-indigo-600">
                      <BookOpen className="w-8 h-8" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-slate-900">{topic}</h2>
                      <p className="text-slate-500 font-medium">Comprehensive Study Guide</p>
                    </div>
                  </div>
                  <GuideViewer content={guideContent} />
                </div>
              )}
              
              {activeTab === "quiz" && guideContent && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center space-x-3 mb-8">
                    <div className="bg-emerald-100 p-3 rounded-2xl text-emerald-600">
                      <BrainCircuit className="w-8 h-8" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-slate-900">{topic}</h2>
                      <p className="text-slate-500 font-medium">Practice Quiz</p>
                    </div>
                  </div>
                  
                  {!quizQuestions ? (
                    <QuizConfig
                      topics={extractedTopics}
                      onGenerate={handleGenerateQuiz}
                      isLoading={isLoading}
                    />
                  ) : (
                    <QuizInterface
                      questions={quizQuestions}
                      topic={topic}
                      difficulty={quizDifficulty}
                      documentId={currentDocumentId}
                      onComplete={handleQuizComplete}
                      onRetake={() => setQuizQuestions(null)}
                    />
                  )}
                </div>
              )}
              
              {activeTab === "chat" && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center space-x-3 mb-8">
                    <div className="bg-blue-100 p-3 rounded-2xl text-blue-600">
                      <MessageSquare className="w-8 h-8" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-slate-900">{topic}</h2>
                      <p className="text-slate-500 font-medium">AI Tutor</p>
                    </div>
                  </div>
                  <ChatInterface
                    messages={chatMessages}
                    onSendMessage={handleSendMessage}
                    isLoading={isLoading}
                  />
                </div>
              )}
              
              {activeTab === "history" && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <HistoryViewer 
                    history={quizHistory} 
                    documents={documents}
                    onSelectDocument={handleSelectDocument}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}
