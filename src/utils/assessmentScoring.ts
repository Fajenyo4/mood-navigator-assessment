
import { AssessmentResult, AssessmentType, DassScores, SeverityLevel, AssessmentLevels, MoodResult } from './scoring/types';

// Object to map severity levels to numeric ranks (1-5)
export const SEVERITY_RANKS: Record<SeverityLevel, number> = {
  "Normal": 1,
  "Mild": 2,
  "Moderate": 3,
  "Severe": 4,
  "Very Severe": 5,
  "Very dissatisfied": 1,
  "Dissatisfied": 2,
  "Neutral": 3,
  "Satisfied": 4,
  "Very Satisfied": 5
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
      if (score < 10) return { score, level: "Normal", message: "normal", rank: 1 };
      if (score < 14) return { score, level: "Mild", message: "mild", rank: 2 };
      if (score < 21) return { score, level: "Moderate", message: "moderate", rank: 3 };
      if (score < 28) return { score, level: "Severe", message: "severe", rank: 4 };
      return { score, level: "Very Severe", message: "very severe", rank: 5 };
    
    case 'anxiety':
      if (score < 11) return { score, level: "Normal", message: "normal", rank: 1 };
      if (score < 14) return { score, level: "Mild", message: "mild", rank: 2 };
      if (score < 21) return { score, level: "Moderate", message: "moderate", rank: 3 };
      if (score < 28) return { score, level: "Severe", message: "severe", rank: 4 };
      return { score, level: "Very Severe", message: "very severe", rank: 5 };
    
    case 'stress':
      if (score < 17) return { score, level: "Normal", message: "normal", rank: 1 };
      if (score < 21) return { score, level: "Mild", message: "mild", rank: 2 };
      if (score < 29) return { score, level: "Moderate", message: "moderate", rank: 3 };
      if (score < 38) return { score, level: "Severe", message: "severe", rank: 4 };
      return { score, level: "Very Severe", message: "very severe", rank: 5 };
    
    case 'satisfaction':
      if (score < 14) return { score, level: "Very dissatisfied", message: "very dissatisfied", rank: 1 };
      if (score < 20) return { score, level: "Dissatisfied", message: "dissatisfied", rank: 2 };
      if (score < 27) return { score, level: "Neutral", message: "neutral", rank: 3 };
      if (score < 33) return { score, level: "Satisfied", message: "satisfied", rank: 4 };
      return { score, level: "Very Satisfied", message: "very satisfied", rank: 5 };
  }
};

// Helper functions for chart visualization
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

