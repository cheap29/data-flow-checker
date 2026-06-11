"use client";

import { useState } from "react";
import type { AnalysisResult } from "@/lib/types";
import { toMarkdown } from "@/lib/markdown";

export function MarkdownCopyButton({ result }: { result: AnalysisResult }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const md = toMarkdown(result);
    await navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
    >
      {copied ? "コピーしました！" : "Markdownコピー"}
    </button>
  );
}
