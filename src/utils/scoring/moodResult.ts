
import { AssessmentResult, MoodResult, SeverityLevel } from './types';
import { generateAssessmentText } from './textGeneration';

/**
 * Helper function to get highest severity rank from DASS scores
 */
const getHighestSeverityRank = (
  depressionLevel: AssessmentResult,
  anxietyLevel: AssessmentResult,
  stressLevel: AssessmentResult
): number => {
  return Math.max(
    depressionLevel.rank,
    anxietyLevel.rank,
    stressLevel.rank
  );
};

/**
 * Determine mental health status based on DASS rank and life satisfaction rank
 */
const getMentalHealthStatus = (
  dassRank: number,
  lsRank: number
): string => {
  console.log(`Calculating mental health status with DASS rank: ${dassRank}, LS rank: ${lsRank}`);
  
  // "Extremely Unhappy" condition
  if (dassRank >= 4 || (dassRank === 3 && lsRank <= 2)) {
    return "Psychological Disturbance"; // "Extremely Unhappy"
  } 
  // "Very Unhappy" condition
  else if (dassRank === 3 || (dassRank === 2 && lsRank <= 2)) {
    return "Medium-to-Low Sub-Health Status"; // "Very Unhappy"
  } 
  // "Moderately Unhappy" condition
  else if (dassRank === 2 || (dassRank === 1 && lsRank <= 2)) {
    return "Moderate Sub-Health Status"; // "Moderately Unhappy"
  } 
  // "Slightly Unhappy" condition
  else if (dassRank === 1 && lsRank === 3) {
    return "Medium to High Sub-Health Status"; // "Slightly Unhappy"
  } 
  // "Happy" condition
  else { // dassRank === 1 && lsRank >= 4
    return "Healthy"; // "Happy"
  }
};

/**
 * Determine final mood result based on assessment results
 */
export const determineMoodResult = (
  depressionLevel: AssessmentResult,
  anxietyLevel: AssessmentResult,
  stressLevel: AssessmentResult,
  satisfactionLevel: AssessmentResult,
  isParent: number,
  needsHelp: number,
  language: string = 'en'
): MoodResult => {
  console.log("Determining mood result with levels:", {
    depressionLevel,
    anxietyLevel,
    stressLevel,
    satisfactionLevel,
    isParent,
    needsHelp,
    language
  });
  
  // Determine overall DASS severity rank (highest of the three)
  const dassRank = getHighestSeverityRank(
    depressionLevel,
    anxietyLevel,
    stressLevel
  );
  
  // Get satisfaction rank
  const lsRank = satisfactionLevel.rank;
  console.log(`DASS rank: ${dassRank}, Satisfaction rank: ${lsRank}`);
  
  // Determine final mental health status based on DASS rank and satisfaction rank
  const moodStatus = getMentalHealthStatus(dassRank, lsRank);
  console.log(`Determined mood status: ${moodStatus}`);
  
  let moodMessage = "";
  let iconType: 'frown' | 'meh' | 'smile' = 'meh';
  let iconColor = "text-yellow-500";

  // Set message and icon based on mood status
  if (moodStatus === "Psychological Disturbance") { // "Extremely Unhappy"
    moodMessage = "You are experiencing significant psychological distress.";
    iconType = "frown";
    iconColor = "text-red-500";
  } else if (moodStatus === "Medium-to-Low Sub-Health Status") { // "Very Unhappy"
    moodMessage = "You are experiencing a mild psychological disturbance.";
    iconType = "frown";
    iconColor = "text-orange-500";
  } else if (moodStatus === "Moderate Sub-Health Status") { // "Moderately Unhappy"
    moodMessage = "You are experiencing a moderate sub-health status.";
    iconType = "meh";
    iconColor = "text-yellow-500";
  } else if (moodStatus === "Medium to High Sub-Health Status") { // "Slightly Unhappy"
    moodMessage = "You are experiencing a medium to high sub-health status.";
    iconType = "meh";
    iconColor = "text-blue-500";
  } else { // Healthy - "Happy"
    moodMessage = "You are in a healthy mental state.";
    iconType = "smile";
    iconColor = "text-green-500";
  }

  const fullMessage = `Mental Health Status: ${moodStatus}\n\n${moodMessage}\n\nDetailed Analysis:\nDepression: ${depressionLevel.level} (${depressionLevel.score})\nAnxiety: ${anxietyLevel.level} (${anxietyLevel.score})\nStress: ${stressLevel.level} (${stressLevel.score})\nLife Satisfaction: ${satisfactionLevel.level} (${satisfactionLevel.score})`;

  // Generate assessment text in Chinese only for Chinese language assessments
  const assessmentText = language.startsWith('zh') 
    ? generateAssessmentText(
        moodStatus,
        satisfactionLevel.level,
        depressionLevel.level,
        anxietyLevel.level,
        stressLevel.level,
        language
      )
    : '';

  const result = {
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
    needsHelp,
    assessmentText
  };
  
  console.log("Final mood result object:", result);
  return result;
};
