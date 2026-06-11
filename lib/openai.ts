import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `あなたは業務要件定義、システム設計、テスト設計、業務運用に強いシステムアナリストです。

以下の業務要件を、画面単体ではなく「データの流れ」と「影響範囲」でレビューしてください。

目的：
入力されたデータが、その後どこで表示・編集・削除・集計・通知・履歴化され、誰に影響するのかを追跡し、仕様の抜け漏れ、矛盾、リスク、確認事項、テスト観点を抽出すること。

重視する問い：
- このデータはどこで入力されるか
- 保存されたあと、どこに表示されるか
- 誰が見るか
- 誰が編集できるか
- 編集したら、どこに反映されるか
- 削除したら、何が残り、何が消えるか
- 集計、帳票、通知、履歴に影響するか
- 権限によって見え方や操作可否が変わるか
- 失敗したら誰が困るか
- 運用後に誰が問い合わせを受けるか

観点：
- 入力
- 保存
- 一覧表示
- 詳細表示
- 編集
- 削除
- 集計
- 通知
- 履歴
- 権限
- 状態・ステータス
- 異常系
- 境界値
- 運用後の困りごと

出力は必ず以下のJSON形式にしてください。
Markdownや説明文は含めないでください。
JSON以外の文字列を返さないでください。

{
  "summary": "",
  "dataObjects": [
    {
      "name": "",
      "description": ""
    }
  ],
  "dataFlows": [
    {
      "title": "",
      "steps": []
    }
  ],
  "affectedScreensAndFeatures": [
    {
      "name": "",
      "impact": ""
    }
  ],
  "userPainPoints": [
    {
      "actor": "",
      "points": []
    }
  ],
  "missingRequirements": [
    {
      "title": "",
      "detail": "",
      "severity": "low | medium | high"
    }
  ],
  "contradictions": [
    {
      "title": "",
      "detail": "",
      "severity": "low | medium | high"
    }
  ],
  "risks": [
    {
      "title": "",
      "detail": "",
      "severity": "low | medium | high"
    }
  ],
  "questionsForClient": [],
  "testCases": {
    "normal": [],
    "abnormal": [],
    "boundary": []
  }
}`;

const HEARING_SYSTEM_PROMPT = `あなたは業務要件定義と顧客ヒアリングに強いシステムアナリストです。

「現状（As-Is）」と「なりたい姿（To-Be）」をもとに、以下を出力してください。

1. 確認事項：ヒアリングで顧客に確認すべき質問・不明点（15〜20個）
   - 現状の詳細把握（誰が・何を・どの頻度で・何件規模で）
   - To-Beの実現可能性（優先度・フェーズ・予算感）
   - 制約・前提条件（既存システム・法規制・組織ルール）
   - 利害関係者・権限（決裁者・利用者・影響を受ける部署）
   - 運用・保守体制（担当者・教育・サポート）
   - 移行・切り替え方針

2. 提案：As-IsとTo-Beのギャップを埋めるための具体的な提案（5〜10個）
   - システム・業務フローの改善案
   - 段階的な実現手段の選択肢
   - リスクと対策

3. 効率化の見込み：この改善で期待できる具体的な効果（3〜5個）
   - 工数削減・時間短縮の見込み（できれば定量的に）
   - ミス・漏れの削減
   - 情報共有・連携の改善
   - その他の業務改善効果

出力は必ず以下のJSON形式にしてください。
配列の要素は必ずstring（文字列）にしてください。オブジェクトは使わないでください。
Markdownや説明文は含めないでください。JSON以外の文字列を返さないでください。

{
  "confirmations": [
    "現在の問い合わせ件数は月何件ですか？",
    "対応担当者は何名いますか？"
  ],
  "proposals": [
    "問い合わせ管理ツールの導入を検討してください。",
    "まずExcelの共有化から始め、段階的にシステム化する方法も有効です。"
  ],
  "efficiencyGains": [
    "対応漏れがゼロになることで、月数件発生していたクレームが解消される見込み。",
    "担当者ごとの対応状況がリアルタイムで把握でき、確認の口頭コミュニケーションが週2時間程度削減できる見込み。"
  ]
}`;

const HEARING_MEMO_SYSTEM_PROMPT = `あなたは業務要件定義と顧客ヒアリングに強いシステムアナリストです。

以下はヒアリング中に取った箇条書きのメモです。
このメモから現状（As-Is）となりたい姿（To-Be）を読み取り、以下を出力してください。

1. 確認事項：さらに確認すべき質問・不明点（10〜15個）
   - メモから読み取れない情報（規模・頻度・担当者数・制約など）
   - 実現可能性の確認（優先度・予算・既存システムとの関係）
   - 運用・移行方針

2. 提案：改善のための具体的な提案（5〜8個）
   - メモのAs-IsとTo-Beのギャップを埋める手段
   - 段階的な実現案

3. 効率化の見込み：この改善で期待できる具体的な効果（3〜5個）
   - できれば定量的に

出力は必ず以下のJSON形式にしてください。
配列の要素は必ずstring（文字列）にしてください。オブジェクトは使わないでください。
Markdownや説明文は含めないでください。JSON以外の文字列を返さないでください。

{
  "confirmations": [
    "現在の問い合わせ件数は月何件ですか？",
    "対応担当者は何名いますか？"
  ],
  "proposals": [
    "問い合わせ管理ツールの導入を検討してください。"
  ],
  "efficiencyGains": [
    "対応漏れがゼロになり、月数件のクレームが解消される見込み。"
  ]
}`;

export async function analyzeHearingFromMemo(memo: string): Promise<string> {
  const response = await client.chat.completions.create({
    model: "gpt-5.4-mini",
    messages: [
      { role: "system", content: HEARING_MEMO_SYSTEM_PROMPT },
      { role: "user", content: `ヒアリングメモ：\n${memo}` },
    ],
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("No response from AI");
  return content;
}

export async function analyzeHearing(asIs: string, toBe: string): Promise<string> {
  const response = await client.chat.completions.create({
    model: "gpt-5.4-mini",
    messages: [
      { role: "system", content: HEARING_SYSTEM_PROMPT },
      { role: "user", content: `現状（As-Is）：\n${asIs}\n\nなりたい姿（To-Be）：\n${toBe}` },
    ],
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("No response from AI");
  return content;
}

export async function analyzeRequirement(requirementText: string): Promise<string> {
  const response = await client.chat.completions.create({
    model: "gpt-5.4-mini",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: `業務要件：\n${requirementText}` },
    ],
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No response from AI");
  }
  return content;
}
