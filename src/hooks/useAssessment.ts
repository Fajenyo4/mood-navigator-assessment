import { useCallback } from 'react';
import { questions as enQuestions } from '@/translations/en';
import { questions as zhCNQuestions } from '@/translations/zh-CN';
import { questions as zhTWQuestions } from '@/translations/zh-TW';
import { useAssessmentState } from './assessment/useAssessmentState';
import { useProgressPersistence, getSavedProgressState } from './assessment/useProgressPersistence';
import { useAssessmentSubmission } from './assessment/useAssessmentSubmission';
import { toast } from 'sonner';

const QUESTIONS_MAP = {
  'en': enQuestions,
  'zh-CN': zhCNQuestions,
  'zh-HK': zhTWQuestions
};

export interface UseAssessmentProps {
  userId: string | undefined;
  userName: string | undefined;
  userEmail: string | undefined;
  defaultLanguage?: string;
  initialQuestion?: number;
  initialAnswers?: { [key: number]: number };
}

export const useAssessment = ({ 
  userId, 
  userName, 
  userEmail, 
  defaultLanguage = 'en',
  initialQuestion = 0,
  initialAnswers = {}
}: UseAssessmentProps) => {
  const {
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
  } = useAssessmentState(initialQuestion, initialAnswers);

  useProgressPersistence(answers, currentQuestion, defaultLanguage);

  const { handleSubmit } = useAssessmentSubmission(
    userId,
    userName,
    userEmail,
    defaultLanguage,
    setShowResults,
    setIsSubmitting
  );

  const handleAnswer = useCallback((value: string) => {
    try {
      const numericValue = parseInt(value);
      const questions = QUESTIONS_MAP[defaultLanguage as keyof typeof QUESTIONS_MAP] || QUESTIONS_MAP['en'];
      
      setAnswers(prev => ({
        ...prev,
        [currentQuestion + 1]: numericValue
      }));
      
      setSelectedOption(value);

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedOption("");
      } else {
        const finalAnswers = { 
          ...answers, 
          [currentQuestion + 1]: numericValue 
        };
        handleSubmit(finalAnswers);
      }
    } catch (error) {
      console.error('Error handling answer:', error);
      toast.error('There was an error processing your answer. Please try again.');
    }
  }, [currentQuestion, answers, defaultLanguage, handleSubmit]);

  const handlePrevious = useCallback(() => {
    if (currentQuestion > 0) {
      const prevQuestion = currentQuestion - 1;
      setCurrentQuestion(prevQuestion);
      setSelectedOption(answers[prevQuestion + 1]?.toString() || "");
    }
  }, [currentQuestion, answers]);

  return {
    currentQuestion,
    answers,
    showResults,
    selectedOption,
    isSubmitting,
    handleAnswer,
    handlePrevious,
    setShowResults
  };
};