// Function to generate assessment text based on conditions
export const generateAssessmentText = (
  mentalHealthStatus: string,
  lifeSatisfactionLevel: SeverityLevel,
  depressionLevel: SeverityLevel,
  anxietyLevel: SeverityLevel,
  stressLevel: SeverityLevel,
  language: string = 'zh-CN'
): string => {
  // Only generate Chinese text for Chinese language assessments
  if (!language.startsWith('zh')) {
    return '';
  }
  
  let output = "你開心嗎？\n\n";
  
  output += "你的心理評估顯示，";
  
  if (mentalHealthStatus === "Psychological Disturbance") {
    output += "你是一個非常不開心的人。你的精神心理健康屬於心理困擾狀態。\n\n";
  } else if (mentalHealthStatus === "Medium-to-Low Sub-Health Status") {
    output += "你是一個很不開心的人。你的精神心理健康屬於亞健康狀態中下。\n\n";
  } else if (mentalHealthStatus === "Moderate Sub-Health Status") {
    output += "你是一個中度不開心的人。你的精神心理健康屬於亞健康狀態中等。\n\n";
  } else if (mentalHealthStatus === "Medium to High Sub-Health Status") {
    output += "你是一個輕微不開心的人。你的精神心理健康屬於亞健康狀態中上。\n\n";
  } else if (mentalHealthStatus === "Healthy") {
    output += "你是一個開心的人，你滿意現在的生活。你的精神心理健康屬於健康狀態。\n\n";
  }
  
  // Life satisfaction
  output += "你對整體生活";
  
  if (lifeSatisfactionLevel === "Very dissatisfied") {
    output += "感到非常不滿。";
  } else if (lifeSatisfactionLevel === "Dissatisfied") {
    output += "感到不滿。";
  } else if (lifeSatisfactionLevel === "Neutral") {
    output += "的滿意程度為中性。";
  } else if (lifeSatisfactionLevel === "Satisfied") {
    output += "感到滿意。";
  } else if (lifeSatisfactionLevel === "Very Satisfied") {
    output += "感到非常滿意。";
  }
  
  // Depression
  if (depressionLevel === "Normal") {
    output += "你沒有低落情緒。";
  } else if (depressionLevel === "Mild") {
    output += "你有輕度的低落情緒。";
  } else if (depressionLevel === "Moderate") {
    output += "你有中度的低落情緒。";
  } else if (depressionLevel === "Severe") {
    output += "你有嚴重的低落情緒。";
  } else if (depressionLevel === "Very Severe") {
    output += "你有很嚴重的低落情緒。";
  }
  
  // Anxiety
  if (anxietyLevel === "Normal") {
    output += "你沒有焦慮情緒。";
  } else if (anxietyLevel === "Mild") {
    output += "你有輕度的焦慮情緒。";
  } else if (anxietyLevel === "Moderate") {
    output += "你有中度的焦慮情緒。";
  } else if (anxietyLevel === "Severe") {
    output += "你有嚴重的焦慮情緒。";
  } else if (anxietyLevel === "Very Severe") {
    output += "你有很嚴重的焦慮情緒。";
  }
  
  // Stress
  if (stressLevel === "Normal") {
    output += "你沒有壓力問題。";
  } else if (stressLevel === "Mild") {
    output += "你有輕度的受壓情況。";
  } else if (stressLevel === "Moderate") {
    output += "你有中度的受壓情況。";
  } else if (stressLevel === "Severe") {
    output += "你有嚴重的受壓情況。";
  } else if (stressLevel === "Very Severe") {
    output += "你有很嚴重的受壓情況。";
  }
  
  return output;
};

// Helper function to get highest severity rank from DASS scores
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

// Updated helper function to determine mental health status based on DASS rank and life satisfaction rank
// Following the exact logic rules provided
const getMentalHealthStatus = (
  dassRank: number,
  lsRank: number
): string => {
  // DASS = Severe/Very Severe OR (DASS = Moderate AND Life satisfaction = Dissatisfied/Very dissatisfied)
  if (dassRank >= 4 || (dassRank === 3 && lsRank <= 2)) {
    return "Psychological Disturbance";
  } 
  // DASS = Moderate OR (DASS = Mild AND Life satisfaction = Dissatisfied/Very dissatisfied)
  else if (dassRank === 3 || (dassRank === 2 && lsRank <= 2)) {
    return "Medium-to-Low Sub-Health Status";
  } 
  // DASS = Mild OR (DASS = Normal AND Life satisfaction = Dissatisfied/Very dissatisfied)
  else if (dassRank === 2 || (dassRank === 1 && lsRank <= 2)) {
    return "Moderate Sub-Health Status";
  } 
  // DASS = Normal AND Life satisfaction = Neutral
  else if (dassRank === 1 && lsRank === 3) {
    return "Medium to High Sub-Health Status";
  } 
  // DASS = Normal AND Life satisfaction = Satisfied/Very Satisfied
  else { // dassRank === 1 && lsRank >= 4
    return "Healthy";
  }
};

