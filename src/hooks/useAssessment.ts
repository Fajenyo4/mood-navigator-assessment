
import { useAssessmentProgress } from './assessment/useAssessmentProgress';
import { useAssessmentNavigation } from './assessment/useAssessmentNavigation';
import { useAssessmentSubmission } from './assessment/useAssessmentSubmission';
import { useAssessmentQuestions } from './assessment/useAssessmentQuestions';
import { useAssessmentInitialization } from './assessment/useAssessmentInitialization';

interface UseAssessmentProps {
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
  // Get the questions based on language
  const { getQuestions } = useAssessmentQuestions(defaultLanguage);

  // Manage assessment progress state
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
    setIsSubmitting,
    updateCounter,
    setUpdateCounter,
    saveProgressLocally,
    resetAssessment
  } = useAssessmentProgress({
    initialQuestion,
    initialAnswers,
    defaultLanguage
  });

  // Handle assessment submission
  const { handleSubmit } = useAssessmentSubmission({
    userId,
    userName,
    userEmail,
    defaultLanguage,
    getQuestions,
    setIsSubmitting,
    setShowResults
  });

  // Handle navigation between questions
  const { handleAnswer, handlePrevious } = useAssessmentNavigation({
    currentQuestion,
    setCurrentQuestion,
    answers,
    selectedOption,
    setSelectedOption,
    setUpdateCounter,
    saveProgressLocally,
    getQuestions,
    handleSubmit
  });

  // Initialize assessment
  useAssessmentInitialization({ initialQuestion });

  // Return what consumer components need
  return {
    currentQuestion,
    answers,
    showResults,
    selectedOption,
    isSubmitting,
    handleAnswer,
    handlePrevious,
    setShowResults,
    updateCounter,
    resetAssessment
  };
};
