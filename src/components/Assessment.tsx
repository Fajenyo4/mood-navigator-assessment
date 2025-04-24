
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import QuestionDisplay from './assessment/QuestionDisplay';
import ResultsDialog from './assessment/ResultsDialog';
import LoadingState from './assessment/LoadingState';
import { useAssessment } from '@/hooks/useAssessment';
import { preventPageRefresh } from '@/utils/preventRefresh';

// Optimize imports by directly importing question sets
import { questions as enQuestions } from '@/translations/en';
import { questions as zhCNQuestions } from '@/translations/zh-CN';
import { questions as zhTWQuestions } from '@/translations/zh-TW';

interface AssessmentProps {
  defaultLanguage?: string;
}

// Cache question counts to avoid recalculation
const QUESTION_COUNTS = {
  'en': enQuestions.length,
  'zh-CN': zhCNQuestions.length,
  'zh-HK': zhTWQuestions.length
};

// Cache questions map for direct access
const QUESTIONS_MAP = {
  'en': enQuestions,
  'zh-CN': zhCNQuestions,
  'zh-HK': zhTWQuestions
};

// Prevent Assessment component from re-rendering unnecessarily
const Assessment = React.memo(function Assessment({ defaultLanguage = 'en' }: AssessmentProps) {
  const { user, language: authLanguage } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Get the effective language - either from props or from auth context
  const effectiveLanguage = useMemo(() => 
    defaultLanguage || authLanguage || 'en'
  , [defaultLanguage, authLanguage]);
  
  // Optimize progress state retrieval with memoization
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
  
  // Get initial state from localStorage - do this once on component mount
  const [initialState] = useState(getSavedProgressState);
  
  const {
    currentQuestion,
    showResults,
    selectedOption,
    isSubmitting,
    answers,
    handleAnswer,
    handlePrevious,
    setShowResults
  } = useAssessment({
    userId: user?.id,
    userName: user?.user_metadata?.name,
    userEmail: user?.email,
    defaultLanguage: effectiveLanguage,
    initialQuestion: initialState.initialQuestion,
    initialAnswers: initialState.initialAnswers
  });

  // Prevent page refresh during assessment
  useEffect(() => {
    // Only add the refresh prevention if we're not showing results and have answers
    if (!showResults && Object.keys(answers).length > 0) {
      const cleanup = preventPageRefresh();
      return cleanup;
    }
  }, [showResults, answers]);

  // Immediately mark as initialized on first render
  useEffect(() => {
    setIsInitialized(true);
  }, []);

  // Calculate the total number of questions for the current language - memoized
  const totalQuestions = useMemo(() => {
    return QUESTION_COUNTS[effectiveLanguage as keyof typeof QUESTION_COUNTS] || QUESTION_COUNTS['en'];
  }, [effectiveLanguage]);

  // Memoize the current question for better performance
  const currentQuestionData = useMemo(() => {
    const questions = QUESTIONS_MAP[effectiveLanguage as keyof typeof QUESTIONS_MAP] || QUESTIONS_MAP['en'];
    return questions[currentQuestion] || null;
  }, [currentQuestion, effectiveLanguage]);

  // Calculate progress percentage - memoized
  const progressPercentage = useMemo(() => {
    return Math.max(5, (currentQuestion / totalQuestions) * 100);
  }, [currentQuestion, totalQuestions]);

  // Don't render anything until initialized to prevent flashes
  if (!isInitialized) {
    return null;
  }

  if (isSubmitting) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {currentQuestionData && (
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
      )}
      
      <ResultsDialog
        open={showResults}
        onOpenChange={setShowResults}
        result={showResults ? determineResultData() : null}
        language={effectiveLanguage}
      />
    </div>
  );
  
  // Function to calculate results inline for better organization
  function determineResultData() {
    if (!showResults) return null;
    
    const { calculateDassScores, determineLevel, determineMoodResult } = require('@/utils/assessmentScoring');
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
      scores.isParent,
      scores.needsHelp
    );
  }
});

Assessment.displayName = 'Assessment';

export default Assessment;
