
import { 
  runTestCases, 
  determineLevel, 
  getSeverityLevel, 
  getSeverityColor,
  getSatisfactionLevel,
  getSatisfactionColor,
  generateTestData,
  calculateDassScores,
  determineMoodResult
} from './scoring';

/**
 * Run all test functions to verify scoring logic
 */
export const runAllTests = (): void => {
  // Run comprehensive test cases
  runTestCases();
  
  // Additional test for satisfaction level assessment
  console.log("\nTEST SATISFACTION LEVELS:");
  console.log("Score 5:", determineLevel(5, 'satisfaction').level);  // Should be Very dissatisfied
  console.log("Score 13:", getSatisfactionLevel(13));  // Should be Dissatisfied
  console.log("Score 25:", getSatisfactionLevel(25));  // Should be Satisfied
  console.log("Score 35:", getSatisfactionLevel(35));  // Should be Very Satisfied
  
  // Test color functions
  console.log("\nTEST COLOR FUNCTIONS:");
  console.log("Normal color:", getSeverityColor("Normal"));
  console.log("Very Severe color:", getSeverityColor("Very Severe"));
  console.log("Very Satisfied color:", getSatisfactionColor("Very Satisfied"));
  console.log("Very dissatisfied color:", getSatisfactionColor("Very dissatisfied"));
  
  // Generate dummy test data
  const testData = generateTestData("test-user", "Test User", "test@example.com");
  console.log("\nGENERATED TEST DATA SAMPLES:");
  console.log("Severe case mood:", testData.severe.final_mood);
  console.log("Normal case mood:", testData.normal.final_mood);
};
