
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
      if (score >= 28) return "Extremely Severe";
      if (score >= 21) return "Severe";
      if (score >= 14) return "Moderate";
      if (score >= 10) return "Mild";
      return "Normal";
    
    case 'anxiety':
      if (score >= 20) return "Extremely Severe";
      if (score >= 15) return "Severe";
      if (score >= 10) return "Moderate";
      if (score >= 8) return "Mild";
      return "Normal";
    
    case 'stress':
      if (score >= 34) return "Extremely Severe";
      if (score >= 26) return "Severe";
      if (score >= 19) return "Moderate";
      if (score >= 15) return "Mild";
      return "Normal";
    
    case 'satisfaction':
      if (score <= 9) return "Extremely Dissatisfied";
      if (score <= 14) return "Dissatisfied";
      if (score <= 19) return "Slightly Dissatisfied";
      if (score <= 25) return "Neutral";
      if (score <= 29) return "Slightly Satisfied";
      if (score <= 34) return "Satisfied";
      return "Extremely Satisfied";
    
    default:
      return "Normal";
  }
};

export const determineMoodResult = (
  depressionLevel: string,
  anxietyLevel: string,
  stressLevel: string,
  satisfactionLevel: string,
  overallMood: number
) => {
  if (
    depressionLevel === "Extremely Severe" || 
    anxietyLevel === "Extremely Severe" || 
    stressLevel === "Extremely Severe"
  ) {
    return {
      mood: "Severe Psychological Distress",
      redirectUrl: "https://www.micancapital.au/courses-en",
      icon: <Frown className="w-12 h-12 text-red-500" />
    };
  } 
  
  if (
    depressionLevel === "Severe" || 
    anxietyLevel === "Severe" || 
    stressLevel === "Severe"
  ) {
    return {
      mood: "Psychological Distress",
      redirectUrl: "https://www.micancapital.au/courses-en",
      icon: <Frown className="w-12 h-12 text-orange-500" />
    };
  } 
  
  if (
    depressionLevel === "Moderate" || 
    anxietyLevel === "Moderate" || 
    stressLevel === "Moderate" || 
    satisfactionLevel === "Dissatisfied" || 
    satisfactionLevel === "Extremely Dissatisfied"
  ) {
    return {
      mood: "Moderate Subhealth",
      redirectUrl: "https://www.micancapital.au/courses-en",
      icon: <Meh className="w-12 h-12 text-yellow-500" />
    };
  } 
  
  if (
    depressionLevel === "Mild" || 
    anxietyLevel === "Mild" || 
    stressLevel === "Mild" || 
    satisfactionLevel === "Slightly Dissatisfied"
  ) {
    return {
      mood: "Mild Subhealth",
      redirectUrl: "https://www.micancapital.au/courses-en",
      icon: <Meh className="w-12 h-12 text-blue-500" />
    };
  } 
  
  if (overallMood <= 2) {
    return {
      mood: "Low Mood",
      redirectUrl: "https://www.micancapital.au/courses-en",
      icon: <Meh className="w-12 h-12 text-purple-500" />
    };
  } 
  
  return {
    mood: "Healthy",
    redirectUrl: "https://www.micancapital.au/courses-en",
    icon: <Smile className="w-12 h-12 text-green-500" />
  };
};
