
export interface AssessmentResult {
  score: number;
  level: string;
  message: string;
}

export const calculateDassScores = (answers: { [key: number]: number }) => {
  // Depression calculation using specific questions and multiplying by 2
  const depression = ((answers[3] || 0) + (answers[5] || 0) + (answers[10] || 0) + 
                     (answers[13] || 0) + (answers[16] || 0) + (answers[17] || 0) + 
                     (answers[21] || 0)) * 2;

  // Anxiety calculation using specific questions and multiplying by 2
  const anxiety = ((answers[2] || 0) + (answers[4] || 0) + (answers[7] || 0) + 
                  (answers[9] || 0) + (answers[15] || 0) + (answers[19] || 0) + 
                  (answers[20] || 0)) * 2;

  // Stress calculation using specific questions and multiplying by 2
  const stress = ((answers[1] || 0) + (answers[6] || 0) + (answers[8] || 0) + 
                 (answers[11] || 0) + (answers[12] || 0) + (answers[14] || 0) + 
                 (answers[18] || 0)) * 2;

  // Life satisfaction calculation
  const lifeSatisfaction = (answers[22] || 0) + (answers[23] || 0) + (answers[24] || 0) + 
                           (answers[25] || 0) + (answers[26] || 0);

  // Parent and help questions
  const isParent = answers[27] || 0;
  const needsHelp = answers[28] || 0;

  return { 
    depression, 
    anxiety, 
    stress, 
    lifeSatisfaction, 
    isParent,
    needsHelp
  };
};

