
import { DassScores } from './types';

/**
 * Calculate DASS scores from the raw questionnaire answers
 * 
 * answers object contains question numbers as keys and response values:
 * - For DASS questions (6-26): values are 0-3
 * - For life satisfaction questions (1-5): values are 1-7
 * - For binary questions (27-28): values are 0-1
 */
export const calculateDassScores = (answers: { [key: number]: number }): DassScores => {
  // Depression calculation (questions 8, 15, 18, 21, 22, 26)
  // Each answer is the selected option value (0-3) for DASS questions
  const depression = ((answers[8] || 0) + (answers[15] || 0) + (answers[18] || 0) + 
                     (answers[21] || 0) + (answers[22] || 0) + (answers[26] || 0)) * 2;

  // Anxiety calculation (questions 7, 9, 12, 14, 20, 24, 25)
  const anxiety = ((answers[7] || 0) + (answers[9] || 0) + (answers[12] || 0) + 
                  (answers[14] || 0) + (answers[20] || 0) + (answers[24] || 0) + 
                  (answers[25] || 0)) * 2;

  // Stress calculation (questions 6, 11, 13, 16, 17, 19, 23)
  const stress = ((answers[6] || 0) + (answers[11] || 0) + (answers[13] || 0) + 
                 (answers[16] || 0) + (answers[17] || 0) + (answers[19] || 0) + 
                 (answers[23] || 0)) * 2;

  // Life satisfaction calculation (questions 1-5)
  // Each answer is the selected option value (1-7) for life satisfaction questions
  const lifeSatisfaction = (answers[1] || 0) + (answers[2] || 0) + (answers[3] || 0) + 
                          (answers[4] || 0) + (answers[5] || 0);

  return {
    depression,
    anxiety,
    stress,
    lifeSatisfaction,
    isParent: answers[27] === 0 ? 1 : 0, // Yes = 1, No = 0
    needsHelp: answers[28] === 0 ? 1 : 0  // Yes = 1, No = 0
  };
};
