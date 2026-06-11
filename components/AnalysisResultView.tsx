"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import type { AnalysisResult, DataFlow, Finding, Severity } from "@/lib/types";
import { MarkdownCopyButton } from "./MarkdownCopyButton";
import { DataFlowChartV2 } from "./DataFlowChartV2";

// --- Badges ---

const severityConfig: Record<Severity, { label: string; className: string }> = {
  high: { label: "高", className: "bg-red-100 text-red-700 border border-red-200" },
  medium: { label: "中", className: "bg-amber-100 text-amber-700 border border-amber-200" },
  low: { label: "低", className: "bg-green-100 text-green-700 border border-green-200" },
};

function SeverityBadge({ severity }: { severity: Severity }) {
  const { label, className } = severityConfig[severity];
  return (
    <span className={`inline-block text-xs font-semibold px-1.5 py-0.5 rounded ${className}`}>
      {label}
    </span>
  );
}

function DoneBadge() {
  return (
    <span className="inline-block text-xs font-semibold px-1.5 py-0.5 rounded bg-green-100 text-green-700 border border-green-200">
      対応済み
    </span>
  );
}

// --- Checkable row ---

function CheckableRow({
  id,
  checked,
  onToggle,
  badge,
  detail,
  children,
}: {
  id: string;
  checked: boolean;
  onToggle: () => void;
  badge?: ReactNode;
  detail?: string;
  children: ReactNode;
}) {
  return (
    <label
      htmlFor={id}
      className={`flex gap-3 cursor-pointer p-3 rounded-lg transition-colors ${
        checked ? "bg-gray-50" : "hover:bg-amber-50"
      }`}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        className="mt-0.5 w-4 h-4 accent-green-600 flex-shrink-0 cursor-pointer"
      />
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
          {badge}
          {checked ? <DoneBadge /> : null}
          <span className={`text-sm font-semibold ${checked ? "text-gray-400 line-through" : "text-gray-800"}`}>
            {children}
          </span>
        </div>
        {detail && (
          <p className={`text-sm leading-relaxed ${checked ? "text-gray-400" : "text-gray-600"}`}>
            {detail}
          </p>
        )}
      </div>
    </label>
  );
}

// --- Section wrappers ---

function ReviewCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-amber-200 shadow-sm overflow-hidden">
      <div className="px-5 py-3 bg-amber-50 border-b border-amber-100">
        <h3 className="text-sm font-bold text-amber-800">{title}</h3>
      </div>
      <div className="divide-y divide-gray-100 px-2 py-1">{children}</div>
    </div>
  );
}

function ConfirmedCard({ title, children, empty }: { title: string; children: ReactNode; empty?: boolean }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-5 py-3 bg-blue-50 border-b border-blue-100">
        <h3 className="text-sm font-bold text-blue-800">{title}</h3>
      </div>
      <div className="px-5 py-4">
        {empty ? <p className="text-sm text-gray-400">該当なし</p> : children}
      </div>
    </div>
  );
}

// --- Data flow chart (right panel) ---

