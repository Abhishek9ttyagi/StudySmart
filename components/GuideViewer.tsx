"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface GuideViewerProps {
  content: string;
}

export function GuideViewer({ content }: GuideViewerProps) {
  return (
    <div className="w-full max-w-4xl mx-auto p-8 bg-white rounded-2xl shadow-sm border border-slate-200 prose prose-slate prose-indigo max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
