import { z } from "zod";
import type { AnalysisResult } from "./types";

const SeveritySchema = z.enum(["low", "medium", "high"]);

const DataObjectSchema = z.object({
  name: z.string(),
  description: z.string(),
});

const DataFlowSchema = z.object({
  title: z.string(),
  steps: z.array(z.string()),
});

const AffectedScreenSchema = z.object({
  name: z.string(),
  impact: z.string(),
});

const UserPainPointSchema = z.object({
  actor: z.string(),
  points: z.array(z.string()),
});

const FindingSchema = z.object({
  title: z.string(),
  detail: z.string(),
  severity: SeveritySchema,
});

const TestCasesSchema = z.object({
  normal: z.array(z.string()),
  abnormal: z.array(z.string()),
  boundary: z.array(z.string()),
});

const AnalysisResultSchema = z.object({
  summary: z.string(),
  dataObjects: z.array(DataObjectSchema),
  dataFlows: z.array(DataFlowSchema),
  affectedScreensAndFeatures: z.array(AffectedScreenSchema),
  userPainPoints: z.array(UserPainPointSchema),
  missingRequirements: z.array(FindingSchema),
  contradictions: z.array(FindingSchema),
  risks: z.array(FindingSchema),
  questionsForClient: z.array(z.string()),
  testCases: TestCasesSchema,
});

export function validateAnalysisResult(data: unknown): AnalysisResult {
  return AnalysisResultSchema.parse(data);
}
