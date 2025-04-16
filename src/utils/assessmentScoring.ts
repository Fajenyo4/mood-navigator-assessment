
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
        message: "You are not depressed",
        courseRecommendation: "Course: [Cantonese] Brain, Mind, Life"
      };
      if (score < 14) return {
        score,
        level: "Mild",
        message: "You have mild depression",
        courseRecommendation: "Course: [Cantonese] Emotional Depression"
      };
      if (score < 21) return {
        score,
        level: "Moderate",
        message: "You have moderate depression",
        courseRecommendation: "Course: [Cantonese] Emotional Depression"
      };
      if (score < 28) return {
        score,
        level: "Severe",
        message: "You have severe depression",
        courseRecommendation: "Course: [Cantonese] Emotional Depression"
      };
      return {
        score,
        level: "Very Severe",
        message: "You have very severe depression",
        courseRecommendation: "Course: [Cantonese] Emotional Depression"
      };
    
    case 'satisfaction':
      if (score < 14) return {
        score,
        level: "Very Dissatisfied",
        message: "Very dissatisfied with life",
        courseRecommendation: "Course: [Cantonese] Self-worth"
      };
      if (score < 20) return {
        score,
        level: "Dissatisfied",
        message: "Dissatisfied with life",
        courseRecommendation: "Course: [Cantonese] Self-worth"
      };
      if (score < 27) return {
        score,
        level: "Neutral",
        message: "Neutral level of satisfaction",
        courseRecommendation: "Course: [Cantonese] Self-worth"
      };
      if (score < 33) return {
        score,
        level: "Satisfied",
        message: "Satisfied with life",
        courseRecommendation: "Course: [Cantonese] Brain, Mind, Life"
      };
      return {
        score,
        level: "Very Satisfied",
        message: "Feel very satisfied with life",
        courseRecommendation: "Course: [Cantonese] Brain, Mind, Life"
      };
    
    case 'anxiety':
      if (score < 11) return {
        score,
        level: "Normal",
        message: "Normal anxiety levels",
        courseRecommendation: "Course: [Cantonese] Brain, Mind, Life"
      };
      if (score < 14) return {
        score,
        level: "Mild",
        message: "Mild anxiety levels",
        courseRecommendation: "Course: [Cantonese] Emotional Depression"
      };
      if (score < 21) return {
        score,
        level: "Moderate",
        message: "Moderate anxiety levels",
        courseRecommendation: "Course: [Cantonese] Emotional Depression"
      };
      if (score < 28) return {
        score,
        level: "Severe",
        message: "Severe anxiety levels",
        courseRecommendation: "Course: [Cantonese] Emotional Depression"
      };
      return {
        score,
        level: "Very Severe",
        message: "Very severe anxiety levels",
        courseRecommendation: "Course: [Cantonese] Emotional Depression"
      };
    
    case 'stress':
      if (score < 17) return {
        score,
        level: "Normal",
        message: "Normal stress levels",
        courseRecommendation: "Course: [Cantonese] Brain, Mind, Life"
      };
      if (score < 21) return {
        score,
        level: "Mild",
        message: "Mild stress levels",
        courseRecommendation: "Course: [Cantonese] Emotional Depression"
      };
      if (score < 29) return {
        score,
        level: "Moderate",
        message: "Moderate stress levels",
        courseRecommendation: "Course: [Cantonese] Emotional Depression"
      };
      if (score < 38) return {
        score,
        level: "Severe",
        message: "Severe stress levels",
        courseRecommendation: "Course: [Cantonese] Emotional Depression"
      };
      return {
        score,
        level: "Very Severe",
        message: "Very severe stress levels",
        courseRecommendation: "Course: [Cantonese] Emotional Depression"
      };
    
    default:
      return {
        score,
        level: "Normal",
        message: "Normal levels",
        courseRecommendation: "Course: [Cantonese] Brain, Mind, Life"
      };
  }
};

export type MoodResult = {
  mood: string;
  message: string;
  redirectUrl: string;
  iconType: 'frown' | 'meh' | 'smile';
  iconColor: string;
  courseRecommendation: string;
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

export const determineMoodResult = (
  depressionLevel: AssessmentResult,
  anxietyLevel: AssessmentResult,
  stressLevel: AssessmentResult,
  satisfactionLevel: AssessmentResult,
  overallMood: number
): MoodResult => {
  const dassSeverity = getDassSeverity(depressionLevel, anxietyLevel, stressLevel);
  const isLowSatisfaction = satisfactionLevel.level === "Very Dissatisfied" || satisfactionLevel.level === "Dissatisfied";

  if (
    dassSeverity === "Severe" || 
    dassSeverity === "Very Severe" ||
    (dassSeverity === "Moderate" && isLowSatisfaction)
  ) {
    return {
      mood: "Mental Disturbance",
      message: "You are a very unhappy person. Your mental health is in the 'Mental Disturbance' state.",
      redirectUrl: "https://www.micancapital.au/courses-en",
      iconType: "frown",
      iconColor: "text-red-500",
      courseRecommendation: "Course: [Cantonese] Emotional Depression"
    };
  }

  if (
    dassSeverity === "Moderate" ||
    (dassSeverity === "Mild" && isLowSatisfaction)
  ) {
    return {
      mood: "Lower-Middle Sub-Health Status",
      message: "You are a very unhappy person. Your mental health is 'Lower Sub-Healthy'.",
      redirectUrl: "https://www.micancapital.au/courses-en",
      iconType: "meh",
      iconColor: "text-yellow-500",
      courseRecommendation: "Course: [Cantonese] Self-worth"
    };
  }

  if (
    dassSeverity === "Mild" ||
    (dassSeverity === "Normal" && isLowSatisfaction)
  ) {
    return {
      mood: "Sub-Health Status Medium",
      message: "You are a moderately unhappy person. Your mental health is 'Moderate Sub-Health'.",
      redirectUrl: "https://www.micancapital.au/courses-en",
      iconType: "meh",
      iconColor: "text-blue-500",
      courseRecommendation: "Course: [Cantonese] Self-worth"
    };
  }

  if (
    dassSeverity === "Normal" && 
    satisfactionLevel.level === "Neutral"
  ) {
    return {
      mood: "Upper Asian Health State",
      message: "You are a mildly unhappy person. Your mental health is 'Upper Sub-Healthy'.",
      redirectUrl: "https://www.micancapital.au/courses-en",
      iconType: "meh",
      iconColor: "text-purple-500",
      courseRecommendation: "Course: [Cantonese] Brain, Mind, Life"
    };
  }

  if (
    dassSeverity === "Normal" && 
    (satisfactionLevel.level === "Satisfied" || satisfactionLevel.level === "Very Satisfied")
  ) {
    return {
      mood: "Healthy",
      message: "You are a happy person and you are satisfied with your life. Your mental health is in a 'healthy state'.",
      redirectUrl: "https://www.micancapital.au/courses-en",
      iconType: "smile",
      iconColor: "text-green-500",
      courseRecommendation: "Course: [Cantonese] Brain, Mind, Life"
    };
  }

  // Default fallback
  return {
    mood: "Sub-Health Status Medium",
    message: "Your mental health status requires attention.",
    redirectUrl: "https://www.micancapital.au/courses-en",
    iconType: "meh",
    iconColor: "text-blue-500",
    courseRecommendation: "Course: [Cantonese] Self-worth"
  };
};
