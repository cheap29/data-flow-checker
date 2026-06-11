import { NextRequest, NextResponse } from "next/server";
import { analyzeRequirement } from "@/lib/openai";
import { validateAnalysisResult } from "@/lib/validate";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const requirementText: string = body.requirementText ?? "";

  if (!requirementText.trim()) {
    return NextResponse.json(
      { error: "業務要件を入力してください。" },
      { status: 400 }
    );
  }

  try {
    const raw = await analyzeRequirement(requirementText);
    const parsed = JSON.parse(raw);
    const result = validateAnalysisResult(parsed);
    return NextResponse.json(result);
  } catch (e) {
    if (e instanceof SyntaxError) {
      return NextResponse.json(
        { error: "分析結果の形式が不正です。再度お試しください。" },
        { status: 500 }
      );
    }
    console.error(e);
    return NextResponse.json(
      { error: "分析中にエラーが発生しました。時間をおいて再度お試しください。" },
      { status: 500 }
    );
  }
}
