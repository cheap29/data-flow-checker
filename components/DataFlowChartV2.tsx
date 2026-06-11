import {
  User,
  Monitor,
  Server,
  Database,
  Bell,
  Zap,
  FileText,
  ArrowDown,
} from "lucide-react";
import type { DataFlow } from "@/lib/types";

// --- Actor detection ---

type ActorType = "user" | "frontend" | "backend" | "api" | "database" | "notification" | "other";

interface ActorConfig {
  Icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  chipCls: string;
  cardCls: string;
  lineCls: string;
  iconBg: string;
  iconColor: string;
}

const ACTOR_CONFIG: Record<ActorType, ActorConfig> = {
  user: {
    Icon: User,
    label: "ユーザー",
    chipCls: "bg-blue-100 text-blue-800 border-blue-200",
    cardCls: "bg-blue-50 border-blue-200",
    lineCls: "bg-blue-200",
    iconBg: "bg-blue-500",
    iconColor: "text-white",
  },
  frontend: {
    Icon: Monitor,
    label: "フロントエンド",
    chipCls: "bg-indigo-100 text-indigo-800 border-indigo-200",
    cardCls: "bg-indigo-50 border-indigo-200",
    lineCls: "bg-indigo-200",
    iconBg: "bg-indigo-500",
    iconColor: "text-white",
  },
  backend: {
    Icon: Server,
    label: "バックエンド",
    chipCls: "bg-violet-100 text-violet-800 border-violet-200",
    cardCls: "bg-violet-50 border-violet-200",
    lineCls: "bg-violet-200",
    iconBg: "bg-violet-500",
    iconColor: "text-white",
  },
  api: {
    Icon: Zap,
    label: "API",
    chipCls: "bg-purple-100 text-purple-800 border-purple-200",
    cardCls: "bg-purple-50 border-purple-200",
    lineCls: "bg-purple-200",
    iconBg: "bg-purple-500",
    iconColor: "text-white",
  },
  database: {
    Icon: Database,
    label: "DB",
    chipCls: "bg-amber-100 text-amber-800 border-amber-200",
    cardCls: "bg-amber-50 border-amber-200",
    lineCls: "bg-amber-200",
    iconBg: "bg-amber-500",
    iconColor: "text-white",
  },
  notification: {
    Icon: Bell,
    label: "通知",
    chipCls: "bg-green-100 text-green-800 border-green-200",
    cardCls: "bg-green-50 border-green-200",
    lineCls: "bg-green-200",
    iconBg: "bg-green-500",
    iconColor: "text-white",
  },
  other: {
    Icon: FileText,
    label: "システム",
    chipCls: "bg-gray-100 text-gray-700 border-gray-200",
    cardCls: "bg-gray-50 border-gray-200",
    lineCls: "bg-gray-200",
    iconBg: "bg-gray-400",
    iconColor: "text-white",
  },
};

function detectActor(text: string): ActorType {
  if (/ユーザー|利用者|担当者|管理者|オペレーター|申請者|承認者/.test(text)) return "user";
  if (/フロント|画面|ブラウザ|UI|クライアント|入力フォーム/.test(text)) return "frontend";
  if (/DB|データベース|テーブル|レコード|永続/.test(text)) return "database";
  if (/API|エンドポイント|リクエスト|レスポンス|HTTP/.test(text)) return "api";
  if (/バックエンド|サーバー|サービス|ロジック|処理/.test(text)) return "backend";
  if (/通知|メール|プッシュ|Slack|webhook|アラート/.test(text)) return "notification";
  return "other";
}

// --- Data state badge ---

interface DataStateDef {
  label: string;
  cls: string;
}

