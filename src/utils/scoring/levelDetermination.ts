
import { AssessmentResult, AssessmentType } from './types';

/**
 * Determine the severity level based on the score and assessment type
 */
export const determineLevel = (score: number, type: AssessmentType): AssessmentResult => {
  switch (type) {
    case 'depression':
      if (score < 10) return { score, level: "Normal", message: "normal", rank: 1 };
      else if (score < 14) return { score, level: "Mild", message: "mild", rank: 2 };
      else if (score < 21) return { score, level: "Moderate", message: "moderate", rank: 3 };
      else if (score < 28) return { score, level: "Severe", message: "severe", rank: 4 };
      else return { score, level: "Very Severe", message: "very severe", rank: 5 };
    
    case 'anxiety':
      if (score < 11) return { score, level: "Normal", message: "normal", rank: 1 };
      else if (score < 14) return { score, level: "Mild", message: "mild", rank: 2 };
      else if (score < 21) return { score, level: "Moderate", message: "moderate", rank: 3 };
      if (score < 28) return { score, level: "Severe", message: "severe", rank: 4 };
      else return { score, level: "Very Severe", message: "very severe", rank: 5 };
    
    case 'stress':
      if (score < 17) return { score, level: "Normal", message: "normal", rank: 1 };
      else if (score < 21) return { score, level: "Mild", message: "mild", rank: 2 };
      else if (score < 29) return { score, level: "Moderate", message: "moderate", rank: 3 };
      else if (score < 38) return { score, level: "Severe", message: "severe", rank: 4 };
      else return { score, level: "Very Severe", message: "very severe", rank: 5 };
    
    case 'satisfaction':
      if (score < 14) return { score, level: "Very dissatisfied", message: "very dissatisfied", rank: 1 };
      else if (score < 20) return { score, level: "Dissatisfied", message: "dissatisfied", rank: 2 };
      else if (score < 27) return { score, level: "Neutral", message: "neutral", rank: 3 };
      else if (score < 33) return { score, level: "Satisfied", message: "satisfied", rank: 4 };
      else return { score, level: "Very Satisfied", message: "very satisfied", rank: 5 };
  }
};

/**
 * Get severity level string based on score for a specific assessment type
 */
export const getSeverityLevel = (score: number, type: 'depression' | 'anxiety' | 'stress'): string => {
  if (type === 'depression') {
    if (score < 10) return "Normal";
    else if (score < 14) return "Mild";
    else if (score < 21) return "Moderate";
    else if (score < 28) return "Severe";
    else return "Very Severe";
  } else if (type === 'anxiety') {
    if (score < 11) return "Normal";
    else if (score < 14) return "Mild";
    else if (score < 21) return "Moderate";
    else if (score < 28) return "Severe";
    return "Very Severe";
  } else if (type === 'stress') {
    if (score < 17) return "Normal";
    else if (score < 21) return "Mild";
    else if (score < 29) return "Moderate";
    else if (score < 38) return "Severe";
    else return "Very Severe";
  }
};

/**
 * Get satisfaction level string based on score
 */
export const getSatisfactionLevel = (score: number): string => {
  if (score < 14) return "Very dissatisfied";
  else if (score < 20) return "Dissatisfied";
  else if (score < 27) return "Neutral";
  else if (score < 33) return "Satisfied";
  else return "Very Satisfied";
};
