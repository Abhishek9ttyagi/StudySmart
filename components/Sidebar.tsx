"use client";

import { useAuth } from "@/context/AuthContext";
import { BookOpen, History, MessageSquare, PlusCircle, BrainCircuit, LogOut, User as UserIcon, X } from "lucide-react";

interface SidebarProps {
  activeTab: "guide" | "quiz" | "chat" | "history";
  setActiveTab: (tab: "guide" | "quiz" | "chat" | "history") => void;
  onNewTopic: () => void;
  hasTopic: boolean;
  onOpenAuth: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ activeTab, setActiveTab, onNewTopic, hasTopic, onOpenAuth, isOpen, onClose }: SidebarProps) {
  const { user, logout } = useAuth();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <div className={`w-64 bg-slate-900 text-slate-300 h-screen flex flex-col fixed left-0 top-0 border-r border-slate-800 z-50 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6 flex items-center justify-between text-white border-b border-slate-800">
          <div className="flex items-center space-x-3">
        <div className="bg-indigo-500 p-2 rounded-xl">
          <BrainCircuit className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight">StudyBuddy</span>
         </div>
          <button onClick={onClose} className="md:hidden text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
      </div>

      <div className="p-4">
        <button
          onClick={() => { onNewTopic(); onClose(); }}
          className="w-full flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-3 rounded-xl font-medium transition-colors shadow-sm"
        >
          <PlusCircle className="w-5 h-5" />
          <span>New Topic</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <div className="px-4 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Current Session
        </div>
        <nav className="space-y-1 px-2">
          <button
            onClick={() => { setActiveTab("guide"); onClose(); }}
            disabled={!hasTopic}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
              activeTab === "guide"
                ? "bg-slate-800 text-white font-medium"
                : "hover:bg-slate-800/50 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span>Study Guide</span>
          </button>
          
          <button
            onClick={() => { setActiveTab("quiz"); onClose(); }}
            disabled={!hasTopic}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
              activeTab === "quiz"
                ? "bg-slate-800 text-white font-medium"
                : "hover:bg-slate-800/50 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            }`}
          >
            <BrainCircuit className="w-5 h-5" />
            <span>Practice Quiz</span>
          </button>

          <button
            onClick={() => { setActiveTab("chat"); onClose(); }}
            disabled={!hasTopic}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
              activeTab === "chat"
                ? "bg-slate-800 text-white font-medium"
                : "hover:bg-slate-800/50 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span>AI Tutor</span>
          </button>
        </nav>

        <div className="px-4 mt-8 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Account
        </div>
        <nav className="space-y-1 px-2">
          <button
            onClick={() => {
              if (user) setActiveTab("history");
              else onOpenAuth();
              onClose();
            }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
              activeTab === "history"
                ? "bg-slate-800 text-white font-medium"
                : "hover:bg-slate-800/50 hover:text-white"
            }`}
          >
            <History className="w-5 h-5" />
            <span>Learning History</span>
          </button>
        </nav>
      </div>

      <div className="p-4 border-t border-slate-800">
        {user ? (
          <div className="flex items-center justify-between px-2 py-2">
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="bg-slate-800 p-2 rounded-full flex-shrink-0">
                <UserIcon className="w-5 h-5 text-slate-400" />
              </div>
              <div className="truncate">
                <p className="text-sm font-medium text-white truncate">{user.name}</p>
                <p className="text-xs text-slate-500 truncate">{user.email}</p>
              </div>
            </div>
            <button
              onClick={() => { logout(); onClose(); }}
              className="p-2 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
              title="Log out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => { onOpenAuth(); onClose(); }}
            className="w-full flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-3 rounded-xl font-medium transition-colors"
          >
            <UserIcon className="w-5 h-5" />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </div>
    </>
  );
}
