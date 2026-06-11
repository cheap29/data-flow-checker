"use client";

import { useState } from "react";
import type { AnalysisResult, HearingResult } from "@/lib/types";
import { RequirementInput } from "@/components/RequirementInput";
import { HearingInput } from "@/components/HearingInput";
import { AnalysisResultView } from "@/components/AnalysisResultView";
import { HearingResultView } from "@/components/HearingResultView";

type TabType = "requirement" | "hearing";
type InputMode = "structured" | "memo";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>("hearing");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 業務要件タブ
  const [reqText, setReqText] = useState("");
  const [reqResult, setReqResult] = useState<AnalysisResult | null>(null);

  // ヒアリングタブ
  const [asIs, setAsIs] = useState("");
  const [toBe, setToBe] = useState("");
  const [memo, setMemo] = useState("");
  const [hearingResult, setHearingResult] = useState<HearingResult | null>(null);

  const handleRequirementSubmit = async () => {
    if (!reqText.trim()) {
      setError("業務要件を入力してください。");
      return;
    }
    setError(null);
    setLoading(true);
    setReqResult(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requirementText: reqText }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "分析中にエラーが発生しました。時間をおいて再度お試しください。");
        return;
      }
      setReqResult(data);
    } catch {
      setError("分析中にエラーが発生しました。時間をおいて再度お試しください。");
    } finally {
      setLoading(false);
    }
  };

  const handleHearingSubmit = async (mode: InputMode) => {
    if (mode === "memo") {
      if (!memo.trim()) {
        setError("ヒアリングメモを入力してください。");
        return;
      }
    } else {
      if (!asIs.trim() || !toBe.trim()) {
        setError("現状となりたい姿をどちらも入力してください。");
        return;
      }
    }
    setError(null);
    setLoading(true);
    setHearingResult(null);
    try {
      const body = mode === "memo"
        ? { memo }
        : { asIs, toBe };
      const res = await fetch("/api/hearing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "分析中にエラーが発生しました。時間をおいて再度お試しください。");
        return;
      }
      setHearingResult(data);
    } catch {
      setError("分析中にエラーが発生しました。時間をおいて再度お試しください。");
    } finally {
      setLoading(false);
    }
  };

  const tabCls = (tab: TabType) =>
    activeTab === tab
      ? "px-4 pb-3 pt-0 text-sm font-semibold text-blue-600 border-b-2 border-blue-600"
      : "px-4 pb-3 pt-0 text-sm font-medium text-gray-400 border-b-2 border-transparent hover:text-gray-600 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed";

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-5">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">要件設計サポートアプリ</h1>
          <p className="text-sm text-gray-600 mt-1">
            業務要件を「データの流れ」と「影響範囲」でレビューします。
          </p>
          <p className="text-xs text-gray-400 mt-1">
            登録・編集・削除されたデータが、その後どこで表示・集計・通知・履歴化され、誰に影響するのかを洗い出します。
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* 入力カード（タブ内包） */}
        <div className="max-w-3xl bg-white rounded-xl border border-gray-200 shadow-sm">
          {/* タブバー */}
          <div className="flex border-b border-gray-200 px-5 pt-4">
            <button
              type="button"
              className={tabCls("hearing")}
              onClick={() => { setActiveTab("hearing"); setError(null); }}
              disabled={loading}
            >
              ヒアリング整理
            </button>
            <button
              type="button"
              className={tabCls("requirement")}
              onClick={() => { setActiveTab("requirement"); setError(null); }}
              disabled={loading}
            >
              業務要件レビュー
            </button>
          </div>

          {/* フォームコンテンツ */}
          <div className="p-5">
            {activeTab === "requirement" ? (
              <RequirementInput
                value={reqText}
                onChange={setReqText}
                onSubmit={handleRequirementSubmit}
                loading={loading}
                error={error}
              />
            ) : (
              <HearingInput
                asIs={asIs}
                toBe={toBe}
                memo={memo}
                onAsIsChange={setAsIs}
                onToBeChange={setToBe}
                onMemoChange={setMemo}
                onSubmit={handleHearingSubmit}
                loading={loading}
                error={error}
              />
            )}
          </div>
        </div>

        {loading && (
          <div className="text-center py-12 text-sm text-gray-500">
            <div className="inline-block w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-3" />
            <p>AIが分析中です。しばらくお待ちください...</p>
          </div>
        )}

        {activeTab === "requirement" && reqResult && (
          <AnalysisResultView result={reqResult} />
        )}
        {activeTab === "hearing" && hearingResult && (
          <HearingResultView
            result={hearingResult}
            asIs={asIs}
            toBe={toBe}
            memo={memo}
            onTransfer={(text) => {
              if (text) setReqText(text);
              setActiveTab("requirement");
              setError(null);
            }}
          />
        )}
      </main>
    </div>
  );
}