export const determineMoodResult = (
  depressionLevel: AssessmentResult,
  anxietyLevel: AssessmentResult,
  stressLevel: AssessmentResult,
  satisfactionLevel: AssessmentResult,
  isParent: number,
  needsHelp: number,
  language: string = 'en' // Add language parameter with default value
): MoodResult => {
  // Determine overall DASS severity rank (highest of the three)
  const dassRank = getHighestSeverityRank(
    depressionLevel,
    anxietyLevel,
    stressLevel
  );
  
  // Get satisfaction rank
  const lsRank = satisfactionLevel.rank;
  
  // Determine final mental health status based on DASS rank and satisfaction rank
  const moodStatus = getMentalHealthStatus(dassRank, lsRank);
  
  let moodMessage = "";
  let iconType: 'frown' | 'meh' | 'smile' = 'meh';
  let iconColor = "text-yellow-500";

  // Set message and icon based on mood status
  if (moodStatus === "Psychological Disturbance") {
    moodMessage = "You are experiencing significant psychological distress.";
    iconType = "frown";
    iconColor = "text-red-500";
  } else if (moodStatus === "Medium-to-Low Sub-Health Status") {
    moodMessage = "You are experiencing a mild psychological disturbance.";
    iconType = "frown";
    iconColor = "text-orange-500";
  } else if (moodStatus === "Moderate Sub-Health Status") {
    moodMessage = "You are experiencing a moderate sub-health status.";
    iconType = "meh";
    iconColor = "text-yellow-500";
  } else if (moodStatus === "Medium to High Sub-Health Status") {
    moodMessage = "You are experiencing a medium to high sub-health status.";
    iconType = "meh";
    iconColor = "text-blue-500";
  } else { // Healthy
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
    needsHelp,
    assessmentText
  };
};

// Add test cases for mood determination logic
export const runTestCases = (): boolean => {
  // Test 1: Test Psychological Disturbance (Severe DASS)
  const test1 = getMentalHealthStatus(4, 5); // Severe DASS, Very Satisfied LS
  if (test1 !== "Psychological Disturbance") {
    console.error("Test 1 failed: Expected Psychological Disturbance, got", test1);
    return false;
  }

  // Test 2: Test Psychological Disturbance (Moderate DASS + Very dissatisfied LS)
  const test2 = getMentalHealthStatus(3, 1); // Moderate DASS, Very dissatisfied LS
  if (test2 !== "Psychological Disturbance") {
    console.error("Test 2 failed: Expected Psychological Disturbance, got", test2);
    return false;
  }

  // Test 3: Test Medium-to-Low Sub-Health Status (Moderate DASS + Neutral LS)
  const test3 = getMentalHealthStatus(3, 3); // Moderate DASS, Neutral LS
  if (test3 !== "Medium-to-Low Sub-Health Status") {
    console.error("Test 3 failed: Expected Medium-to-Low Sub-Health Status, got", test3);
    return false;
  }

  // Test 4: Test Medium-to-Low Sub-Health Status (Mild DASS + Dissatisfied LS)
  const test4 = getMentalHealthStatus(2, 2); // Mild DASS, Dissatisfied LS
  if (test4 !== "Medium-to-Low Sub-Health Status") {
    console.error("Test 4 failed: Expected Medium-to-Low Sub-Health Status, got", test4);
    return false;
  }

  // Test 5: Test Moderate Sub-Health Status (Mild DASS + Neutral LS)
  const test5 = getMentalHealthStatus(2, 3); // Mild DASS, Neutral LS
  if (test5 !== "Moderate Sub-Health Status") {
    console.error("Test 5 failed: Expected Moderate Sub-Health Status, got", test5);
    return false;
  }

  // Test 6: Test Moderate Sub-Health Status (Normal DASS + Dissatisfied LS)
  const test6 = getMentalHealthStatus(1, 2); // Normal DASS, Dissatisfied LS
  if (test6 !== "Moderate Sub-Health Status") {
    console.error("Test 6 failed: Expected Moderate Sub-Health Status, got", test6);
    return false;
  }

  // Test 7: Test Medium to High Sub-Health Status
  const test7 = getMentalHealthStatus(1, 3); // Normal DASS, Neutral LS
  if (test7 !== "Medium to High Sub-Health Status") {
    console.error("Test 7 failed: Expected Medium to High Sub-Health Status, got", test7);
    return false;
  }

  // Test 8: Test Healthy
  const test8 = getMentalHealthStatus(1, 4); // Normal DASS, Satisfied LS
  if (test8 !== "Healthy") {
    console.error("Test 8 failed: Expected Healthy, got", test8);
    return false;
  }
  
  console.log("All test cases passed!");
  return true;
};

export type { MoodResult };
