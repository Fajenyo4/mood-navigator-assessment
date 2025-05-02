
export interface Question {
  id: number;
  text: string;
  options: string[];
  optionValues?: number[]; // Optional array of values for each option
}

export interface TranslatedQuestions {
  [key: string]: Question[];
}
