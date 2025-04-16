
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
        courseRecommendation: "Course: [Cantonese] Depression"
      };
      return {
        score,
        level: "Very Severe",
        message: "You have very severe depression",
        courseRecommendation: "Course: [Cantonese] Moodiness"
      };
    
    case 'anxiety':
      if (score < 11) return {
        score,
        level: "Normal",
        message: "No anxiety",
        courseRecommendation: "Course: [Cantonese] Brain, Mind, Life"
      };
      if (score < 14) return {
        score,
        level: "Mild",
        message: "Have mild anxiety",
        courseRecommendation: "Course: [Cantonese] Anxiety Panic"
      };
      if (score < 21) return {
        score,
        level: "Moderate",
        message: "Have moderate anxiety",
        courseRecommendation: "Course: [Cantonese] Anxiety Panic"
      };
      if (score < 28) return {
        score,
        level: "Severe",
        message: "Have severe anxiety",
        courseRecommendation: "Course: [Cantonese] Anxiety Panic"
      };
      return {
        score,
        level: "Very Severe",
        message: "Have very severe anxiety",
        courseRecommendation: "Course: [Cantonese] Anxiety Panic"
      };
    
    case 'stress':
      if (score < 17) return {
        score,
        level: "Normal",
        message: "No stress problem",
        courseRecommendation: "Course: [Cantonese] Brain, Mind, Life"
      };
      if (score < 21) return {
        score,
        level: "Mild",
        message: "There is a mild stress condition",
        courseRecommendation: "Course: 'Stress'! Increase your stress tolerance!"
      };
      if (score < 29) return {
        score,
        level: "Moderate",
        message: "With moderate stress",
        courseRecommendation: "Course: 'Stress'! Enhance stress resistance!"
      };
      if (score < 38) return {
        score,
        level: "Severe",
        message: "There is severe stress",
        courseRecommendation: "Course: 'Stress'! Increase stress tolerance!"
      };
      return {
        score,
        level: "Very Severe",
        message: "There is a very serious stress condition",
        courseRecommendation: "Course: 'Stress'! Increase your stress tolerance!"
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
    additionalCourses.push("Course: [Cantonese] The Way of Parenthood");
  }
  
  // Helper course recommendation
  if (answers[28] === 1) {
    additionalCourses.push("Course: [Cantonese] Brain, Psychology, Life, Self-worth, Anxiety, Panic, Depression");
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

  // Step 5: Determining Mental Health Status based on DASS severity and life satisfaction
  
  // Case 1: Severe/Very Severe DASS OR Moderate DASS with low satisfaction
  if (
    dassSeverity === "Severe" || 
    dassSeverity === "Very Severe" ||
    (dassSeverity === "Moderate" && isLowSatisfaction)
  ) {
    return {
      mood: "Mental Disturbance",
      message: "Your psychological assessment shows that you are experiencing significant mental distress.",
      redirectUrl: "https://www.micancapital.au/courses-en",
      iconType: "frown",
      iconColor: "text-red-500"
    };
  }

  // Case 2: Moderate DASS OR Mild DASS with low satisfaction
  if (
    dassSeverity === "Moderate" ||
    (dassSeverity === "Mild" && isLowSatisfaction)
  ) {
    return {
      mood: "Lower-Middle Sub-Health Status",
      message: "Your mental health shows signs of being in a lower sub-healthy state.",
      redirectUrl: "https://www.micancapital.au/courses-en",
      iconType: "meh",
      iconColor: "text-yellow-500"
    };
  }

  // Case 3: Mild DASS OR Normal DASS with low satisfaction
  if (
    dassSeverity === "Mild" ||
    (dassSeverity === "Normal" && isLowSatisfaction)
  ) {
    return {
      mood: "Sub-Health Status Medium",
      message: "Your mental health indicates a moderate sub-health condition.",
      redirectUrl: "https://www.micancapital.au/courses-en",
      iconType: "meh",
      iconColor: "text-blue-500"
    };
  }

  // Case 4: Normal DASS with neutral satisfaction
  if (
    dassSeverity === "Normal" && 
    satisfactionLevel.level === "Neutral"
  ) {
    return {
      mood: "Upper Asian Health State",
      message: "Your mental health shows signs of being in an upper sub-healthy state.",
      redirectUrl: "https://www.micancapital.au/courses-en",
      iconType: "meh",
      iconColor: "text-purple-500"
    };
  }

  // Case 5: Normal DASS with high satisfaction
  if (
    dassSeverity === "Normal" && 
    (satisfactionLevel.level === "Satisfied" || satisfactionLevel.level === "Very Satisfied")
  ) {
    return {
      mood: "Healthy",
      message: "Your mental health appears to be in a healthy state.",
      redirectUrl: "https://www.micancapital.au/courses-en",
      iconType: "smile",
      iconColor: "text-green-500"
    };
  }

  // Default fallback
  return {
    mood: "Sub-Health Status Medium",
    message: "Your mental health status requires attention.",
    redirectUrl: "https://www.micancapital.au/courses-en",
    iconType: "meh",
    iconColor: "text-blue-500"
  };
};
