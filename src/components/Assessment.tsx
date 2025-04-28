
import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import QuestionDisplay from './assessment/QuestionDisplay';
import ResultsDialog from './assessment/ResultsDialog';
import LoadingState from './assessment/LoadingState';
import { useAssessment } from '@/hooks/useAssessment';
import { calculateDassScores, determineLevel, determineMoodResult } from '@/utils/assessmentScoring';

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
  // Add a state to prevent multiple initializations
  const [hasInitialized, setHasInitialized] = useState(false);
  
  // Get the effective language - either from props or from auth context
  const effectiveLanguage = defaultLanguage || authLanguage || 'en';
  
  // Create an optimized function to get saved progress state
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
  
  // Only run initialization once to prevent repeated reloads
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
  } = useAssessment({
    userId: user?.id,
    userName: user?.user_metadata?.name,
    userEmail: user?.email,
    defaultLanguage: effectiveLanguage,
    initialQuestion: initialState.initialQuestion,
    initialAnswers: initialState.initialAnswers
  });

  // Ensure initialization happens only once
  useEffect(() => {
    if (!hasInitialized) {
      setIsInitialized(true);
      setHasInitialized(true);
    }
  }, [hasInitialized]);

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
    console.log(`Getting question data for index ${currentQuestion}. Total questions: ${questions.length}`);
    return questions[currentQuestion];
  }, [currentQuestion, getQuestions]);

  // Calculate progress percentage
  const progressPercentage = React.useMemo(() => {
    return ((currentQuestion + 1) / totalQuestions) * 100;
  }, [currentQuestion, totalQuestions]);

  // Prevent refreshes from resetting the assessment state
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (currentQuestion > 0 && !showResults) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [currentQuestion, showResults]);

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
      scores.needsHelp || 0
    );
  }, [answers]);

  // Use the updated redirect URL
  const REDIRECT_URL = "https://www.mican.life/courses-en";

  if (isSubmitting) {
    return <LoadingState />;
  }

  if (!isInitialized) {
    return null;
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
