
export type SeverityLevel = 
  | "Normal" 
  | "Mild" 
  | "Moderate" 
  | "Severe" 
  | "Very Severe" 
  | "Very dissatisfied" 
  | "Dissatisfied" 
  | "Neutral" 
  | "Satisfied"
  | "Very Satisfied";

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

// Add the MoodResult type here
export interface MoodResult {
  mood: string;
  message: string;
  redirectUrl: string;
  iconType: 'frown' | 'meh' | 'smile';
  iconColor: string;
  depressionResult: AssessmentResult;
  anxietyResult: AssessmentResult;
  stressResult: AssessmentResult;
  satisfactionResult: AssessmentResult;
  isParent: number;
  needsHelp: number;
}
