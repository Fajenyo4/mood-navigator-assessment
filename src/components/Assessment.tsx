
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import QuestionDisplay from './assessment/QuestionDisplay';
import ResultsDialog from './assessment/ResultsDialog';
import LoadingState from './assessment/LoadingState';
import { useAssessment } from '@/hooks/useAssessment';
import { calculateDassScores, determineLevel, determineMoodResult } from '@/utils/assessmentScoring';
import { Question } from '@/types/assessment';

// Import all question sets
import { questions as enQuestions } from '@/translations/en';
import { questions as zhCNQuestions } from '@/translations/zh-CN';
import { questions as zhTWQuestions } from '@/translations/zh-TW';

interface AssessmentProps {
  defaultLanguage?: string;
}

const Assessment: React.FC<AssessmentProps> = ({ defaultLanguage = 'en' }) => {
  const { user, language: authLanguage } = useAuth();
  const [questions, setQuestions] = useState<Question[]>(enQuestions);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Get the effective language - either from props or from auth context
  const effectiveLanguage = defaultLanguage || authLanguage || 'en';
  
  // Select the appropriate question set based on language
  useEffect(() => {
    switch (effectiveLanguage) {
      case 'zh-CN':
        setQuestions(zhCNQuestions);
        break;
      case 'zh-HK':
        setQuestions(zhTWQuestions); // Using zh-TW questions for zh-HK
        break;
      case 'en':
      default:
        setQuestions(enQuestions);
        break;
    }
    console.log(`Loaded questions for language: ${effectiveLanguage}`);
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
    defaultLanguage: effectiveLanguage
  });

  // Set initialization flag after initial render
  useEffect(() => {
    setIsInitialized(true);
  }, []);

  // Prevent refreshes from resetting the assessment state
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (currentQuestion > 0 && !showResults) {
        // Only prevent if user has started but not finished
        const message = "Are you sure you want to leave? Your assessment progress will be lost.";
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [currentQuestion, showResults]);

  if (isSubmitting) {
    return <LoadingState />;
  }

  // Calculate scores and results only when needed for the results dialog
  const getResultData = () => {
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
  };

  // Use the updated redirect URL
  const REDIRECT_URL = "https://www.mican.life/courses-en";

  // Don't render until we're initialized to prevent flickering
  if (!isInitialized) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <QuestionDisplay
        currentQuestion={currentQuestion}
        totalQuestions={questions.length}
        progress={(currentQuestion / questions.length) * 100}
        question={questions[currentQuestion]}
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
