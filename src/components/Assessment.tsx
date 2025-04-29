
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import QuestionDisplay from './assessment/QuestionDisplay';
import ResultsDialog from './assessment/ResultsDialog';
import LoadingState from './assessment/LoadingState';
import { useAssessment } from '@/hooks/useAssessment';
import { useAssessmentSetup } from '@/hooks/useAssessmentSetup';
import { useBeforeUnload } from '@/hooks/useBeforeUnload';
import { useAssessmentResult } from '@/hooks/useAssessmentResult';
import CurrentQuestionManager from './assessment/CurrentQuestionManager';
import ProgressCalculator from './assessment/ProgressCalculator';

interface AssessmentProps {
  defaultLanguage?: string;
}

const Assessment: React.FC<AssessmentProps> = ({ defaultLanguage = 'en' }) => {
  const { user } = useAuth();
  
  // Setup assessment with language and initialization
  const {
    effectiveLanguage,
    isInitialized,
    isLoading,
    totalQuestions,
    getQuestions,
    initialState,
  } = useAssessmentSetup({ defaultLanguage });

  // Get the core assessment state and handlers
  const {
    currentQuestion,
    showResults,
    selectedOption,
    isSubmitting,
    answers,
    handleAnswer,
    handlePrevious,
    setShowResults,
    updateCounter,
    resetAssessment,
  } = useAssessment({
    userId: user?.id,
    userName: user?.user_metadata?.name,
    userEmail: user?.email,
    defaultLanguage: effectiveLanguage,
    initialQuestion: initialState.initialQuestion,
    initialAnswers: initialState.initialAnswers
  });

  // Add beforeunload handler
  useBeforeUnload({ currentQuestion, showResults, answers });

  // Get current question data
  const currentQuestionData = React.useMemo(() => {
    const questions = getQuestions();
    return questions[currentQuestion];
  }, [currentQuestion, getQuestions]);

  // Calculate progress
  const progressPercentage = React.useMemo(() => {
    if (currentQuestion === 0) return 0;
    return Math.floor((currentQuestion / (totalQuestions - 1)) * 100);
  }, [currentQuestion, totalQuestions]);

  // Calculate results
  const { getResultData } = useAssessmentResult({ answers, effectiveLanguage });

  // Handle reset
  const handleReset = React.useCallback(() => {
    localStorage.removeItem('assessment_progress');
    resetAssessment();
  }, [resetAssessment]);

  // Run tests in development environment only
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // Run diagnostic tests to verify assessment scoring logic
      console.log("Running assessment scoring tests...");
      import('@/utils/testScoring').then(({ runAllTests }) => runAllTests());
    }
  }, []);

  // Use the updated redirect URL
  const REDIRECT_URL = "https://www.mican.life/courses-en";

  if (isLoading || !isInitialized) {
    return <LoadingState message="Loading assessment..." />;
  }

  if (isSubmitting) {
    return <LoadingState message="Processing your assessment..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <QuestionDisplay
        currentQuestion={currentQuestion}
        totalQuestions={totalQuestions}
        progress={progressPercentage}
        question={currentQuestionData}
        selectedOption={selectedOption}
        onAnswer={handleAnswer}
        onPrevious={handlePrevious}
        showPrevious={currentQuestion > 0}
        onReset={handleReset}
      />
      
      <ResultsDialog
        open={showResults}
        onOpenChange={setShowResults}
        result={showResults ? getResultData() : null}
        onManualRedirect={() => window.location.href = REDIRECT_URL}
        language={effectiveLanguage}
      />
    </div>
  );
};

export default Assessment;
