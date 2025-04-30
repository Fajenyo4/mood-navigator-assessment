
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface UseAssessmentProgressProps {
  initialQuestion?: number;
  initialAnswers?: { [key: number]: number };
  defaultLanguage?: string;
}

export const useAssessmentProgress = ({
  initialQuestion = 0,
  initialAnswers = {},
  defaultLanguage = 'en'
}: UseAssessmentProgressProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(initialQuestion);
  const [answers, setAnswers] = useState<{ [key: number]: number }>(initialAnswers);
  const [selectedOption, setSelectedOption] = useState<string>((initialAnswers[initialQuestion + 1]?.toString()) || "");
  const [updateCounter, setUpdateCounter] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Save progress locally without triggering any refreshes
  const saveProgressLocally = useCallback((newQuestion: number, newAnswers: { [key: number]: number }) => {
    try {
      localStorage.setItem('assessment_progress', JSON.stringify({
        currentQuestion: newQuestion,
        answers: newAnswers,
        timestamp: Date.now(),
        language: defaultLanguage
      }));
    } catch (error) {
      console.error('Error saving progress to localStorage:', error);
      // Silently fail without disrupting user experience
    }
  }, [defaultLanguage]);

  // Reset assessment to initial state
  const resetAssessment = useCallback(() => {
    setCurrentQuestion(0);
    setAnswers({});
    setSelectedOption("");
    setShowResults(false);
    setUpdateCounter(prev => prev + 1);
    
    // Clear any saved progress from localStorage
    localStorage.removeItem('assessment_progress');
    
    console.log("Assessment has been reset to initial state");
    toast.success("Assessment reset successfully");
  }, []);

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
    setIsSubmitting,
    updateCounter,
    setUpdateCounter,
    saveProgressLocally,
    resetAssessment
  };
};
