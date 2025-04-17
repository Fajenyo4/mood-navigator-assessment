
import React, { useState, useEffect } from 'react';
import QuestionDisplay from './assessment/QuestionDisplay';
import ResultsDialog from './assessment/ResultsDialog';
import { calculateDassScores, determineLevel, determineMoodResult } from '@/utils/assessmentScoring';
import { saveAssessmentResult } from '@/services/assessment';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { questions } from '@/translations/en';
import { Question } from '@/types/assessment';
import { Loader2 } from 'lucide-react';

interface AssessmentProps {
  defaultLanguage?: string;
}

const Assessment: React.FC<AssessmentProps> = ({ defaultLanguage = 'en' }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [showResults, setShowResults] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const handleAnswer = (value: string) => {
    const numericValue = parseInt(value);
    
    // Store answer
    const newAnswers = { ...answers, [currentQuestion + 1]: numericValue };
    setAnswers(newAnswers);
    setSelectedOption(value);

    // Move to next question after a short delay
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption("");
      } else {
        handleSubmit(newAnswers);
      }
    }, 300);
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedOption(answers[currentQuestion]?.toString() || "");
    }
  };

  const handleSubmit = async (finalAnswers: { [key: number]: number }) => {
    if (!user) {
      toast.error("You must be logged in to submit the assessment");
      return;
    }

    setIsSubmitting(true);
    try {
      const scores = calculateDassScores(finalAnswers);
      const depressionLevel = determineLevel(scores.depression, 'depression');
      const anxietyLevel = determineLevel(scores.anxiety, 'anxiety');
      const stressLevel = determineLevel(scores.stress, 'stress');
      const satisfactionLevel = determineLevel(scores.lifeSatisfaction, 'satisfaction');

      const result = determineMoodResult(
        depressionLevel,
        anxietyLevel,
        stressLevel,
        satisfactionLevel,
        scores.isParent,
        scores.needsHelp
      );

      await saveAssessmentResult(
        user.id,
        user.user_metadata?.name || user.email || '',
        user.email || '',
        {
          numeric: finalAnswers,
          text: Object.fromEntries(
            Object.entries(finalAnswers).map(([key, value]) => [
              key,
              questions[parseInt(key) - 1].options[value]
            ])
          ),
          scores,
          levels: {
            depression: depressionLevel.level,
            anxiety: anxietyLevel.level,
            stress: stressLevel.level,
            lifeSatisfaction: satisfactionLevel.level
          }
        },
        result.mood,
        defaultLanguage,
        {
          depression: scores.depression,
          anxiety: scores.anxiety,
          stress: scores.stress,
          lifeSatisfaction: scores.lifeSatisfaction
        }
      );

      setShowResults(true);
      
      // Redirect after 10 seconds
      setTimeout(() => {
        window.location.href = "https://www.micancapital.au/courses-en";
      }, 10000);

    } catch (error) {
      console.error('Error saving assessment:', error);
      toast.error('Failed to save your assessment results');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitting) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-gray-600">Processing your assessment...</p>
      </div>
    );
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
