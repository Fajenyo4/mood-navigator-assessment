import React from 'react';
import { useAuth } from '@/context/AuthContext';
import QuestionDisplay from './assessment/QuestionDisplay';
import ResultsDialog from './assessment/ResultsDialog';
import LoadingState from './assessment/LoadingState';
import { useAssessment } from '@/hooks/useAssessment';
import { questions } from '@/translations/en';

interface AssessmentProps {
  defaultLanguage?: string;
}

const Assessment: React.FC<AssessmentProps> = ({ defaultLanguage = 'en' }) => {
  const { user } = useAuth();
  
  const {
    currentQuestion,
    showResults,
    selectedOption,
    isSubmitting,
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
        result={determineMoodResult(
          determineLevel(calculateDassScores(answers).depression, 'depression'),
          determineLevel(calculateDassScores(answers).anxiety, 'anxiety'),
          determineLevel(calculateDassScores(answers).stress, 'stress'),
          determineLevel(calculateDassScores(answers).lifeSatisfaction, 'satisfaction'),
          answers[27] || 0,
          answers[28] || 0
        )}
        onManualRedirect={() => window.location.href = "https://www.micancapital.au/courses-en"}
      />
    </div>
  );
};

export default Assessment;
