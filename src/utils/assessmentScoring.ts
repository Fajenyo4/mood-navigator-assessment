
import { Smile, Meh, Frown } from "lucide-react";

export const calculateDassScores = (answers: { [key: number]: number }) => {
  const depression = ((answers[3] || 0) + (answers[5] || 0) + (answers[10] || 0) + 
                     (answers[13] || 0) + (answers[16] || 0) + (answers[17] || 0) + 
                     (answers[21] || 0)) * 2;

  const anxiety = ((answers[2] || 0) + (answers[4] || 0) + (answers[7] || 0) + 
                  (answers[9] || 0) + (answers[15] || 0) + (answers[19] || 0) + 
                  (answers[20] || 0)) * 2;

  const stress = ((answers[1] || 0) + (answers[6] || 0) + (answers[8] || 0) + 
                 (answers[11] || 0) + (answers[12] || 0) + (answers[14] || 0) + 
                 (answers[18] || 0)) * 2;

  const lifeSatisfaction = (answers[22] || 0) + (answers[23] || 0) + (answers[24] || 0) + 
                          (answers[25] || 0) + (answers[26] || 0);

  const overallMood = (answers[27] || 0) + (answers[28] || 0);

  return { depression, anxiety, stress, lifeSatisfaction, overallMood };
};

export const determineLevel = (score: number, type: 'depression' | 'anxiety' | 'stress' | 'satisfaction') => {
  switch (type) {
    case 'depression':
      if (score < 10) return "Normal";
      if (score < 14) return "Mild";
      if (score < 21) return "Moderate";
      if (score < 28) return "Severe";
      return "Very Severe";
    
    case 'anxiety':
      if (score < 11) return "Normal";
      if (score < 14) return "Mild";
      if (score < 21) return "Moderate";
      if (score < 28) return "Severe";
      return "Very Severe";
    
    case 'stress':
      if (score < 17) return "Normal";
      if (score < 21) return "Mild";
      if (score < 29) return "Moderate";
      if (score < 38) return "Severe";
      return "Very Severe";
    
    case 'satisfaction':
      if (score < 14) return "Very Dissatisfied";
      if (score < 20) return "Dissatisfied";
      if (score < 27) return "Neutral";
      if (score < 33) return "Satisfied";
      return "Very Satisfied";
    
    default:
      return "Normal";
  }
};

export type MoodResult = {
  mood: string;
  redirectUrl: string;
  iconType: 'frown' | 'meh' | 'smile';
  iconColor: string;
};

const getDassSeverity = (depressionLevel: string, anxietyLevel: string, stressLevel: string): string => {
  const levels = ["Normal", "Mild", "Moderate", "Severe", "Very Severe"];
  const severityMap = {
    "Normal": 0,
    "Mild": 1,
    "Moderate": 2,
    "Severe": 3,
    "Very Severe": 4
  };

  const maxSeverity = Math.max(
    severityMap[depressionLevel],
    severityMap[anxietyLevel],
    severityMap[stressLevel]
  );

  return levels[maxSeverity];
};

export const determineMoodResult = (
  depressionLevel: string,
  anxietyLevel: string,
  stressLevel: string,
  satisfactionLevel: string,
  overallMood: number
): MoodResult => {
  const dassSeverity = getDassSeverity(depressionLevel, anxietyLevel, stressLevel);
  const isLowSatisfaction = satisfactionLevel === "Very Dissatisfied" || satisfactionLevel === "Dissatisfied";

  if (
    dassSeverity === "Severe" || 
    dassSeverity === "Very Severe" ||
    (dassSeverity === "Moderate" && isLowSatisfaction)
  ) {
    return {
      mood: "Mental Disturbance",
      redirectUrl: "https://www.micancapital.au/courses-en",
      iconType: "frown",
      iconColor: "text-red-500"
    };
  }

  if (
    dassSeverity === "Moderate" ||
    (dassSeverity === "Mild" && isLowSatisfaction)
  ) {
    return {
      mood: "Lower-Middle Sub-Health Status",
      redirectUrl: "https://www.micancapital.au/courses-en",
      iconType: "meh",
      iconColor: "text-yellow-500"
    };
  }

  if (
    dassSeverity === "Mild" ||
    (dassSeverity === "Normal" && isLowSatisfaction)
  ) {
    return {
      mood: "Sub-Health Status Medium",
      redirectUrl: "https://www.micancapital.au/courses-en",
      iconType: "meh",
      iconColor: "text-blue-500"
    };
  }

  if (
    dassSeverity === "Normal" && 
    satisfactionLevel === "Neutral"
  ) {
    return {
      mood: "Upper Asian Health State",
      redirectUrl: "https://www.micancapital.au/courses-en",
      iconType: "meh",
      iconColor: "text-purple-500"
    };
  }

  if (
    dassSeverity === "Normal" && 
    (satisfactionLevel === "Satisfied" || satisfactionLevel === "Very Satisfied")
  ) {
    return {
      mood: "Healthy",
      redirectUrl: "https://www.micancapital.au/courses-en",
      iconType: "smile",
      iconColor: "text-green-500"
    };
  }

  // Default fallback
  return {
    mood: "Sub-Health Status Medium",
    redirectUrl: "https://www.micancapital.au/courses-en",
    iconType: "meh",
    iconColor: "text-blue-500"
  };
};
