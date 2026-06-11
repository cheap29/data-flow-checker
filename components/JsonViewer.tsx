"use client";

import { useState } from "react";
import type { AnalysisResult } from "@/lib/types";

export function JsonViewer({ result }: { result: AnalysisResult }) {
  const [open, setOpen] = useState(false);

  return (
    <section className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-sm font-bold text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
      >
        <span>JSON表示</span>
        <span className="text-gray-400">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div className="px-5 pb-5">
          <pre className="text-xs bg-gray-50 border border-gray-200 rounded-lg p-4 overflow-auto max-h-96 text-gray-700">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </section>
  );
}
