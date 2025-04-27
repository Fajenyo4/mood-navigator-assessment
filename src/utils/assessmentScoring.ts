
import { AssessmentResult, AssessmentType, DassScores, SeverityLevel, AssessmentLevels, MoodResult } from './scoring/types';

const SEVERITY_WEIGHTS: Record<SeverityLevel, number> = {
  "Normal": 0,
  "Mild": 1,
  "Moderate": 2,
  "Severe": 3,
  "Very Severe": 4,
  "Very dissatisfied": 0,
  "Dissatisfied": 1,
  "Neutral": 2,
  "Satisfied": 3,
  "Very Satisfied": 4
};

export const calculateDassScores = (answers: { [key: number]: number }): DassScores => {
  // Depression calculation (q3, q5, q10, q13, q16, q17, q21)
  const depression = ((answers[3] || 0) + (answers[5] || 0) + (answers[10] || 0) + 
                     (answers[13] || 0) + (answers[16] || 0) + (answers[17] || 0) + 
                     (answers[21] || 0)) * 2;

  // Anxiety calculation (q2, q4, q7, q9, q15, q19, q20)
  const anxiety = ((answers[2] || 0) + (answers[4] || 0) + (answers[7] || 0) + 
                  (answers[9] || 0) + (answers[15] || 0) + (answers[19] || 0) + 
                  (answers[20] || 0)) * 2;

  // Stress calculation (q1, q6, q8, q11, q12, q14, q18)
  const stress = ((answers[1] || 0) + (answers[6] || 0) + (answers[8] || 0) + 
                 (answers[11] || 0) + (answers[12] || 0) + (answers[14] || 0) + 
                 (answers[18] || 0)) * 2;

  // Life satisfaction calculation (q22-26)
  const lifeSatisfaction = (answers[22] || 0) + (answers[23] || 0) + (answers[24] || 0) + 
                          (answers[25] || 0) + (answers[26] || 0);

  return {
    depression,
    anxiety,
    stress,
    lifeSatisfaction,
    isParent: answers[27] || 0,
    needsHelp: answers[28] || 0
  };
};

export const determineLevel = (score: number, type: AssessmentType): AssessmentResult => {
  switch (type) {
    case 'depression':
      if (score < 10) return { score, level: "Normal", message: "normal" };
      if (score < 14) return { score, level: "Mild", message: "mild" };
      if (score < 21) return { score, level: "Moderate", message: "moderate" };
      if (score < 28) return { score, level: "Severe", message: "severe" };
      return { score, level: "Very Severe", message: "very severe" };
    
    case 'anxiety':
      if (score < 11) return { score, level: "Normal", message: "normal" };
      if (score < 14) return { score, level: "Mild", message: "mild" };
      if (score < 21) return { score, level: "Moderate", message: "moderate" };
      if (score < 28) return { score, level: "Severe", message: "severe" };
      return { score, level: "Very Severe", message: "very severe" };
    
    case 'stress':
      if (score < 17) return { score, level: "Normal", message: "normal" };
      if (score < 21) return { score, level: "Mild", message: "mild" };
      if (score < 29) return { score, level: "Moderate", message: "moderate" };
      if (score < 38) return { score, level: "Severe", message: "severe" };
      return { score, level: "Very Severe", message: "very severe" };
    
    case 'satisfaction':
      if (score < 14) return { score, level: "Very dissatisfied", message: "very dissatisfied" };
      if (score < 20) return { score, level: "Dissatisfied", message: "dissatisfied" };
      if (score < 27) return { score, level: "Neutral", message: "neutral" };
      if (score < 33) return { score, level: "Satisfied", message: "satisfied" };
      return { score, level: "Very Satisfied", message: "very satisfied" };
  }
};

// New helper functions for chart visualization
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

export const getSeverityColor = (level: string): string => {
  switch (level) {
    case 'Normal':
      return '#10b981'; // Green
    case 'Mild':
      return '#f59e0b'; // Amber
    case 'Moderate':
      return '#f97316'; // Orange
    case 'Severe':
      return '#ef4444'; // Red
    case 'Very Severe':
      return '#dc2626'; // Dark red
    default:
      return '#6b7280'; // Gray
  }
};

export const getSatisfactionLevel = (score: number): string => {
  if (score < 14) return "Very dissatisfied";
  if (score < 20) return "Dissatisfied";
  if (score < 27) return "Neutral";
  if (score < 33) return "Satisfied";
  return "Very Satisfied";
};

export const getSatisfactionColor = (level: string): string => {
  switch (level) {
    case 'Very Satisfied':
      return '#10b981'; // Green
    case 'Satisfied':
      return '#34d399'; // Light green
    case 'Neutral':
      return '#f59e0b'; // Amber
    case 'Dissatisfied':
      return '#f97316'; // Orange
    case 'Very dissatisfied':
      return '#ef4444'; // Red
    default:
      return '#6b7280'; // Gray
  }
};

