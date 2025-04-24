
import React, { useEffect, useState, useCallback, useMemo, Suspense, lazy } from 'react';
import { useAuth } from '@/context/AuthContext';
import QuestionDisplay from './assessment/QuestionDisplay';
import ResultsDialog from './assessment/ResultsDialog';
import LoadingState from './assessment/LoadingState';
import { useAssessment } from '@/hooks/useAssessment';
import { preventPageRefresh } from '@/utils/preventRefresh';
import { calculateDassScores, determineLevel, determineMoodResult } from '@/utils/assessmentScoring';

// Define props interface for Assessment component
interface AssessmentProps {
  defaultLanguage?: string;
}

// Optimize imports by lazily loading question sets
// Use dynamic imports for questions to improve initial load time
const questionSets = {
  'en': () => import('@/translations/en').then(module => module.questions),
  'zh-CN': () => import('@/translations/zh-CN').then(module => module.questions),
  'zh-HK': () => import('@/translations/zh-TW').then(module => module.questions)
};

// Cache question counts to avoid recalculation
const QUESTION_COUNTS = {
  'en': 21,  // hardcoded counts for faster initial render
  'zh-CN': 21,
  'zh-HK': 21
};

// Get saved progress state - moved outside component to avoid re-creation
const getSavedProgressState = (effectiveLanguage) => {
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
};

// Prevent Assessment component from re-rendering unnecessarily
const Assessment = React.memo(function Assessment({ defaultLanguage = 'en' }: AssessmentProps) {
  const { user, language: authLanguage } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [questions, setQuestions] = useState(null);
  
  // Get the effective language - either from props or from auth context
  const effectiveLanguage = useMemo(() => 
    defaultLanguage || authLanguage || 'en'
  , [defaultLanguage, authLanguage]);
  
  // Initialize state only once with initializer function
  const [initialState] = useState(() => getSavedProgressState(effectiveLanguage));
  
  // Load questions asynchronously
  useEffect(() => {
    let isMounted = true;
    
    const loadQuestions = async () => {
      try {
        setIsLoading(true);
        const loader = questionSets[effectiveLanguage] || questionSets['en'];
        const loadedQuestions = await loader();
        
        // Only update state if component is still mounted
        if (isMounted) {
          setQuestions(loadedQuestions);
          setIsLoading(false);
          setIsInitialized(true);
        }
      } catch (error) {
        console.error('Error loading questions:', error);
        if (isMounted) {
          setIsLoading(false);
          setIsInitialized(true);
        }
      }
    };
    
    loadQuestions();
    
    return () => {
      isMounted = false;
    };
  }, [effectiveLanguage]);
  
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

  // Prevent page refresh during assessment - with proper cleanup
  useEffect(() => {
    // Only add the refresh prevention if we're not showing results and have answers
    if (!showResults && Object.keys(answers).length > 0) {
      console.log('Adding page refresh prevention');
      const cleanup = preventPageRefresh();
      return cleanup;
    }
  }, [showResults, answers]);

  // Calculate the total number of questions for the current language - memoized
  const totalQuestions = useMemo(() => {
    return QUESTION_COUNTS[effectiveLanguage] || QUESTION_COUNTS['en'];
  }, [effectiveLanguage]);

  // Memoize the current question for better performance
  const currentQuestionData = useMemo(() => {
    if (!questions) return null;
    return questions[currentQuestion] || null;
  }, [questions, currentQuestion]);

  // Calculate progress percentage - improved calculation
  const progressPercentage = useMemo(() => {
    // Calculate progress based on answers submitted
    const answeredCount = Object.keys(answers).length;
    
    // If no questions answered yet, return 0
    if (answeredCount === 0) {
      return 0;
    }
    
    // If answering the last question, show 100%
    if (currentQuestion >= totalQuestions - 1) {
      return 100;
    }
    
    // Progress is based on the number of answered questions
    // We multiply by 100 and divide by total questions to get percentage
    return Math.min((answeredCount / totalQuestions) * 100, 100);
  }, [currentQuestion, totalQuestions, answers]);

  // Don't render anything until initialized to prevent flashes
  if (!isInitialized) {
    return null;
  }

  if (isSubmitting) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {<QuestionDisplay
        currentQuestion={currentQuestion}
        totalQuestions={totalQuestions}
        progress={progressPercentage}
        question={currentQuestionData}
        selectedOption={selectedOption}
        onAnswer={handleAnswer}
        onPrevious={handlePrevious}
        showPrevious={currentQuestion > 0}
        isLoading={isLoading}
      />}
      
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
    
    // Use imported functions instead of require
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
