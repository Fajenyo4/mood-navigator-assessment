import { AssessmentResult, AssessmentType, DassScores, SeverityLevel, AssessmentLevels } from './scoring/types';

const SEVERITY_WEIGHTS: Record<SeverityLevel, number> = {
  "Normal": 0,
  "Mild": 1,
  "Medium": 2,
  "Moderate": 2,
  "Critical": 3,
  "Very Serious": 4,
  "Unsatisfactory": 1,
  "Very Unsatisfactory": 0,
  "Neutral": 2,
  "Satisfactory": 3,
  "Very Satisfied": 4
};

export const calculateDassScores = (answers: { [key: number]: number }): DassScores => {
  // Depression questions: 3, 5, 10, 13, 16, 17, 21
  const depression = ((answers[3] || 0) + (answers[5] || 0) + (answers[10] || 0) + 
                     (answers[13] || 0) + (answers[16] || 0) + (answers[17] || 0) + 
                     (answers[21] || 0)) * 2;

  // Anxiety questions: 2, 4, 7, 9, 15, 19, 20
  const anxiety = ((answers[2] || 0) + (answers[4] || 0) + (answers[7] || 0) + 
                  (answers[9] || 0) + (answers[15] || 0) + (answers[19] || 0) + 
                  (answers[20] || 0)) * 2;

  // Stress questions: 1, 6, 8, 11, 12, 14, 18
  const stress = ((answers[1] || 0) + (answers[6] || 0) + (answers[8] || 0) + 
                 (answers[11] || 0) + (answers[12] || 0) + (answers[14] || 0) + 
                 (answers[18] || 0)) * 2;

  // Life satisfaction: questions 22-26
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
      if (score < 10) return { score, level: "Normal", message: "you are not depressed" };
      if (score < 14) return { score, level: "Mild", message: "You have mild depression" };
      if (score < 21) return { score, level: "Moderate", message: "you have moderate gloom" };
      if (score < 28) return { score, level: "Critical", message: "you have severe depression" };
      return { score, level: "Very Serious", message: "You have a severe depression" };
    
    case 'anxiety':
      if (score < 11) return { score, level: "Normal", message: "no anxiety" };
      if (score < 14) return { score, level: "Mild", message: "mild anxiety" };
      if (score < 21) return { score, level: "Medium", message: "moderate anxiety" };
      if (score < 28) return { score, level: "Critical", message: "severe anxiety" };
      return { score, level: "Very Serious", message: "Very severe anxiety" };
    
    case 'stress':
      if (score < 17) return { score, level: "Normal", message: "no pressure problem" };
      if (score < 21) return { score, level: "Mild", message: "and mildly compressed" };
      if (score < 29) return { score, level: "Medium", message: "and moderately compressed" };
      if (score < 38) return { score, level: "Critical", message: "and severe compression" };
      return { score, level: "Very Serious", message: "and has significant stress conditions" };
    
    case 'satisfaction':
      if (score < 14) return { score, level: "Very Unsatisfactory", message: "very dissatisfied with the whole life" };
      if (score < 20) return { score, level: "Unsatisfactory", message: "dissatisfied with the whole life" };
      if (score < 27) return { score, level: "Neutral", message: "neither satisfied nor dissatisfied with the whole life" };
      if (score < 33) return { score, level: "Satisfactory", message: "satisfied with the whole life" };
      return { score, level: "Very Satisfied", message: "very satisfied with the whole life" };
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
  const dassSeverity = getDassSeverity({ depressionLevel, anxietyLevel, stressLevel, satisfactionLevel });
  const isUnhappySatisfaction = satisfactionLevel.level === "Unsatisfactory" || 
                               satisfactionLevel.level === "Very Unsatisfactory";

  let moodStatus: string;
  let moodMessage: string;
  let iconType: 'frown' | 'meh' | 'smile' = 'meh';
  let iconColor = "text-yellow-500";

  // Keeping the exact same mood determination logic and messages
  if (dassSeverity === "Critical" || dassSeverity === "Very Serious" ||
      (dassSeverity === "Medium" && isUnhappySatisfaction)) {
    moodStatus = "Psychological Distress";
    moodMessage = `you are a very unhappy person. Your mental health is in a state of "psychological distress."`;
    iconType = "frown";
    iconColor = "text-red-500";
  } else if (dassSeverity === "Medium" ||
            (dassSeverity === "Mild" && isUnhappySatisfaction)) {
    moodStatus = "Subhealth Status";
    moodMessage = `you're a very unhappy person. Your mental health is subhealthy.`;
    iconType = "meh";
    iconColor = "text-yellow-500";
  } else if (dassSeverity === "Mild" ||
            (dassSeverity === "Normal" && isUnhappySatisfaction)) {
    moodStatus = "Moderate Subhealth Status";
    moodMessage = `you are a moderately unhappy person. Your mental health is subhealthy.`;
    iconType = "meh";
    iconColor = "text-orange-500";
  } else if (dassSeverity === "Normal" && satisfactionLevel.level === "Neutral") {
    moodStatus = "Upper-middle Subhealth Status";
    moodMessage = `you're a slightly unhappy person. Your mental health is subhealthier.`;
    iconType = "meh";
    iconColor = "text-blue-500";
  } else {
    moodStatus = "Health Status";
    moodMessage = `you're a happy person. You're happy with your life. Your mental health is "healthy."`;
    iconType = "smile";
    iconColor = "text-green-500";
  }

  const fullMessage = `Are you happy?\nYour psych evaluation shows that ${moodMessage}\n\nYou're ${satisfactionLevel.message}. ${depressionLevel.message}. You have ${anxietyLevel.message}. You are ${stressLevel.message}.`;

  return {
    mood: moodStatus,
    message: fullMessage,
    redirectUrl: "https://www.micancapital.au/courses-en",
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

const getDassSeverity = (levels: AssessmentLevels): SeverityLevel => {
  const severities = [
    levels.depressionLevel.level,
    levels.anxietyLevel.level,
    levels.stressLevel.level
  ].map(level => SEVERITY_WEIGHTS[level]);
  
  const maxSeverity = Math.max(...severities);
  
  return Object.entries(SEVERITY_WEIGHTS).find(([_, weight]) => weight === maxSeverity)?.[0] as SeverityLevel || "Normal";
};
