"use client";

import { useState } from "react";
import { Upload, FileText, Loader2 } from "lucide-react";

interface InputSectionProps {
  onSubmit: (data: { text?: string; file?: { data: string; mimeType: string } }) => void;
  isLoading: boolean;
}

export function InputSection({ onSubmit, isLoading }: InputSectionProps) {
  const [activeTab, setActiveTab] = useState<"topic" | "file">("topic");
  const [topic, setTopic] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (activeTab === "topic" && topic.trim()) {
      onSubmit({ text: topic });
    } else if (activeTab === "file" && file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Data = (event.target?.result as string).split(",")[1];
        onSubmit({
          file: {
            data: base64Data,
            mimeType: file.type,
          },
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-sm border border-slate-200">
      <div className="flex space-x-4 mb-6 border-b border-slate-100 pb-2">
        <button
          className={`flex items-center space-x-2 pb-2 border-b-2 transition-colors ${
            activeTab === "topic"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
          onClick={() => setActiveTab("topic")}
        >
          <FileText className="w-4 h-4" />
          <span className="font-medium text-sm">Enter Topic</span>
        </button>
        <button
          className={`flex items-center space-x-2 pb-2 border-b-2 transition-colors ${
            activeTab === "file"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
          onClick={() => setActiveTab("file")}
        >
          <Upload className="w-4 h-4" />
          <span className="font-medium text-sm">Upload File</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {activeTab === "topic" ? (
          <div>
            <label htmlFor="topic" className="block text-sm font-medium text-slate-700 mb-1">
              What do you want to learn about?
            </label>
            <input
              type="text"
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Quantum Physics, French Revolution, React Hooks"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              disabled={isLoading}
            />
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Upload PDF or Image
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-xl hover:border-indigo-500 transition-colors bg-slate-50">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-slate-400" />
                <div className="flex text-sm text-slate-600 justify-center">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500 px-2 py-1"
                  >
                    <span>Upload a file</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      accept=".pdf,image/*"
                      onChange={handleFileChange}
                      disabled={isLoading}
                    />
                  </label>
                </div>
                <p className="text-xs text-slate-500">PDF, PNG, JPG up to 10MB</p>
                {file && (
                  <p className="text-sm font-medium text-emerald-600 mt-2">
                    Selected: {file.name}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || (activeTab === "topic" ? !topic.trim() : !file)}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
              Analyzing...
            </>
          ) : (
            "Generate Study Guide"
          )}
        </button>
      </form>
    </div>
  );
}