// Function to generate test data with extreme values for visualization testing
export const generateTestData = (userId: string, userName: string, userEmail: string): any => {
  const now = new Date();
  
  return {
    severe: {
      userId,
      userName,
      userEmail,
      created_at: now.toISOString(),
      depression_score: 40,  // maximum severity
      anxiety_score: 40,     // maximum severity
      stress_score: 40,      // maximum severity
      life_satisfaction_score: 5,  // very dissatisfied
      final_mood: "Psychological Disturbance",
      answers: {
        numeric: {},
        text: {},
        scores: {
          depression: 40,
          anxiety: 40,
          stress: 40,
          lifeSatisfaction: 5
        },
        levels: {
          depression: "Very Severe",
          anxiety: "Very Severe",
          stress: "Very Severe",
          lifeSatisfaction: "Very dissatisfied"
        }
      }
    },
    normal: {
      userId,
      userName,
      userEmail,
      created_at: new Date(now.getTime() - 86400000).toISOString(), // yesterday
      depression_score: 5,    // normal
      anxiety_score: 5,       // normal
      stress_score: 10,       // normal
      life_satisfaction_score: 34, // very satisfied
      final_mood: "Healthy/Happy",
      answers: {
        numeric: {},
        text: {},
        scores: {
          depression: 5,
          anxiety: 5,
          stress: 10,
          lifeSatisfaction: 34
        },
        levels: {
          depression: "Normal",
          anxiety: "Normal",
          stress: "Normal",
          lifeSatisfaction: "Very Satisfied"
        }
      }
    }
  };
};

export const determineMoodResult = (
  depressionLevel: AssessmentResult,
  anxietyLevel: AssessmentResult,
  stressLevel: AssessmentResult,
  satisfactionLevel: AssessmentResult,
  isParent: number,
  needsHelp: number
) => {
  const getDassSeverity = () => {
    const levels = [depressionLevel.level, anxietyLevel.level, stressLevel.level];
    const severityOrder = ["Normal", "Mild", "Moderate", "Severe", "Very Severe"];
    let maxSeverity = "Normal";
    
    for (const level of levels) {
      if (severityOrder.indexOf(level as string) > severityOrder.indexOf(maxSeverity)) {
        maxSeverity = level as string;
      }
    }
    return maxSeverity as "Normal" | "Mild" | "Moderate" | "Severe" | "Very Severe";
  };

  const dass = getDassSeverity();
  const isUnhappySatisfaction = satisfactionLevel.level === "Dissatisfied" || 
                               satisfactionLevel.level === "Very dissatisfied";

  let moodStatus: string;
  let moodMessage: string;
  let iconType: 'frown' | 'meh' | 'smile' = 'meh';
  let iconColor = "text-yellow-500";

  // Updated mental health status determination logic
  if ((dass === "Severe" || dass === "Very Severe") ||
      (dass === "Moderate" && isUnhappySatisfaction)) {
    moodStatus = "Psychological Disturbance";
    moodMessage = "You are experiencing significant psychological distress.";
    iconType = "frown";
    iconColor = "text-red-500";
  } else if (dass === "Moderate" ||
            (dass === "Mild" && isUnhappySatisfaction)) {
    moodStatus = "Medium-to-Low Sub-Health Status / Very Unhappy";
    moodMessage = "You are experiencing a medium to low sub-health status.";
    iconType = "meh";
    iconColor = "text-orange-500";
  } else if (dass === "Mild" ||
            (dass === "Normal" && isUnhappySatisfaction)) {
    moodStatus = "Moderate Sub-Health Status / Unhappy";
    moodMessage = "You are experiencing a moderate sub-health status.";
    iconType = "meh";
    iconColor = "text-yellow-500";
  } else if (dass === "Normal" && satisfactionLevel.level === "Neutral") {
    moodStatus = "Medium to High Sub-Health Status / Not Happy";
    moodMessage = "You are experiencing a medium to high sub-health status.";
    iconType = "meh";
    iconColor = "text-blue-500";
  } else {
    moodStatus = "Healthy/Happy";
    moodMessage = "You are in a healthy mental state.";
    iconType = "smile";
    iconColor = "text-green-500";
  }

  const fullMessage = `Mental Health Status: ${moodStatus}\n\n${moodMessage}\n\nDetailed Analysis:\nDepression: ${depressionLevel.message}\nAnxiety: ${anxietyLevel.message}\nStress: ${stressLevel.message}\nLife Satisfaction: ${satisfactionLevel.message}`;

  return {
    mood: moodStatus,
    message: fullMessage,
    redirectUrl: "https://www.mican.life/courses-en",
    iconType,
    iconColor,
    depressionResult: depressionLevel,
    anxietyResult: anxietyLevel,
    stressResult: stressLevel,
    satisfactionResult: satisfactionLevel,
    isParent,
    needsHelp
  };
};

export type { MoodResult };