function detectDataState(text: string): DataStateDef | null {
  if (/エラー|失敗|不正|拒否/.test(text))    return { label: "エラー",  cls: "bg-red-100 text-red-700 border-red-200" };
  if (/バリデーション|検証|チェック/.test(text)) return { label: "検証",   cls: "bg-yellow-100 text-yellow-700 border-yellow-200" };
  if (/入力|フォーム|選択|記入/.test(text))   return { label: "入力",   cls: "bg-blue-100 text-blue-700 border-blue-200" };
  if (/送信|呼び出し|呼出|リクエスト|投げ/.test(text)) return { label: "送信",   cls: "bg-indigo-100 text-indigo-700 border-indigo-200" };
  if (/保存|登録|更新|削除|書き込み/.test(text)) return { label: "永続化",  cls: "bg-amber-100 text-amber-700 border-amber-200" };
  if (/表示|確認|返却|レスポンス|返す|見る/.test(text)) return { label: "表示",   cls: "bg-teal-100 text-teal-700 border-teal-200" };
  if (/通知|メール|送付|配信/.test(text))    return { label: "通知",   cls: "bg-green-100 text-green-700 border-green-200" };
  if (/処理|計算|集計|変換|生成/.test(text)) return { label: "処理",   cls: "bg-violet-100 text-violet-700 border-violet-200" };
  return null;
}

// --- Step card ---

function StepCard({
  step,
  index,
  isLast,
}: {
  step: string;
  index: number;
  isLast: boolean;
}) {
  const actor = detectActor(step);
  const state = detectDataState(step);
  const cfg = ACTOR_CONFIG[actor];
  const { Icon } = cfg;

  return (
    <li className="flex gap-3">
      {/* Left: icon + connecting line */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div className={`w-8 h-8 rounded-full ${cfg.iconBg} flex items-center justify-center shadow-sm`}>
          <Icon size={15} className={cfg.iconColor} />
        </div>
        {!isLast && (
          <div className={`w-0.5 flex-1 ${cfg.lineCls} my-1.5`} style={{ minHeight: 24 }} />
        )}
      </div>

      {/* Right: card */}
      <div className={`flex-1 border rounded-lg p-3 mb-${isLast ? "0" : "1"} ${cfg.cardCls}`}>
        {/* Actor chip + state badge */}
        <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
          <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${cfg.chipCls}`}>
            <Icon size={11} />
            {cfg.label}
          </span>
          {state && (
            <span className={`text-xs font-medium px-1.5 py-0.5 rounded border ${state.cls}`}>
              {state.label}
            </span>
          )}
        </div>
        {/* Step text */}
        <p className="text-xs text-gray-700 leading-relaxed">{step}</p>
      </div>
    </li>
  );
}

// --- Arrow between flows ---

function FlowArrow() {
  return (
    <div className="flex justify-center my-2 text-gray-300">
      <ArrowDown size={18} />
    </div>
  );
}

// --- Main export ---

export function DataFlowChartV2({ dataFlows }: { dataFlows: DataFlow[] }) {
  if (dataFlows.length === 0) {
    return <p className="text-sm text-gray-400">該当なし</p>;
  }

  return (
    <div className="space-y-4">
      {dataFlows.map((flow, fi) => (
        <div key={fi} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Flow title */}
          <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
            <span className="w-1.5 h-4 rounded-full bg-blue-400 flex-shrink-0" />
            <h3 className="text-xs font-bold text-gray-700">{flow.title}</h3>
          </div>

          {/* Steps */}
          <div className="p-4">
            <ol className="space-y-0">
              {flow.steps.map((step, si) => (
                <StepCard
                  key={si}
                  step={step}
                  index={si}
                  isLast={si === flow.steps.length - 1}
                />
              ))}
            </ol>
          </div>

          {/* Step count */}
          <div className="px-4 pb-3 flex justify-end">
            <span className="text-xs text-gray-400">{flow.steps.length} ステップ</span>
          </div>
        </div>
      ))}

      {/* Legend */}
      <div className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm">
        <p className="text-xs font-semibold text-gray-500 mb-2">アクター凡例</p>
        <div className="flex flex-wrap gap-2">
          {(Object.entries(ACTOR_CONFIG) as [ActorType, ActorConfig][])
            .filter(([k]) => k !== "other")
            .map(([key, cfg]) => {
              const { Icon } = cfg;
              return (
                <span
                  key={key}
                  className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${cfg.chipCls}`}
                >
                  <Icon size={11} />
                  {cfg.label}
                </span>
              );
            })}
        </div>
      </div>
    </div>
  );
}
