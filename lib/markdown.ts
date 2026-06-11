import type { AnalysisResult, Finding } from "./types";

const severityLabel: Record<string, string> = {
  high: "高",
  medium: "中",
  low: "低",
};

function renderFindings(items: Finding[]): string {
  return items
    .map((f) => `- 【${severityLabel[f.severity]}】${f.title}\n  - ${f.detail}`)
    .join("\n");
}

export function toMarkdown(result: AnalysisResult): string {
  const lines: string[] = [];

  lines.push("# 要件設計サポートアプリ 分析結果\n");

  lines.push("## 概要\n");
  lines.push(result.summary + "\n");

  lines.push("## 主要データ\n");
  result.dataObjects.forEach((d) => {
    lines.push(`- ${d.name}`);
    lines.push(`  - ${d.description}`);
  });
  lines.push("");

  lines.push("## データの流れ\n");
  result.dataFlows.forEach((flow) => {
    lines.push(`### ${flow.title}\n`);
    flow.steps.forEach((step, i) => {
      lines.push(`${i + 1}. ${step}`);
    });
    lines.push("");
  });

  lines.push("## 影響を受ける画面・機能\n");
  result.affectedScreensAndFeatures.forEach((a) => {
    lines.push(`- ${a.name}`);
    lines.push(`  - ${a.impact}`);
  });
  lines.push("");

  lines.push("## 利用者別の困りごと\n");
  result.userPainPoints.forEach((u) => {
    lines.push(`### ${u.actor}\n`);
    u.points.forEach((p) => lines.push(`- ${p}`));
    lines.push("");
  });

  lines.push("## 抜けていそうな仕様\n");
  lines.push(renderFindings(result.missingRequirements) + "\n");

  lines.push("## 矛盾していそうな仕様\n");
  lines.push(renderFindings(result.contradictions) + "\n");

  lines.push("## リスク\n");
  lines.push(renderFindings(result.risks) + "\n");

  lines.push("## 現場に確認したい質問\n");
  result.questionsForClient.forEach((q) => lines.push(`- ${q}`));
  lines.push("");

  lines.push("## テスト観点\n");

  lines.push("### 正常系\n");
  result.testCases.normal.forEach((t) => lines.push(`- ${t}`));
  lines.push("");

  lines.push("### 異常系\n");
  result.testCases.abnormal.forEach((t) => lines.push(`- ${t}`));
  lines.push("");

  lines.push("### 境界値\n");
  result.testCases.boundary.forEach((t) => lines.push(`- ${t}`));
  lines.push("");

  return lines.join("\n");
}
