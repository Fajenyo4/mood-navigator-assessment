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
  // Depression calculation (q8, q10, q15, q18, q21, q22, q26)
  const depression = ((answers[8] || 0) + (answers[10] || 0) + (answers[15] || 0) + 
                     (answers[18] || 0) + (answers[21] || 0) + (answers[22] || 0) + 
                     (answers[26] || 0)) * 2;

  // Anxiety calculation (q7, q9, q12, q14, q20, q24, q25)
  const anxiety = ((answers[7] || 0) + (answers[9] || 0) + (answers[12] || 0) + 
                  (answers[14] || 0) + (answers[20] || 0) + (answers[24] || 0) + 
                  (answers[25] || 0)) * 2;

  // Stress calculation (q6, q11, q13, q16, q17, q19, q23)
  const stress = ((answers[6] || 0) + (answers[11] || 0) + (answers[13] || 0) + 
                 (answers[16] || 0) + (answers[17] || 0) + (answers[19] || 0) + 
                 (answers[23] || 0)) * 2;

  // Life satisfaction calculation (q1-q5)
  const lifeSatisfaction = (answers[1] || 0) + (answers[2] || 0) + (answers[3] || 0) + 
                          (answers[4] || 0) + (answers[5] || 0);

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
      if (score <= 5) return { score, level: "Very dissatisfied", message: "very dissatisfied", rank: 1 };
      if (score < 14) return { score, level: "Dissatisfied", message: "dissatisfied", rank: 2 };
      if (score < 20) return { score, level: "Neutral", message: "neutral", rank: 3 };
      if (score < 27) return { score, level: "Satisfied", message: "satisfied", rank: 4 };
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
  // Updated to match the determineLevel function for satisfaction
  if (score <= 5) return "Very dissatisfied";
  if (score < 14) return "Dissatisfied";
  if (score < 20) return "Neutral";
  if (score < 27) return "Satisfied";
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
// Following the exact logic rules provided in the audit checklist
const getMentalHealthStatus = (
  dassRank: number,
  lsRank: number
): string => {
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

// Enhanced comprehensive testing for all boundary conditions and combinations
export const runTestCases = (): boolean => {
  // Test all DASS severity boundaries
  console.log("\n--- TESTING ALL BOUNDARIES ---");
  
  // Test Depression boundaries
  console.log("\nDEPRESSION BOUNDARIES:");
  console.log("Score 9:", determineLevel(9, 'depression').level); // Should be Normal
  console.log("Score 10:", determineLevel(10, 'depression').level); // Should be Mild
  console.log("Score 13:", determineLevel(13, 'depression').level); // Should be Mild
  console.log("Score 14:", determineLevel(14, 'depression').level); // Should be Moderate
  console.log("Score 20:", determineLevel(20, 'depression').level); // Should be Moderate
  console.log("Score 21:", determineLevel(21, 'depression').level); // Should be Severe
  console.log("Score 27:", determineLevel(27, 'depression').level); // Should be Severe
  console.log("Score 28:", determineLevel(28, 'depression').level); // Should be Very Severe
  
  // Test Anxiety boundaries
  console.log("\nANXIETY BOUNDARIES:");
  console.log("Score 10:", determineLevel(10, 'anxiety').level); // Should be Normal
  console.log("Score 11:", determineLevel(11, 'anxiety').level); // Should be Mild
  console.log("Score 13:", determineLevel(13, 'anxiety').level); // Should be Mild
  console.log("Score 14:", determineLevel(14, 'anxiety').level); // Should be Moderate
  console.log("Score 20:", determineLevel(20, 'anxiety').level); // Should be Moderate
  console.log("Score 21:", determineLevel(21, 'anxiety').level); // Should be Severe
  console.log("Score 27:", determineLevel(27, 'anxiety').level); // Should be Severe
  console.log("Score 28:", determineLevel(28, 'anxiety').level); // Should be Very Severe
  
  // Test Stress boundaries
  console.log("\nSTRESS BOUNDARIES:");
  console.log("Score 16:", determineLevel(16, 'stress').level); // Should be Normal
  console.log("Score 17:", determineLevel(17, 'stress').level); // Should be Mild
  console.log("Score 20:", determineLevel(20, 'stress').level); // Should be Mild
  console.log("Score 21:", determineLevel(21, 'stress').level); // Should be Moderate
  console.log("Score 28:", determineLevel(28, 'stress').level); // Should be Moderate
  console.log("Score 29:", determineLevel(29, 'stress').level); // Should be Severe
  console.log("Score 37:", determineLevel(37, 'stress').level); // Should be Severe
  console.log("Score 38:", determineLevel(38, 'stress').level); // Should be Very Severe
  
  // Test Life Satisfaction boundaries
  console.log("\nLIFE SATISFACTION BOUNDARIES:");
  console.log("Score 13:", determineLevel(13, 'satisfaction').level); // Should be Very dissatisfied
  console.log("Score 14:", determineLevel(14, 'satisfaction').level); // Should be Dissatisfied
  console.log("Score 19:", determineLevel(19, 'satisfaction').level); // Should be Dissatisfied
  console.log("Score 20:", determineLevel(20, 'satisfaction').level); // Should be Neutral
  console.log("Score 26:", determineLevel(26, 'satisfaction').level); // Should be Neutral
  console.log("Score 27:", determineLevel(27, 'satisfaction').level); // Should be Satisfied
  console.log("Score 32:", determineLevel(32, 'satisfaction').level); // Should be Satisfied
  console.log("Score 33:", determineLevel(33, 'satisfaction').level); // Should be Very Satisfied
  
  // Test all combinations for Mental Health Status determination
  console.log("\n--- TESTING ALL MOOD COMBINATIONS ---");
  
  // Testing Psychological Disturbance (Extremely Unhappy) conditions
  console.log("\nPSYCHOLOGICAL DISTURBANCE (EXTREMELY UNHAPPY) TESTS:");
  // DASS = Severe/Very Severe
  testMoodCombination("Very Severe", "Normal", "Normal", "Very Satisfied", "Psychological Disturbance"); // DASS Severe, LS any
  testMoodCombination("Normal", "Severe", "Normal", "Dissatisfied", "Psychological Disturbance"); // DASS Severe, LS any
  testMoodCombination("Normal", "Normal", "Very Severe", "Very Satisfied", "Psychological Disturbance"); // DASS Severe, LS any
  // DASS = Moderate AND LS = Very Dissatisfied/Dissatisfied
  testMoodCombination("Moderate", "Normal", "Normal", "Very dissatisfied", "Psychological Disturbance");
  testMoodCombination("Normal", "Moderate", "Normal", "Dissatisfied", "Psychological Disturbance");
  
  // Testing Medium-to-Low Sub-Health Status (Very Unhappy) conditions
  console.log("\nMEDIUM-TO-LOW SUB-HEALTH STATUS (VERY UNHAPPY) TESTS:");
  // DASS = Moderate
  testMoodCombination("Moderate", "Normal", "Normal", "Neutral", "Medium-to-Low Sub-Health Status");
  testMoodCombination("Normal", "Moderate", "Normal", "Satisfied", "Medium-to-Low Sub-Health Status");
  // DASS = Mild AND LS = Very Dissatisfied/Dissatisfied
  testMoodCombination("Mild", "Normal", "Normal", "Very dissatisfied", "Medium-to-Low Sub-Health Status");
  testMoodCombination("Normal", "Mild", "Normal", "Dissatisfied", "Medium-to-Low Sub-Health Status");
  
  // Testing Moderate Sub-Health Status (Moderately Unhappy) conditions
  console.log("\nMODERATE SUB-HEALTH STATUS (MODERATELY UNHAPPY) TESTS:");
  // DASS = Mild
  testMoodCombination("Mild", "Normal", "Normal", "Neutral", "Moderate Sub-Health Status");
  testMoodCombination("Normal", "Mild", "Normal", "Satisfied", "Moderate Sub-Health Status");
  // DASS = Normal AND LS = Very Dissatisfied/Dissatisfied
  testMoodCombination("Normal", "Normal", "Normal", "Very dissatisfied", "Moderate Sub-Health Status");
  testMoodCombination("Normal", "Normal", "Normal", "Dissatisfied", "Moderate Sub-Health Status");
  
  // Testing Medium to High Sub-Health Status (Slightly Unhappy) conditions
  console.log("\nMEDIUM TO HIGH SUB-HEALTH STATUS (SLIGHTLY UNHAPPY) TESTS:");
  // DASS = Normal AND LS = Neutral
  testMoodCombination("Normal", "Normal", "Normal", "Neutral", "Medium to High Sub-Health Status");
  
  // Testing Healthy (Happy) conditions
  console.log("\nHEALTHY (HAPPY) TESTS:");
  // DASS = Normal AND LS = Satisfied/Very Satisfied
  testMoodCombination("Normal", "Normal", "Normal", "Satisfied", "Healthy");
  testMoodCombination("Normal", "Normal", "Normal", "Very Satisfied", "Healthy");
  
  console.log("\nAll test cases completed!");
  return true;
};

// Helper function for testing mood combinations
function testMoodCombination(
  depression: SeverityLevel, 
  anxiety: SeverityLevel, 
  stress: SeverityLevel, 
  lifeSatisfaction: SeverityLevel, 
  expectedMood: string
): void {
  const depressionResult: AssessmentResult = { 
    level: depression, 
    score: 0, 
    message: "", 
    rank: SEVERITY_RANKS[depression]
  };
  const anxietyResult: AssessmentResult = { 
    level: anxiety, 
    score: 0, 
    message: "", 
    rank: SEVERITY_RANKS[anxiety] 
  };
  const stressResult: AssessmentResult = { 
    level: stress, 
    score: 0, 
    message: "", 
    rank: SEVERITY_RANKS[stress] 
  };
  const satisfactionResult: AssessmentResult = { 
    level: lifeSatisfaction, 
    score: 0, 
    message: "", 
    rank: SEVERITY_RANKS[lifeSatisfaction] 
  };
  
  const result = determineMoodResult(
    depressionResult,
    anxietyResult,
    stressResult,
    satisfactionResult,
    0, // isParent
    0  // needsHelp
  );
  
  console.log(`D:${depression}, A:${anxiety}, S:${stress}, LS:${lifeSatisfaction} => ${result.mood} (Expected: ${expectedMood})`);
  if (result.mood !== expectedMood) {
    console.error(`  ERROR: Expected ${expectedMood}, got ${result.mood}`);
  }
}

export type { MoodResult };
