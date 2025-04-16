
import { Smile, Meh, Frown } from "lucide-react";

export interface AssessmentResult {
  score: number;
  level: string;
  message: string;
  courseRecommendation: string;
}

export const calculateDassScores = (answers: { [key: number]: number }) => {
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

  // Life satisfaction calculation (q22-q26)
  const lifeSatisfaction = (answers[22] || 0) + (answers[23] || 0) + (answers[24] || 0) + 
                          (answers[25] || 0) + (answers[26] || 0);

  const overallMood = (answers[27] || 0) + (answers[28] || 0);

  return { depression, anxiety, stress, lifeSatisfaction, overallMood };
};

export const determineLevel = (score: number, type: 'depression' | 'anxiety' | 'stress' | 'satisfaction'): AssessmentResult => {
  switch (type) {
    case 'depression':
      if (score < 10) return {
        score,
        level: "Normal",
        message: "You don't have depressive symptoms",
        courseRecommendation: "Course: Brain, Psychology, Life"
      };
      if (score < 14) return {
        score,
        level: "Mild",
        message: "You have mild depressive symptoms",
        courseRecommendation: "Course: Managing Depression"
      };
      if (score < 21) return {
        score,
        level: "Moderate",
        message: "You have moderate depressive symptoms",
        courseRecommendation: "Course: Managing Depression"
      };
      if (score < 28) return {
        score,
        level: "Severe",
        message: "You have severe depressive symptoms",
        courseRecommendation: "Course: Managing Depression"
      };
      return {
        score,
        level: "Very Severe",
        message: "You have very severe depressive symptoms",
        courseRecommendation: "Course: Managing Depression"
      };
    
    case 'anxiety':
      if (score < 11) return {
        score,
        level: "Normal",
        message: "No anxiety symptoms",
        courseRecommendation: "Course: Brain, Psychology, Life"
      };
      if (score < 14) return {
        score,
        level: "Mild",
        message: "Mild anxiety symptoms",
        courseRecommendation: "Course: Anxiety & Panic Management"
      };
      if (score < 21) return {
        score,
        level: "Moderate",
        message: "Moderate anxiety symptoms",
        courseRecommendation: "Course: Anxiety & Panic Management"
      };
      if (score < 28) return {
        score,
        level: "Severe",
        message: "Severe anxiety symptoms",
        courseRecommendation: "Course: Anxiety & Panic Management"
      };
      return {
        score,
        level: "Very Severe",
        message: "Very severe anxiety symptoms",
        courseRecommendation: "Course: Anxiety & Panic Management"
      };
    
    case 'stress':
      if (score < 17) return {
        score,
        level: "Normal",
        message: "No stress issues",
        courseRecommendation: "Course: Brain, Psychology, Life"
      };
      if (score < 21) return {
        score,
        level: "Mild",
        message: "Mild stress levels",
        courseRecommendation: "Course: Stress Management & Resilience"
      };
      if (score < 29) return {
        score,
        level: "Moderate",
        message: "Moderate stress levels",
        courseRecommendation: "Course: Stress Management & Resilience"
      };
      if (score < 38) return {
        score,
        level: "Severe",
        message: "Severe stress levels",
        courseRecommendation: "Course: Stress Management & Resilience"
      };
      return {
        score,
        level: "Very Severe",
        message: "Very severe stress levels",
        courseRecommendation: "Course: Stress Management & Resilience"
      };
    
    case 'satisfaction':
      if (score < 14) return {
        score,
        level: "Very Dissatisfied",
        message: "feel very dissatisfied",
        courseRecommendation: "Course: Self-Worth & Value"
      };
      if (score < 20) return {
        score,
        level: "Dissatisfied",
        message: "feel dissatisfied",
        courseRecommendation: "Course: Self-Worth & Value"
      };
      if (score < 27) return {
        score,
        level: "Neutral",
        message: "have neutral satisfaction levels",
        courseRecommendation: "Course: Self-Worth & Value"
      };
      if (score < 33) return {
        score,
        level: "Satisfied",
        message: "feel satisfied",
        courseRecommendation: "Course: Brain, Psychology, Life"
      };
      return {
        score,
        level: "Very Satisfied",
        message: "feel very satisfied",
        courseRecommendation: "Course: Brain, Psychology, Life"
      };
    
    default:
      return {
        score,
        level: "Normal",
        message: "Normal levels",
        courseRecommendation: "Course: Brain, Psychology, Life"
      };
  }
};

export type MoodResult = {
  mood: string;
  message: string;
  redirectUrl: string;
  iconType: 'frown' | 'meh' | 'smile';
  iconColor: string;
  depressionResult?: AssessmentResult;
  anxietyResult?: AssessmentResult;
  stressResult?: AssessmentResult;
  satisfactionResult?: AssessmentResult;
};

