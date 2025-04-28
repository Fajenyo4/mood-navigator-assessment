
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
  rank?: number; // Added rank property
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

// Add the AssessmentRecord type definition
export interface AssessmentRecord {
  id: string;
  created_at: string;
  user_id: string;
  name: string;
  email: string;
  final_mood: string;
  depression_score: number;
  anxiety_score: number;
  stress_score: number;
  life_satisfaction_score: number;
  mental_status: string;
  language_code?: string;
  answers: {
    numeric: Record<string, number>;
    text: Record<string, string>;
    scores: {
      depression: number;
      anxiety: number;
      stress: number;
      lifeSatisfaction: number;
      isParent?: number;
      needsHelp?: number;
    };
    levels: {
      depression: string;
      anxiety: string;
      stress: string;
      lifeSatisfaction: string;
    };
  };
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
