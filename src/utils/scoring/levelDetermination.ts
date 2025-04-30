
import { AssessmentResult, AssessmentType } from './types';

/**
 * Determine the severity level based on the score and assessment type
 */
export const determineLevel = (score: number, type: AssessmentType): AssessmentResult => {
  switch (type) {
    case 'depression':
      if (score < 10) return { score, level: "Normal", message: "normal", rank: 1 };
      if (score < 14) return { score, level: "Mild", message: "mild", rank: 2 };
      if (score < 21) return { score, level: "Moderate", message: "moderate", rank: 3 };
      if (score < 28) return { score, level: "Severe", message: "severe", rank: 4 };
      return { score, level: "Very Severe", message: "very severe", rank: 5 };
    
    case 'anxiety':
      if (score < 11) return { score, level: "Normal", message: "normal", rank: 1 };
      if (score < 14) return { score, level: "Mild", message: "mild", rank: 2 };
      if (score < 21) return { score, level: "Moderate", message: "moderate", rank: 3 };
      if (score < 28) return { score, level: "Severe", message: "severe", rank: 4 };
      return { score, level: "Very Severe", message: "very severe", rank: 5 };
    
    case 'stress':
      if (score < 17) return { score, level: "Normal", message: "normal", rank: 1 };
      if (score < 21) return { score, level: "Mild", message: "mild", rank: 2 };
      if (score < 29) return { score, level: "Moderate", message: "moderate", rank: 3 };
      if (score < 38) return { score, level: "Severe", message: "severe", rank: 4 };
      return { score, level: "Very Severe", message: "very severe", rank: 5 };
    
    case 'satisfaction':
      if (score <= 5) return { score, level: "Very dissatisfied", message: "very dissatisfied", rank: 1 };
      if (score < 14) return { score, level: "Dissatisfied", message: "dissatisfied", rank: 2 };
      if (score < 20) return { score, level: "Neutral", message: "neutral", rank: 3 };
      if (score < 25) return { score, level: "Satisfied", message: "satisfied", rank: 4 };
      return { score, level: "Very Satisfied", message: "very satisfied", rank: 5 };
  }
};

/**
 * Get severity level string based on score for a specific assessment type
 */
export const getSeverityLevel = (score: number, type: 'depression' | 'anxiety' | 'stress'): string => {
  if (type === 'depression') {
    if (score < 10) return "Normal";
    if (score < 14) return "Mild";
    if (score < 21) return "Moderate";
    if (score < 28) return "Severe";
    return "Very Severe";
  } else if (type === 'anxiety') {
    if (score < 11) return "Normal";
    if (score < 14) return "Mild";
    if (score < 21) return "Moderate";
    if (score < 28) return "Severe";
    return "Very Severe";
  } else { // stress
    if (score < 17) return "Normal";
    if (score < 21) return "Mild";
    if (score < 29) return "Moderate";
    if (score < 38) return "Severe";
    return "Very Severe";
  }
};

/**
 * Get satisfaction level string based on score
 */
export const getSatisfactionLevel = (score: number): string => {
  if (score <= 5) return "Very dissatisfied";
  if (score < 14) return "Dissatisfied";
  if (score < 20) return "Neutral";
  if (score < 25) return "Satisfied";
  return "Very Satisfied";
};