const getDassSeverity = (depressionLevel: AssessmentResult, anxietyLevel: AssessmentResult, stressLevel: AssessmentResult): string => {
  const levels = ["Normal", "Mild", "Moderate", "Severe", "Very Severe"];
  const severityMap: Record<string, number> = {
    "Normal": 0,
    "Mild": 1,
    "Moderate": 2,
    "Severe": 3,
    "Very Severe": 4
  };

  const maxSeverity = Math.max(
    severityMap[depressionLevel.level],
    severityMap[anxietyLevel.level],
    severityMap[stressLevel.level]
  );

  return levels[maxSeverity];
};

export const getAdditionalCourses = (answers: { [key: number]: number }): string[] => {
  const additionalCourses: string[] = [];
  
  // Parent course recommendation
  if (answers[27] === 1) {
    additionalCourses.push("Course: Parenting Skills");
  }
  
  // Helper course recommendation
  if (answers[28] === 1) {
    additionalCourses.push("Course: Brain, Psychology, Life, Self-Worth, Anxiety Management, Depression Management");
  }
  
  return additionalCourses;
};

export const determineMoodResult = (
  depressionLevel: AssessmentResult,
  anxietyLevel: AssessmentResult,
  stressLevel: AssessmentResult,
  satisfactionLevel: AssessmentResult,
  overallMood: number
): MoodResult => {
  const dassSeverity = getDassSeverity(depressionLevel, anxietyLevel, stressLevel);
  const isLowSatisfaction = satisfactionLevel.level === "Very Dissatisfied" || satisfactionLevel.level === "Dissatisfied";

  // Determining Mental Health Status based on DASS severity and life satisfaction
  let moodStatus = "";
  let moodMessage = "How happy are you?\nYour mental health assessment shows that ";
  let iconType: 'frown' | 'meh' | 'smile' = 'meh';
  let iconColor = "text-yellow-500";
  
  // Case 1: Severe/Very Severe DASS OR Moderate DASS with low satisfaction
  if (
    dassSeverity === "Severe" || 
    dassSeverity === "Very Severe" ||
    (dassSeverity === "Moderate" && isLowSatisfaction)
  ) {
    moodStatus = "Psychological Disturbance";
    moodMessage += "you are a very unhappy person. Your mental health status is in a \"Psychological Disturbance\" state.";
    iconType = "frown";
    iconColor = "text-red-500";
  }
  // Case 2: Moderate DASS OR Mild DASS with low satisfaction
  else if (
    dassSeverity === "Moderate" ||
    (dassSeverity === "Mild" && isLowSatisfaction)
  ) {
    moodStatus = "Medium-to-Low Sub-Health Status";
    moodMessage += "you are a very unhappy person. Your mental health status is in a \"Medium-to-Low Sub-Health Status\".";
    iconType = "meh";
    iconColor = "text-yellow-500";
  }
  // Case 3: Mild DASS OR Normal DASS with low satisfaction
  else if (
    dassSeverity === "Mild" ||
    (dassSeverity === "Normal" && isLowSatisfaction)
  ) {
    moodStatus = "Moderate Sub-Health Status";
    moodMessage += "you are moderately unhappy. Your mental health status is in a \"Moderate Sub-Health Status\".";
    iconType = "meh";
    iconColor = "text-blue-500";
  }
  // Case 4: Normal DASS with neutral satisfaction
  else if (
    dassSeverity === "Normal" && 
    satisfactionLevel.level === "Neutral"
  ) {
    moodStatus = "Medium to High Sub-Health Status";
    moodMessage += "you are slightly unhappy. Your mental health status is in a \"Medium to High Sub-Health Status\".";
    iconType = "meh";
    iconColor = "text-purple-500";
  }
  // Case 5: Normal DASS with high satisfaction
  else if (
    dassSeverity === "Normal" && 
    (satisfactionLevel.level === "Satisfied" || satisfactionLevel.level === "Very Satisfied")
  ) {
    moodStatus = "Healthy Status";
    moodMessage += "you are a happy person who is satisfied with your current life. Your mental health status is in a \"Healthy Status\".";
    iconType = "smile";
    iconColor = "text-green-500";
  }
  
  // Add detailed assessment results to the message
  moodMessage += `\nYou ${satisfactionLevel.message} with your overall life. ${depressionLevel.message}. ${anxietyLevel.message}. ${stressLevel.message}.`;
  
  return {
    mood: moodStatus,
    message: moodMessage,
    redirectUrl: "https://www.micancapital.au/courses-en",
    iconType,
    iconColor,
    depressionResult: depressionLevel,
    anxietyResult: anxietyLevel,
    stressResult: stressLevel,
    satisfactionResult: satisfactionLevel
  };
};
