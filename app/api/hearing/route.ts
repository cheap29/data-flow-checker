import { NextRequest, NextResponse } from "next/server";
import { analyzeHearing, analyzeHearingFromMemo } from "@/lib/openai";
import { validateHearingResult } from "@/lib/validate";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const memo: string = body.memo ?? "";
  const asIs: string = body.asIs ?? "";
  const toBe: string = body.toBe ?? "";

  const isMemoMode = !!memo.trim();

  if (isMemoMode && !memo.trim()) {
    return NextResponse.json({ error: "メモを入力してください。" }, { status: 400 });
  }
  if (!isMemoMode && (!asIs.trim() || !toBe.trim())) {
    return NextResponse.json(
      { error: "現状となりたい姿をどちらも入力してください。" },
      { status: 400 }
    );
  }

  try {
    const raw = isMemoMode
      ? await analyzeHearingFromMemo(memo)
      : await analyzeHearing(asIs, toBe);
    const parsed = JSON.parse(raw);
    const result = validateHearingResult(parsed);
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
