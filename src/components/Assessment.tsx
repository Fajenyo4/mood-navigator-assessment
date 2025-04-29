
import React, { useEffect, useState, useCallback, lazy, Suspense } from 'react';
import { useAuth } from '@/context/AuthContext';
import QuestionDisplay from './assessment/QuestionDisplay';
import ResultsDialog from './assessment/ResultsDialog';
import LoadingState from './assessment/LoadingState';
import { useAssessment } from '@/hooks/useAssessment';
import { calculateDassScores, determineLevel, determineMoodResult } from '@/utils/assessmentScoring';
import { runAllTests } from '@/utils/testScoring';

// Preloading question sets for faster access
import { questions as enQuestions } from '@/translations/en';
import { questions as zhCNQuestions } from '@/translations/zh-CN';
import { questions as zhTWQuestions } from '@/translations/zh-TW';

interface AssessmentProps {
  defaultLanguage?: string;
}

// Optimize initial loading by precomputing total questions for each language
const questionCounts = {
  'en': enQuestions.length,
  'zh-CN': zhCNQuestions.length,
  'zh-HK': zhTWQuestions.length
};

const Assessment: React.FC<AssessmentProps> = ({ defaultLanguage = 'en' }) => {
  const { user, language: authLanguage } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Get the effective language - either from props or from auth context
  const effectiveLanguage = defaultLanguage || authLanguage || 'en';
  
  // Get the initial state - empty by default
  const getSavedProgressState = useCallback(() => {
    try {
      const savedProgress = localStorage.getItem('assessment_progress');
      if (savedProgress) {
        const { currentQuestion, answers, timestamp, language } = JSON.parse(savedProgress);
        // Only restore if saved within last hour and language matches
        if (Date.now() - timestamp < 3600000 && language === effectiveLanguage) {
          return { initialQuestion: currentQuestion, initialAnswers: answers };
        }
        // Clear invalid progress data
        localStorage.removeItem('assessment_progress');
      }
    } catch (error) {
      console.error('Error parsing assessment progress:', error);
      localStorage.removeItem('assessment_progress');
    }
    
    return { initialQuestion: 0, initialAnswers: {} };
  }, [effectiveLanguage]);
  
  // Only run initialization once
  const [initialState] = useState(() => getSavedProgressState());
  
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

  useEffect(() => {
    const initialize = async () => {
      try {
        setIsLoading(true);
        // Preload all question sets in the background
        await Promise.all([
          Promise.resolve(), // Simulate async initialization
          // Questions are already imported at the top, so no need to import again
        ]);
        setIsInitialized(true);
      } catch (error) {
        console.error('Error during initialization:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  // Get the correct question set based on language
  const getQuestions = useCallback(() => {
    switch (effectiveLanguage) {
      case 'zh-CN':
        return zhCNQuestions;
      case 'zh-HK':
        return zhTWQuestions;
      case 'en':
      default:
        return enQuestions;
    }
  }, [effectiveLanguage]);

  // Calculate the total number of questions for the current language
  const totalQuestions = React.useMemo(() => {
    return questionCounts[effectiveLanguage as keyof typeof questionCounts] || enQuestions.length;
  }, [effectiveLanguage]);

  // Memoize the current question for better performance
  const currentQuestionData = React.useMemo(() => {
    const questions = getQuestions();
    return questions[currentQuestion];
  }, [currentQuestion, getQuestions]);

  // Calculate progress percentage - ensure it starts at 0% for first question
  const progressPercentage = React.useMemo(() => {
    // When on the first question (index 0), progress should be 0
    if (currentQuestion === 0) return 0;
    // Otherwise calculate as a percentage of completed questions
    return Math.floor((currentQuestion / (totalQuestions - 1)) * 100);
  }, [currentQuestion, totalQuestions]);

  // Prevent refreshes from resetting the assessment state, but only if there's actual progress
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (currentQuestion > 0 && !showResults && Object.keys(answers).length > 0) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [currentQuestion, showResults, answers]);

  // Calculate scores and results only when needed for the results dialog
  const getResultData = useCallback(() => {
    if (!answers || Object.keys(answers).length === 0) {
      return null;
    }

    const scores = calculateDassScores(answers);
    const depressionLevel = determineLevel(scores.depression, 'depression');
    const anxietyLevel = determineLevel(scores.anxiety, 'anxiety');
    const stressLevel = determineLevel(scores.stress, 'stress');
    const satisfactionLevel = determineLevel(scores.lifeSatisfaction, 'satisfaction');
    
    return determineMoodResult(
      depressionLevel,
      anxietyLevel,
      stressLevel,
      satisfactionLevel,
      scores.isParent || 0,
      scores.needsHelp || 0,
      effectiveLanguage
    );
  }, [answers, effectiveLanguage]);

  // Handle assessment reset
  const handleReset = useCallback(() => {
    // Clear local storage
    localStorage.removeItem('assessment_progress');
    // Reset assessment state
    resetAssessment();
  }, [resetAssessment]);

  // Run tests in development environment only
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // Run diagnostic tests to verify assessment scoring logic
      console.log("Running assessment scoring tests...");
      runAllTests();
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
