
import { determineLevel, determineMoodResult } from './assessmentScoring';

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
  
  // Function to create test scenarios
  const testScenario = (
    depressionScore: number, 
    anxietyScore: number, 
    stressScore: number, 
    lifeSatisfactionScore: number
  ) => {
    const depression = determineLevel(depressionScore, 'depression');
    const anxiety = determineLevel(anxietyScore, 'anxiety');
    const stress = determineLevel(stressScore, 'stress');
    const satisfaction = determineLevel(lifeSatisfactionScore, 'satisfaction');
    
    const result = determineMoodResult(
      depression,
      anxiety,
      stress,
      satisfaction,
      0, // isParent (not relevant for this test)
      0  // needsHelp (not relevant for this test)
    );
    
    console.log(
      `Depression: ${depressionScore} (${depression.level}), ` +
      `Anxiety: ${anxietyScore} (${anxiety.level}), ` +
      `Stress: ${stressScore} (${stress.level}), ` +
      `Life Satisfaction: ${lifeSatisfactionScore} (${satisfaction.level}) ` +
      `=> Mental Health Status: ${result.mood}`
    );
    
    return result.mood;
  };
  
  // Test critical combinations
  
  // 1. Psychological Disturbance cases
  console.log("\nPSYCHOLOGICAL DISTURBANCE TESTS:");
  testScenario(28, 10, 16, 33); // Very Severe depression with otherwise normal scores
  testScenario(9, 28, 16, 33); // Very Severe anxiety with otherwise normal scores
  testScenario(9, 10, 38, 33); // Very Severe stress with otherwise normal scores
  testScenario(14, 14, 21, 13); // Moderate DASS + Very dissatisfied LS
  
  // 2. Medium-to-Low Sub-Health Status cases
  console.log("\nMEDIUM-TO-LOW SUB-HEALTH STATUS TESTS:");
  testScenario(14, 14, 21, 27); // Moderate DASS + Neutral LS
  testScenario(10, 11, 17, 14); // Mild DASS + Dissatisfied LS
  
  // 3. Moderate Sub-Health Status cases
  console.log("\nMODERATE SUB-HEALTH STATUS TESTS:");
  testScenario(10, 11, 17, 27); // Mild DASS + Neutral LS
  testScenario(9, 10, 16, 14); // Normal DASS + Dissatisfied LS
  
  // 4. Medium to High Sub-Health Status cases
  console.log("\nMEDIUM TO HIGH SUB-HEALTH STATUS TESTS:");
  testScenario(9, 10, 16, 26); // Normal DASS + Neutral LS
  
  // 5. Healthy cases
  console.log("\nHEALTHY TESTS:");
  testScenario(9, 10, 16, 27); // Normal DASS + Satisfied LS
  testScenario(9, 10, 16, 33); // Normal DASS + Very Satisfied LS
};

// Run all tests
export const runAllTests = () => {
  testSeverityBoundaries();
  testMentalHealthStatus();
  console.log("\nAll tests completed!");
};
