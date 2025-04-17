
export type SeverityLevel = "Normal" | "Mild" | "Medium" | "Moderate" | "Critical" | "Very Serious" | "Unsatisfactory" | "Very Unsatisfactory" | "Neutral" | "Satisfactory" | "Very Satisfied";

export type AssessmentType = "depression" | "anxiety" | "stress" | "satisfaction";

export interface AssessmentResult {
  score: number;
  level: SeverityLevel;
  message: string;
}

export interface DassScores {
  depression: number;
  anxiety: number;
  stress: number;
  lifeSatisfaction: number;
  isParent: number;
  needsHelp: number;
}

export interface AssessmentLevels {
  depressionLevel: AssessmentResult;
  anxietyLevel: AssessmentResult;
  stressLevel: AssessmentResult;
  satisfactionLevel: AssessmentResult;
}
