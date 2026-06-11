"use client";

import { useState } from "react";
import { ArrowRight, TrendingUp } from "lucide-react";
import type { ConfirmStatus, HearingResult, ProposalStatus } from "@/lib/types";

// --- ConfirmStatus config ---

const CONFIRM_CONFIG: Record<ConfirmStatus, { label: string; badgeCls: string; bgCls: string; textCls: string }> = {
  unchecked:    { label: "",                      badgeCls: "",                                              bgCls: "",            textCls: "text-gray-700" },
  confirmed:    { label: "確認済",                 badgeCls: "bg-green-100 text-green-700 border-green-200", bgCls: "bg-green-50",  textCls: "text-gray-500" },
  pending:      { label: "クライアントに確認中",    badgeCls: "bg-amber-100 text-amber-700 border-amber-200", bgCls: "bg-amber-50",  textCls: "text-gray-700" },
  out_of_scope: { label: "スコープ外",             badgeCls: "bg-gray-100 text-gray-500 border-gray-200",   bgCls: "bg-gray-50",   textCls: "text-gray-400 line-through" },
};

// --- ProposalStatus config ---

const PROPOSAL_CONFIG: Record<ProposalStatus, { label: string; badgeCls: string; bgCls: string; textCls: string }> = {
  proposed: { label: "提案中",  badgeCls: "",                                              bgCls: "",            textCls: "text-gray-700" },
  adopted:  { label: "採用",    badgeCls: "bg-green-100 text-green-700 border-green-200", bgCls: "bg-green-50",  textCls: "text-gray-800 font-medium" },
  declined: { label: "見送り",  badgeCls: "bg-gray-100 text-gray-400 border-gray-200",   bgCls: "bg-gray-50",   textCls: "text-gray-400 line-through" },
};

// --- ConfirmStatusRow ---

function ConfirmStatusRow({ id, status, onStatusChange, index, children }: {
  id: string;
  status: ConfirmStatus;
  onStatusChange: (s: ConfirmStatus) => void;
  index: number;
  children: string;
}) {
  const cfg = CONFIRM_CONFIG[status];
  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${cfg.bgCls || "hover:bg-amber-50"}`}>
      <span className="text-xs font-bold text-blue-500 flex-shrink-0 mt-1">Q{index + 1}.</span>
      <p className={`flex-1 text-sm leading-relaxed ${cfg.textCls}`}>{children}</p>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {status !== "unchecked" && (
          <span className={`inline-block text-xs font-semibold px-1.5 py-0.5 rounded border ${cfg.badgeCls}`}>
            {cfg.label}
          </span>
        )}
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value as ConfirmStatus)}
          className="text-xs border border-gray-200 rounded px-2 py-1 text-gray-600 bg-white focus:outline-none focus:ring-1 focus:ring-blue-400 cursor-pointer"
        >
          <option value="unchecked">未対応</option>
          <option value="pending">確認中</option>
          <option value="confirmed">確認済</option>
          <option value="out_of_scope">スコープ外</option>
        </select>
      </div>
    </div>
  );
}

// --- ProposalStatusRow ---

function ProposalStatusRow({ id, status, onStatusChange, index, children }: {
  id: string;
  status: ProposalStatus;
  onStatusChange: (s: ProposalStatus) => void;
  index: number;
  children: string;
}) {
  const cfg = PROPOSAL_CONFIG[status];
  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${cfg.bgCls || "hover:bg-blue-50"}`}>
      <span className={`w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5 ${
        status === "adopted" ? "bg-green-500 text-white" : "bg-blue-100 text-blue-600"
      }`}>
        {index + 1}
      </span>
      <p className={`flex-1 text-sm leading-relaxed ${cfg.textCls}`}>{children}</p>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {status !== "proposed" && (
          <span className={`inline-block text-xs font-semibold px-1.5 py-0.5 rounded border ${cfg.badgeCls}`}>
            {cfg.label}
          </span>
        )}
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value as ProposalStatus)}
          className="text-xs border border-gray-200 rounded px-2 py-1 text-gray-600 bg-white focus:outline-none focus:ring-1 focus:ring-blue-400 cursor-pointer"
        >
          <option value="proposed">提案中</option>
          <option value="adopted">採用</option>
          <option value="declined">見送り</option>
        </select>
      </div>
    </div>
  );
}

// --- Main ---

type Props = {
  result: HearingResult;
  asIs: string;
  toBe: string;
  memo: string;
  onTransfer: (text: string) => void;
};

