
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
      if (score < 10) return { score, level: "Normal", message: "normal depression levels" };
      if (score < 14) return { score, level: "Mild", message: "mild depression" };
      if (score < 21) return { score, level: "Moderate", message: "moderate depression" };
      if (score < 28) return { score, level: "Severe", message: "severe depression" };
      return { score, level: "Very Severe", message: "very severe depression" };
    
    case 'anxiety':
      if (score < 11) return { score, level: "Normal", message: "normal anxiety levels" };
      if (score < 14) return { score, level: "Mild", message: "mild anxiety" };
      if (score < 21) return { score, level: "Moderate", message: "moderate anxiety" };
      if (score < 28) return { score, level: "Severe", message: "severe anxiety" };
      return { score, level: "Very Severe", message: "very severe anxiety" };
    
    case 'stress':
      if (score < 17) return { score, level: "Normal", message: "normal stress levels" };
      if (score < 21) return { score, level: "Mild", message: "mild stress" };
      if (score < 29) return { score, level: "Moderate", message: "moderate stress" };
      if (score < 38) return { score, level: "Severe", message: "severe stress" };
      return { score, level: "Very Severe", message: "very severe stress" };
    
    case 'satisfaction':
      if (score < 14) return { score, level: "Very dissatisfied", message: "very dissatisfied with life" };
      if (score < 20) return { score, level: "Dissatisfied", message: "dissatisfied with life" };
      if (score < 27) return { score, level: "Neutral", message: "neutral about life" };
      if (score < 33) return { score, level: "Satisfied", message: "satisfied with life" };
      return { score, level: "Very Satisfied", message: "very satisfied with life" };
  }
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
      if (severityOrder.indexOf(level) > severityOrder.indexOf(maxSeverity)) {
        maxSeverity = level;
      }
    }
    return maxSeverity;
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
