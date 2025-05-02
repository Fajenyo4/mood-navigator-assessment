
export interface Question {
  id: number;
  text: string;
  options: string[];
  optionValues?: number[]; // Optional array of values for each option
  type?: string; // Added type property to support question categorization
}

export interface TranslatedQuestions {
  [key: string]: Question[];
}
