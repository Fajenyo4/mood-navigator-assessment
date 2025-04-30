
import { SeverityLevel } from './types';

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
