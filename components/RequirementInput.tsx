"use client";

const SAMPLE_TEXT = `ユーザーはカラオケ店舗の部屋を予約できる。
予約時には店舗、利用日、開始時間、利用時間、人数を指定する。
空室がある場合のみ予約できる。
予約後、ユーザーに確認メールを送信する。
店舗スタッフは予約一覧を確認できる。
ユーザーは予約をキャンセルできる。
管理者は部屋情報を編集できる。`;

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  loading: boolean;
  error: string | null;
};

export function RequirementInput({ value, onChange, onSubmit, loading, error }: Props) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-700">
        業務要件を貼り付けてください
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`例：\nユーザーはカラオケ店舗の部屋を予約できる。\n予約時には店舗、利用日、開始時間、利用時間、人数を指定する。\n予約後、ユーザーに確認メールを送信する。\n店舗スタッフは予約一覧を確認できる。\nユーザーは予約をキャンセルできる。`}
        rows={8}
        className="w-full rounded-lg border border-gray-300 p-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onChange(SAMPLE_TEXT)}
          className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
        >
          サンプルを入れる
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={loading}
          className="px-5 py-2 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "分析中..." : "チェックする"}
        </button>
      </div>
    </div>
  );
}
