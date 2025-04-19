
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import QuestionDisplay from './assessment/QuestionDisplay';
import ResultsDialog from './assessment/ResultsDialog';
import LoadingState from './assessment/LoadingState';
import { useAssessment } from '@/hooks/useAssessment';
import { calculateDassScores, determineLevel, determineMoodResult } from '@/utils/assessmentScoring';
import { AVAILABLE_LANGUAGES } from '@/constants/languages';
import { Question } from '@/types/assessment';

// Import all question sets
import { questions as enQuestions } from '@/translations/en';
import { questions as zhCNQuestions } from '@/translations/zh-CN';
import { questions as zhTWQuestions } from '@/translations/zh-TW';

interface AssessmentProps {
  defaultLanguage?: string;
}

const Assessment: React.FC<AssessmentProps> = ({ defaultLanguage = 'en' }) => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>(enQuestions);
  
  // Select the appropriate question set based on language
  useEffect(() => {
    switch (defaultLanguage) {
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
    console.log(`Loaded questions for language: ${defaultLanguage}`);
  }, [defaultLanguage]);
  
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
    defaultLanguage
  });

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

  // Choose the correct redirect URL based on language
  const getRedirectUrl = () => {
    switch (defaultLanguage) {
      case 'zh-CN':
        return "https://www.mican.life/courses-cn";
      case 'zh-TW':
        return "https://www.mican.life/courses-tw";
      case 'en':
      default:
        return "https://www.mican.life/courses-en";
    }
  };

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
        onManualRedirect={() => window.location.href = getRedirectUrl()}
      />
    </div>
  );
};

export default Assessment;
