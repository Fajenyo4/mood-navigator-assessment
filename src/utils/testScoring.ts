
import { determineLevel, determineMoodResult, SEVERITY_RANKS } from './assessmentScoring';
import type { AssessmentResult, SeverityLevel } from './scoring/types';

// Tests at boundary values
export const testSeverityBoundaries = () => {
  console.log("--- TESTING SEVERITY BOUNDARIES ---");
  
  // Depression boundaries
  console.log("DEPRESSION TESTS:");
  console.log("Score 9:", determineLevel(9, 'depression').level); // Should be Normal
  console.log("Score 10:", determineLevel(10, 'depression').level); // Should be Mild
  console.log("Score 13:", determineLevel(13, 'depression').level); // Should be Mild
  console.log("Score 14:", determineLevel(14, 'depression').level); // Should be Moderate
  console.log("Score 20:", determineLevel(20, 'depression').level); // Should be Moderate
  console.log("Score 21:", determineLevel(21, 'depression').level); // Should be Severe
  console.log("Score 27:", determineLevel(27, 'depression').level); // Should be Severe
  console.log("Score 28:", determineLevel(28, 'depression').level); // Should be Very Severe
  
  // Anxiety boundaries
  console.log("\nANXIETY TESTS:");
  console.log("Score 10:", determineLevel(10, 'anxiety').level); // Should be Normal
  console.log("Score 11:", determineLevel(11, 'anxiety').level); // Should be Mild
  console.log("Score 13:", determineLevel(13, 'anxiety').level); // Should be Mild
  console.log("Score 14:", determineLevel(14, 'anxiety').level); // Should be Moderate
  console.log("Score 20:", determineLevel(20, 'anxiety').level); // Should be Moderate
  console.log("Score 21:", determineLevel(21, 'anxiety').level); // Should be Severe
  console.log("Score 27:", determineLevel(27, 'anxiety').level); // Should be Severe
  console.log("Score 28:", determineLevel(28, 'anxiety').level); // Should be Very Severe
  
  // Stress boundaries
  console.log("\nSTRESS TESTS:");
  console.log("Score 16:", determineLevel(16, 'stress').level); // Should be Normal
  console.log("Score 17:", determineLevel(17, 'stress').level); // Should be Mild
  console.log("Score 20:", determineLevel(20, 'stress').level); // Should be Mild
  console.log("Score 21:", determineLevel(21, 'stress').level); // Should be Moderate
  console.log("Score 28:", determineLevel(28, 'stress').level); // Should be Moderate
  console.log("Score 29:", determineLevel(29, 'stress').level); // Should be Severe
  console.log("Score 37:", determineLevel(37, 'stress').level); // Should be Severe
  console.log("Score 38:", determineLevel(38, 'stress').level); // Should be Very Severe
  
  // Life satisfaction boundaries
  console.log("\nLIFE SATISFACTION TESTS:");
  console.log("Score 13:", determineLevel(13, 'satisfaction').level); // Should be Very dissatisfied
  console.log("Score 14:", determineLevel(14, 'satisfaction').level); // Should be Dissatisfied
  console.log("Score 19:", determineLevel(19, 'satisfaction').level); // Should be Dissatisfied
  console.log("Score 20:", determineLevel(20, 'satisfaction').level); // Should be Neutral
  console.log("Score 26:", determineLevel(26, 'satisfaction').level); // Should be Neutral
  console.log("Score 27:", determineLevel(27, 'satisfaction').level); // Should be Satisfied
  console.log("Score 32:", determineLevel(32, 'satisfaction').level); // Should be Satisfied
  console.log("Score 33:", determineLevel(33, 'satisfaction').level); // Should be Very Satisfied
};

// Test mental health status determination for all combinations
export const testMentalHealthStatus = () => {
  console.log("\n--- TESTING MENTAL HEALTH STATUS COMBINATIONS ---");
  
  // Test Psychological Disturbance conditions
  console.log("\nPSYCHOLOGICAL DISTURBANCE (EXTREMELY UNHAPPY) TESTS:");
  testMoodCombination("Very Severe", "Normal", "Normal", "Very Satisfied");  // DASS Severe with any LS
  testMoodCombination("Severe", "Normal", "Normal", "Very Satisfied");       // DASS Severe with any LS
  testMoodCombination("Moderate", "Normal", "Normal", "Dissatisfied");       // DASS Moderate with LS Dissatisfied
  
  // Test Medium-to-Low Sub-Health Status conditions
  console.log("\nMEDIUM-TO-LOW SUB-HEALTH STATUS (VERY UNHAPPY) TESTS:");
  testMoodCombination("Moderate", "Normal", "Normal", "Neutral");            // DASS Moderate with LS not Dissatisfied
  testMoodCombination("Mild", "Normal", "Normal", "Dissatisfied");           // DASS Mild with LS Dissatisfied
  
  // Test Moderate Sub-Health Status conditions
  console.log("\nMODERATE SUB-HEALTH STATUS (MODERATELY UNHAPPY) TESTS:");
  testMoodCombination("Mild", "Normal", "Normal", "Neutral");                // DASS Mild with LS not Dissatisfied
  testMoodCombination("Normal", "Normal", "Normal", "Dissatisfied");         // DASS Normal with LS Dissatisfied
  
  // Test Medium to High Sub-Health Status conditions
  console.log("\nMEDIUM TO HIGH SUB-HEALTH STATUS (SLIGHTLY UNHAPPY) TESTS:");
  testMoodCombination("Normal", "Normal", "Normal", "Neutral");              // DASS Normal with LS Neutral
  
  // Test Healthy conditions
  console.log("\nHEALTHY (HAPPY) TESTS:");
  testMoodCombination("Normal", "Normal", "Normal", "Satisfied");            // DASS Normal with LS Satisfied
  testMoodCombination("Normal", "Normal", "Normal", "Very Satisfied");       // DASS Normal with LS Very Satisfied
};

// Helper function for testing mood combinations
function testMoodCombination(
  depression: SeverityLevel, 
  anxiety: SeverityLevel, 
  stress: SeverityLevel, 
  lifeSatisfaction: SeverityLevel
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
  
  console.log(`Depression:${depression}, Anxiety:${anxiety}, Stress:${stress}, Life Satisfaction:${lifeSatisfaction}`);
  console.log(`Result: ${result.mood}`);
}

// Run all tests
export const runAllTests = () => {
  testSeverityBoundaries();
  testMentalHealthStatus();
  console.log("\nAll tests completed!");
};