export function HearingResultView({ result, asIs, toBe, memo, onTransfer }: Props) {
  const [confirmStatus, setConfirmStatus] = useState<Record<string, ConfirmStatus>>({});
  const [proposalStatus, setProposalStatus] = useState<Record<string, ProposalStatus>>({});

  const setConfirm = (key: string, s: ConfirmStatus) =>
    setConfirmStatus(prev => ({ ...prev, [key]: s }));
  const setProposal = (key: string, s: ProposalStatus) =>
    setProposalStatus(prev => ({ ...prev, [key]: s }));

  const total          = result.confirmations.length;
  const confirmedCount = result.confirmations.filter((_, i) => confirmStatus[`c-${i}`] === "confirmed").length;
  const pendingCount   = result.confirmations.filter((_, i) => confirmStatus[`c-${i}`] === "pending").length;
  const outCount       = result.confirmations.filter((_, i) => confirmStatus[`c-${i}`] === "out_of_scope").length;
  const confirmedPct   = total > 0 ? (confirmedCount / total) * 100 : 0;
  const pendingPct     = total > 0 ? (pendingCount   / total) * 100 : 0;

  const adoptedProposals = result.proposals.filter((_, i) => proposalStatus[`p-${i}`] === "adopted");

  const handleTransfer = () => {
    const lines: string[] = [];
    if (asIs.trim() && toBe.trim()) {
      lines.push("【現状（As-Is）】");
      lines.push(asIs);
      lines.push("");
      lines.push("【なりたい姿（To-Be）】");
      lines.push(toBe);
      lines.push("");
    } else if (memo.trim()) {
      lines.push("【ヒアリングメモ】");
      lines.push(memo);
      lines.push("");
    }
    lines.push("【採用された提案】");
    adoptedProposals.forEach(p => lines.push(`・${p}`));
    onTransfer(lines.join("\n"));
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-800">ヒアリング整理結果</h2>

      {/* 効率化の見込み */}
      {result.efficiencyGains.length > 0 && (
        <div className="bg-white rounded-xl border border-teal-200 shadow-sm overflow-hidden">
          <div className="px-5 py-3 bg-teal-50 border-b border-teal-100 flex items-center gap-2">
            <TrendingUp size={14} className="text-teal-600" />
            <h3 className="text-sm font-bold text-teal-800">効率化の見込み</h3>
          </div>
          <ul className="px-5 py-4 space-y-2">
            {result.efficiencyGains.map((g, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-700">
                <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-teal-400" />
                <span className="leading-relaxed">{g}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

        {/* 確認事項（左） */}
        <div className="space-y-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-sm font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
              確認事項
            </span>
            {total > 0 && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span><span className="font-semibold text-green-600">確認済</span> {confirmedCount}件</span>
                  <span><span className="font-semibold text-amber-600">確認中</span> {pendingCount}件</span>
                  <span><span className="font-semibold text-gray-400">スコープ外</span> {outCount}件</span>
                </div>
                <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden flex">
                  <div className="h-full bg-green-500 transition-all duration-300" style={{ width: `${confirmedPct}%` }} />
                  <div className="h-full bg-amber-400 transition-all duration-300" style={{ width: `${pendingPct}%` }} />
                </div>
              </div>
            )}
          </div>
          <div className="bg-white rounded-xl border border-amber-200 shadow-sm overflow-hidden">
            <div className="px-5 py-3 bg-amber-50 border-b border-amber-100">
              <p className="text-xs text-amber-700">ステータスを選んでヒアリングの進捗を管理できます</p>
            </div>
            <div className="divide-y divide-gray-100 px-2 py-1">
              {result.confirmations.map((q, i) => (
                <ConfirmStatusRow
                  key={i}
                  id={`c-${i}`}
                  status={confirmStatus[`c-${i}`] ?? "unchecked"}
                  onStatusChange={(s) => setConfirm(`c-${i}`, s)}
                  index={i}
                >
                  {q}
                </ConfirmStatusRow>
              ))}
            </div>
          </div>
        </div>

        {/* 提案（右） */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
              提案
            </span>
            {adoptedProposals.length > 0 && (
              <span className="text-xs text-green-600 font-medium">採用 {adoptedProposals.length}件</span>
            )}
          </div>
          <div className="bg-white rounded-xl border border-blue-200 shadow-sm overflow-hidden">
            <div className="px-5 py-3 bg-blue-50 border-b border-blue-100">
              <p className="text-xs text-blue-700">クライアントと合意できた提案を「採用」にしてください</p>
            </div>
            <div className="divide-y divide-gray-100 px-2 py-1">
              {result.proposals.map((p, i) => (
                <ProposalStatusRow
                  key={i}
                  id={`p-${i}`}
                  status={proposalStatus[`p-${i}`] ?? "proposed"}
                  onStatusChange={(s) => setProposal(`p-${i}`, s)}
                  index={i}
                >
                  {p}
                </ProposalStatusRow>
              ))}
            </div>
          </div>
          {adoptedProposals.length > 0 && (
            <button
              type="button"
              onClick={handleTransfer}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              採用した提案を業務要件レビューで分析する
              <ArrowRight size={15} />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
