"use client";

import { useState } from "react";

const SAMPLE_AS_IS = `お客様からの問い合わせはメールで受け取り、担当者がExcelに手入力して管理している。対応状況は口頭で共有しており、誰がどの問い合わせを対応中かが把握しにくい状態。対応漏れが月に数件発生している。`;
const SAMPLE_TO_BE = `問い合わせをシステムで一元管理し、担当者がリアルタイムで対応状況を確認・更新できるようにしたい。対応漏れをゼロにし、進捗確認のための口頭コミュニケーションを減らしたい。`;
const SAMPLE_MEMO = `・Excelで問い合わせ管理してる
・メールで受信 → 手入力が大変
・誰が対応してるかわからない
・対応漏れが月数件ある
・スマホでも確認したい
・対応状況をリアルタイムで共有したい
・月次の集計に2時間かかってる
・担当者3名でまわしてる`;

type InputMode = "structured" | "memo";

type Props = {
  asIs: string;
  toBe: string;
  memo: string;
  onAsIsChange: (v: string) => void;
  onToBeChange: (v: string) => void;
  onMemoChange: (v: string) => void;
  onSubmit: (mode: InputMode) => void;
  loading: boolean;
  error: string | null;
};

export function HearingInput({
  asIs, toBe, memo,
  onAsIsChange, onToBeChange, onMemoChange,
  onSubmit, loading, error,
}: Props) {
  const [mode, setMode] = useState<InputMode>("structured");

  return (
    <div className="space-y-4">
      {/* モード切り替えトグル */}
      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 w-fit">
        <button
          type="button"
          onClick={() => setMode("structured")}
          className={mode === "structured"
            ? "px-3 py-1.5 text-xs font-semibold rounded-md bg-white shadow-sm text-gray-800 transition-all"
            : "px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors"}
        >
          整理済みテキスト
        </button>
        <button
          type="button"
          onClick={() => setMode("memo")}
          className={mode === "memo"
            ? "px-3 py-1.5 text-xs font-semibold rounded-md bg-white shadow-sm text-gray-800 transition-all"
            : "px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors"}
        >
          メモをそのまま貼る
        </button>
      </div>

      {mode === "structured" ? (
        <>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">現状（As-Is）</label>
            <textarea
              value={asIs}
              onChange={(e) => onAsIsChange(e.target.value)}
              placeholder="例：お客様からの問い合わせはメールで受け取り、担当者がExcelに手入力して管理している。対応状況は口頭で共有している。"
              rows={5}
              className="w-full rounded-lg border border-gray-300 p-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">なりたい姿（To-Be）</label>
            <p className="text-xs text-gray-400 mb-1.5">
              「誰が・何を・どうできるようになりたいか」と「それによってどんな効率化・改善が見込めるか」を書くと、より具体的な提案が得られます。
            </p>
            <textarea
              value={toBe}
              onChange={(e) => onToBeChange(e.target.value)}
              placeholder="例：問い合わせをシステムで一元管理し、担当者がリアルタイムで対応状況を確認・更新できるようにしたい。対応漏れをゼロにし、進捗確認のための口頭コミュニケーションを減らしたい。"
              rows={5}
              className="w-full rounded-lg border border-gray-300 p-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
            />
          </div>
        </>
      ) : (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">ヒアリングメモ</label>
          <p className="text-xs text-gray-400 mb-1.5">
            箇条書きのメモをそのまま貼ってください。AIが現状・なりたい姿に仕分けします。
          </p>
          <textarea
            value={memo}
            onChange={(e) => onMemoChange(e.target.value)}
            placeholder={"例：\n・Excelで在庫管理してる\n・発注担当が変わると引き継ぎが大変\n・スマホでも確認したい\n・月次集計に3時間かかってる"}
            rows={8}
            className="w-full rounded-lg border border-gray-300 p-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
          />
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => {
            if (mode === "structured") { onAsIsChange(SAMPLE_AS_IS); onToBeChange(SAMPLE_TO_BE); }
            else { onMemoChange(SAMPLE_MEMO); }
          }}
          className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
        >
          サンプルを入れる
        </button>
        <button
          type="button"
          onClick={() => onSubmit(mode)}
          disabled={loading}
          className="px-5 py-2 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "整理中..." : mode === "memo" ? "メモをAs-Is / To-Beに整理する" : "ヒアリングを整理する"}
        </button>
      </div>
    </div>
  );
}
