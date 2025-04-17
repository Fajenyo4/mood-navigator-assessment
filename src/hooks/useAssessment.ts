
import { useState } from 'react';
import { Question } from '@/types/assessment';
import { calculateDassScores, determineLevel, determineMoodResult } from '@/utils/assessmentScoring';
import { saveAssessmentResult } from '@/services/assessment';
import { toast } from 'sonner';
import { questions } from '@/translations/en';

interface UseAssessmentProps {
  userId: string | undefined;
  userName: string | undefined;
  userEmail: string | undefined;
  defaultLanguage?: string;
}

export const useAssessment = ({ 
  userId, 
  userName, 
  userEmail, 
  defaultLanguage = 'en' 
}: UseAssessmentProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [showResults, setShowResults] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAnswer = async (value: string) => {
    const numericValue = parseInt(value);
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
    if (!userId) {
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
        userId,
        userName || userEmail || '',
        userEmail || '',
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
    } catch (error) {
      console.error('Error saving assessment:', error);
      toast.error('Failed to save your assessment results');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    currentQuestion,
    answers,
    showResults,
    selectedOption,
    isSubmitting,
    handleAnswer,
    handlePrevious,
    setShowResults
  };
};