export const determineLevel = (score: number, type: 'depression' | 'anxiety' | 'stress' | 'satisfaction'): AssessmentResult => {
  switch (type) {
    case 'depression':
      if (score < 10) return {
        score,
        level: "Normal",
        message: "you are not depressed"
      };
      if (score < 14) return {
        score,
        level: "Mild",
        message: "You have mild depression"
      };
      if (score < 21) return {
        score,
        level: "Moderate",
        message: "you have moderate gloom"
      };
      if (score < 28) return {
        score,
        level: "Critical",
        message: "you have severe depression"
      };
      return {
        score,
        level: "Very Serious",
        message: "You have a severe depression"
      };
    
    case 'anxiety':
      if (score < 11) return {
        score,
        level: "Normal",
        message: "no anxiety"
      };
      if (score < 14) return {
        score,
        level: "Mild",
        message: "mild anxiety"
      };
      if (score < 21) return {
        score,
        level: "Medium",
        message: "moderate anxiety"
      };
      if (score < 28) return {
        score,
        level: "Critical",
        message: "severe anxiety"
      };
      return {
        score,
        level: "Very Serious",
        message: "Very severe anxiety"
      };
    
    case 'stress':
      if (score < 17) return {
        score,
        level: "Normal",
        message: "no pressure problem"
      };
      if (score < 21) return {
        score,
        level: "Mild",
        message: "and mildly compressed"
      };
      if (score < 29) return {
        score,
        level: "Medium",
        message: "and moderately compressed"
      };
      if (score < 38) return {
        score,
        level: "Critical",
        message: "and severe compression"
      };
      return {
        score,
        level: "Very Serious",
        message: "and has significant stress conditions"
      };
    
    case 'satisfaction':
      if (score < 14) return {
        score,
        level: "Very Unsatisfactory",
        message: "very dissatisfied with the whole life"
      };
      if (score < 20) return {
        score,
        level: "Unsatisfactory",
        message: "dissatisfied with the whole life"
      };
      if (score < 27) return {
        score,
        level: "Neutral",
        message: "neither satisfied nor dissatisfied with the whole life"
      };
      if (score < 33) return {
        score,
        level: "Satisfactory",
        message: "satisfied with the whole life"
      };
      return {
        score,
        level: "Very Satisfied",
        message: "very satisfied with the whole life"
      };
    
    default:
      return {
        score,
        level: "Normal",
        message: "Normal levels"
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
  isParent?: number;
  needsHelp?: number;
};

const getDassSeverity = (depressionLevel: AssessmentResult, anxietyLevel: AssessmentResult, stressLevel: AssessmentResult): string => {
  // Map the DASS levels to numerical severity for comparison
  const severityMap: Record<string, number> = {
    "Normal": 0,
    "Mild": 1,
    "Medium": 2,
    "Moderate": 2, // Same as Medium
    "Critical": 3,
    "Severe": 3, // Same as Critical
    "Very Serious": 4,
    "Very Severe": 4 // Same as Very Serious
  };

  // Find the maximum severity level
  const maxSeverity = Math.max(
    severityMap[depressionLevel.level],
    severityMap[anxietyLevel.level],
    severityMap[stressLevel.level]
  );

  // Convert back to string representation
  const severityLevels = ["Normal", "Mild", "Medium", "Critical", "Very Serious"];
  return severityLevels[maxSeverity];
};

export const determineMoodResult = (
  depressionLevel: AssessmentResult,
  anxietyLevel: AssessmentResult,
  stressLevel: AssessmentResult,
  satisfactionLevel: AssessmentResult,
  isParent: number,
  needsHelp: number
): MoodResult => {
  const dassSeverity = getDassSeverity(depressionLevel, anxietyLevel, stressLevel);
  const isUnhappySatisfaction = satisfactionLevel.level === "Unsatisfactory" || satisfactionLevel.level === "Very Unsatisfactory";

  // Determine mental health status based on DASS severity and life satisfaction
  let moodStatus = "";
  let moodMessage = `Are you happy?\nYour psych evaluation shows that `;
  let iconType: 'frown' | 'meh' | 'smile' = 'meh';
  let iconColor = "text-yellow-500";
  
  // Case 1: Critical/Very Serious DASS OR Medium DASS with unsatisfactory life satisfaction
  if (
    dassSeverity === "Critical" || 
    dassSeverity === "Very Serious" ||
    (dassSeverity === "Medium" && isUnhappySatisfaction)
  ) {
    moodStatus = "Psychological Distress";
    moodMessage += `you are a very unhappy person. Your mental health is in a state of "psychological distress."`;
    iconType = "frown";
    iconColor = "text-red-500";
  }
  // Case 2: Medium DASS OR Mild DASS with unsatisfactory life satisfaction
  else if (
    dassSeverity === "Medium" ||
    (dassSeverity === "Mild" && isUnhappySatisfaction)
  ) {
    moodStatus = "Subhealth Status";
    moodMessage += `you're a very unhappy person. Your mental health is subhealthy.`;
    iconType = "meh";
    iconColor = "text-yellow-500";
  }
  // Case 3: Mild DASS OR Normal DASS with unsatisfactory life satisfaction
  else if (
    dassSeverity === "Mild" ||
    (dassSeverity === "Normal" && isUnhappySatisfaction)
  ) {
    moodStatus = "Moderate Subhealth Status";
    moodMessage += `you are a moderately unhappy person. Your mental health is subhealthy.`;
    iconType = "meh";
    iconColor = "text-orange-500";
  }
  // Case 4: Normal DASS with neutral satisfaction
  else if (
    dassSeverity === "Normal" && 
    satisfactionLevel.level === "Neutral"
  ) {
    moodStatus = "Upper-middle Subhealth Status";
    moodMessage += `you're a slightly unhappy person. Your mental health is subhealthier.`;
    iconType = "meh";
    iconColor = "text-blue-500";
  }
  // Case 5: Normal DASS with high satisfaction
  else if (
    dassSeverity === "Normal" && 
    (satisfactionLevel.level === "Satisfactory" || satisfactionLevel.level === "Very Satisfied")
  ) {
    moodStatus = "Health Status";
    moodMessage += `you're a happy person. You're happy with your life. Your mental health is "healthy."`;
    iconType = "smile";
    iconColor = "text-green-500";
  }
  
  // Add specific assessments to the message
  moodMessage += `\n\nYou're ${satisfactionLevel.message}. ${depressionLevel.message}. You have ${anxietyLevel.message}. You are ${stressLevel.message}.`;
  
  return {
    mood: moodStatus,
    message: moodMessage,
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