function DataFlowChart({ dataFlows }: { dataFlows: DataFlow[] }) {
  if (dataFlows.length === 0) {
    return <p className="text-sm text-gray-400">該当なし</p>;
  }
  return (
    <div className="space-y-5">
      {dataFlows.map((flow, fi) => (
        <div key={fi} className="bg-white rounded-xl border border-blue-200 shadow-sm overflow-hidden">
          <div className="px-4 py-3 bg-blue-50 border-b border-blue-100">
            <h3 className="text-xs font-bold text-blue-800">{flow.title}</h3>
          </div>
          <div className="p-4">
            <ol className="relative space-y-0">
              {flow.steps.map((step, si) => {
                const isLast = si === flow.steps.length - 1;
                return (
                  <li key={si} className="flex gap-3">
                    {/* Step number + connecting line */}
                    <div className="flex flex-col items-center">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-bold flex items-center justify-center z-10">
                        {si + 1}
                      </span>
                      {!isLast && (
                        <div className="w-0.5 flex-1 bg-blue-200 my-1 min-h-[20px]" />
                      )}
                    </div>
                    {/* Step text */}
                    <p className={`text-xs text-gray-700 leading-relaxed ${isLast ? "" : "pb-3"}`}>
                      {step}
                    </p>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      ))}
    </div>
  );
}

// --- Progress bar ---

function ProgressBar({ done, total, color }: { done: number; total: number; color: "green" | "blue" }) {
  if (total === 0) return null;
  const pct = (done / total) * 100;
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500 tabular-nums">{done} / {total}</span>
      <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${color === "green" ? "bg-green-500" : "bg-blue-500"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// --- Main component ---

type CheckMap = Record<string, boolean>;

export function AnalysisResultView({ result }: { result: AnalysisResult }) {
  const [checked, setChecked] = useState<CheckMap>({});
  const [chartV2, setChartV2] = useState(true);

  const toggle = (key: string) =>
    setChecked(prev => ({ ...prev, [key]: !prev[key] }));

  const reviewKeys = [
    ...result.questionsForClient.map((_, i) => `q-${i}`),
    ...result.missingRequirements.map((_, i) => `miss-${i}`),
    ...result.contradictions.map((_, i) => `contra-${i}`),
    ...result.risks.map((_, i) => `risk-${i}`),
  ];
  const testKeys = [
    ...result.testCases.normal.map((_, i) => `test-normal-${i}`),
    ...result.testCases.abnormal.map((_, i) => `test-abnormal-${i}`),
    ...result.testCases.boundary.map((_, i) => `test-boundary-${i}`),
  ];
  const reviewDone = reviewKeys.filter(k => checked[k]).length;
  const testDone = testKeys.filter(k => checked[k]).length;

  const renderFindings = (items: Finding[], prefix: string) =>
    items.map((f, i) => (
      <CheckableRow
        key={i}
        id={`${prefix}-${i}`}
        checked={!!checked[`${prefix}-${i}`]}
        onToggle={() => toggle(`${prefix}-${i}`)}
        badge={<SeverityBadge severity={f.severity} />}
        detail={f.detail}
      >
        {f.title}
      </CheckableRow>
    ));

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800">分析結果</h2>
        <MarkdownCopyButton result={result} />
      </div>

      {/* 2-column grid: left = checklist / right = data flow chart */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 items-start">

        {/* ===== LEFT COLUMN ===== */}
        <div className="space-y-6 min-w-0">

          {/* Summary */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">概要</p>
            <p className="text-sm text-gray-700 leading-relaxed">{result.summary}</p>
          </div>

          {/* ── 確認が必要なこと ── */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                確認が必要なこと
              </span>
              <ProgressBar done={reviewDone} total={reviewKeys.length} color="green" />
            </div>

            {result.questionsForClient.length > 0 && (
              <ReviewCard title="現場に確認したい質問">
                {result.questionsForClient.map((q, i) => (
                  <CheckableRow
                    key={i}
                    id={`q-${i}`}
                    checked={!!checked[`q-${i}`]}
                    onToggle={() => toggle(`q-${i}`)}
                    badge={<span className="text-xs font-bold text-blue-500">Q{i + 1}.</span>}
                  >
                    {q}
                  </CheckableRow>
                ))}
              </ReviewCard>
            )}

            {result.missingRequirements.length > 0 && (
              <ReviewCard title="抜けていそうな仕様">
                {renderFindings(result.missingRequirements, "miss")}
              </ReviewCard>
            )}

            {result.contradictions.length > 0 && (
              <ReviewCard title="矛盾していそうな仕様">
                {renderFindings(result.contradictions, "contra")}
              </ReviewCard>
            )}

            {result.risks.length > 0 && (
              <ReviewCard title="リスク">
                {renderFindings(result.risks, "risk")}
              </ReviewCard>
            )}
          </section>

          {/* ── 確定していること ── */}
          <section className="space-y-3">
            <div>
              <span className="text-sm font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
                確定していること
              </span>
            </div>

            <ConfirmedCard title="抽出された主要データ" empty={result.dataObjects.length === 0}>
              <ul className="space-y-2">
                {result.dataObjects.map((d, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-blue-400" />
                    <div>
                      <span className="text-sm font-semibold text-gray-800">{d.name}</span>
                      <p className="text-sm text-gray-500">{d.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </ConfirmedCard>

            <ConfirmedCard title="影響を受ける画面・機能" empty={result.affectedScreensAndFeatures.length === 0}>
              <ul className="space-y-2">
                {result.affectedScreensAndFeatures.map((a, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-blue-400" />
                    <div>
                      <span className="text-sm font-semibold text-gray-800">{a.name}</span>
                      <p className="text-sm text-gray-500">{a.impact}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </ConfirmedCard>

            <ConfirmedCard title="利用者別の困りごと" empty={result.userPainPoints.length === 0}>
              <div className="space-y-4">
                {result.userPainPoints.map((u, i) => (
                  <div key={i}>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5">{u.actor}</h4>
                    <ul className="space-y-1">
                      {u.points.map((p, j) => (
                        <li key={j} className="flex gap-2 text-sm text-gray-600">
                          <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-gray-300" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </ConfirmedCard>
          </section>

          {/* ── テスト観点 ── */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-gray-600 bg-gray-100 border border-gray-200 px-3 py-1 rounded-full">
                テスト観点
              </span>
              <ProgressBar done={testDone} total={testKeys.length} color="blue" />
            </div>

            {[
              { label: "正常系", items: result.testCases.normal, prefix: "test-normal" },
              { label: "異常系", items: result.testCases.abnormal, prefix: "test-abnormal" },
              { label: "境界値", items: result.testCases.boundary, prefix: "test-boundary" },
            ].map(({ label, items, prefix }) =>
              items.length > 0 ? (
                <div key={label} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
                    <h3 className="text-sm font-bold text-gray-700">{label}</h3>
                  </div>
                  <div className="divide-y divide-gray-100 px-2 py-1">
                    {items.map((t, i) => (
                      <CheckableRow
                        key={i}
                        id={`${prefix}-${i}`}
                        checked={!!checked[`${prefix}-${i}`]}
                        onToggle={() => toggle(`${prefix}-${i}`)}
                      >
                        {t}
                      </CheckableRow>
                    ))}
                  </div>
                </div>
              ) : null
            )}
          </section>
        </div>

        {/* ===== RIGHT COLUMN: data flow chart (sticky) ===== */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
              データの流れ
            </span>
            <button
              onClick={() => setChartV2(v => !v)}
              className="text-xs text-gray-500 hover:text-gray-700 underline underline-offset-2"
            >
              {chartV2 ? "シンプル表示" : "詳細表示"}
            </button>
          </div>
          {chartV2
            ? <DataFlowChartV2 dataFlows={result.dataFlows} />
            : <DataFlowChart dataFlows={result.dataFlows} />
          }
        </div>

      </div>
    </div>
  );
}
