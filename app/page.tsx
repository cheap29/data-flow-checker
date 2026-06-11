"use client";

import { useState } from "react";
import type { AnalysisResult } from "@/lib/types";
import { RequirementInput } from "@/components/RequirementInput";
import { AnalysisResultView } from "@/components/AnalysisResultView";

export default function Home() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!text.trim()) {
      setError("業務要件を入力してください。");
      return;
    }
    setError(null);
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requirementText: text }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "分析中にエラーが発生しました。時間をおいて再度お試しください。");
        return;
      }

      setResult(data);
    } catch {
      setError("分析中にエラーが発生しました。時間をおいて再度お試しください。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-5">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">このデータ、どこ行くん？</h1>
          <p className="text-sm text-gray-600 mt-1">
            業務要件を「データの流れ」と「影響範囲」でレビューします。
          </p>
          <p className="text-xs text-gray-400 mt-1">
            登録・編集・削除されたデータが、その後どこで表示・集計・通知・履歴化され、誰に影響するのかを洗い出します。
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <div className="max-w-3xl bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <RequirementInput
            value={text}
            onChange={setText}
            onSubmit={handleSubmit}
            loading={loading}
            error={error}
          />
        </div>

        {loading && (
          <div className="text-center py-12 text-sm text-gray-500">
            <div className="inline-block w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-3" />
            <p>AIが分析中です。しばらくお待ちください...</p>
          </div>
        )}

        {result && <AnalysisResultView result={result} />}
      </main>
    </div>
  );
}
