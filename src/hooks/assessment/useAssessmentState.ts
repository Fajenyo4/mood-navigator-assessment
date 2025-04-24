
import { useState } from 'react';
import { Question } from '@/types/assessment';

export interface AssessmentState {
  currentQuestion: number;
  answers: { [key: number]: number };
  showResults: boolean;
  selectedOption: string;
  isSubmitting: boolean;
}

export const useAssessmentState = (initialQuestion = 0, initialAnswers = {}) => {
  const [currentQuestion, setCurrentQuestion] = useState(initialQuestion);
  const [answers, setAnswers] = useState<{ [key: number]: number }>(initialAnswers);
  const [showResults, setShowResults] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>((initialAnswers[initialQuestion + 1]?.toString()) || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  return {
    currentQuestion,
    setCurrentQuestion,
    answers,
    setAnswers,
    showResults,
    setShowResults,
    selectedOption,
    setSelectedOption,
    isSubmitting,
    setIsSubmitting
  };
};
