
import { DassScores } from './types';

/**
 * Calculate DASS scores from the raw questionnaire answers
 */
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
