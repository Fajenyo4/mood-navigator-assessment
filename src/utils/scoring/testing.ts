
import { determineLevel } from './levelDetermination';
import { determineMoodResult } from './moodResult';
import { SeverityLevel, AssessmentResult } from './types';
import { SEVERITY_RANKS } from './constants';

// Function for testing mood combinations
export function testMoodCombination(
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

/**
 * Run comprehensive test cases for the assessment scoring system
 */
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
  console.log("Score 5:", determineLevel(5, 'satisfaction').level); // Should be Very dissatisfied
  console.log("Score 6:", determineLevel(6, 'satisfaction').level); // Should be Dissatisfied
  console.log("Score 13:", determineLevel(13, 'satisfaction').level); // Should be Dissatisfied
  console.log("Score 14:", determineLevel(14, 'satisfaction').level); // Should be Neutral
  console.log("Score 19:", determineLevel(19, 'satisfaction').level); // Should be Neutral
  console.log("Score 20:", determineLevel(20, 'satisfaction').level); // Should be Satisfied
  console.log("Score 26:", determineLevel(26, 'satisfaction').level); // Should be Satisfied
  console.log("Score 27:", determineLevel(27, 'satisfaction').level); // Should be Very Satisfied
  
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
