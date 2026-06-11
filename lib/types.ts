export type Severity = "low" | "medium" | "high";

export type DataObject = {
  name: string;
  description: string;
};

export type DataFlow = {
  title: string;
  steps: string[];
};

export type AffectedScreenOrFeature = {
  name: string;
  impact: string;
};

export type UserPainPoint = {
  actor: string;
  points: string[];
};

export type Finding = {
  title: string;
  detail: string;
  severity: Severity;
};

export type TestCases = {
  normal: string[];
  abnormal: string[];
  boundary: string[];
};

export type AnalysisResult = {
  summary: string;
  dataObjects: DataObject[];
  dataFlows: DataFlow[];
  affectedScreensAndFeatures: AffectedScreenOrFeature[];
  userPainPoints: UserPainPoint[];
  missingRequirements: Finding[];
  contradictions: Finding[];
  risks: Finding[];
  questionsForClient: string[];
  testCases: TestCases;
};
