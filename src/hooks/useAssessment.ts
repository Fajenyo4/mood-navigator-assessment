
import { useState, useCallback, useEffect } from 'react';
import { calculateDassScores, determineLevel, determineMoodResult } from '@/utils/assessmentScoring';
import { saveAssessmentResult } from '@/services/assessment';
import { toast } from 'sonner';
import { questions as enQuestions } from '@/translations/en';
import { questions as zhCNQuestions } from '@/translations/zh-CN';
import { questions as zhTWQuestions } from '@/translations/zh-TW';

interface UseAssessmentProps {
  userId: string | undefined;
  userName: string | undefined;
  userEmail: string | undefined;
  defaultLanguage?: string;
  initialQuestion?: number;
  initialAnswers?: { [key: number]: number };
}

export const useAssessment = ({ 
  userId, 
  userName, 
  userEmail, 
  defaultLanguage = 'en',
  initialQuestion = 0,
  initialAnswers = {}
}: UseAssessmentProps) => {
  const getQuestions = useCallback(() => {
    switch (defaultLanguage) {
      case 'zh-CN': 
        return zhCNQuestions;
      case 'zh-HK':
        return zhTWQuestions;
      case 'en':
      default:
        return enQuestions;
    }
  }, [defaultLanguage]);

  const [currentQuestion, setCurrentQuestion] = useState(initialQuestion);
  const [answers, setAnswers] = useState<{ [key: number]: number }>(initialAnswers);
  const [showResults, setShowResults] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>((initialAnswers[initialQuestion + 1]?.toString()) || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updateCounter, setUpdateCounter] = useState(0);
  
  // Remove any auto-saving mechanisms that might cause refreshes
  // Instead, only save progress when explicitly triggered by user actions

  const handleAnswer = useCallback((value: string) => {
    const numericValue = parseInt(value);
    const newAnswers = { ...answers, [currentQuestion + 1]: numericValue };
    
    setAnswers(newAnswers);
    setSelectedOption(value);
    setUpdateCounter(prev => prev + 1);
    
    const questions = getQuestions();
    const questionCount = questions.length;

    if (currentQuestion < questionCount - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption("");
      
      // Save to localStorage without triggering refreshes
      try {
        localStorage.setItem('assessment_progress', JSON.stringify({
          currentQuestion: currentQuestion + 1,
          answers: newAnswers,
          timestamp: Date.now(),
          language: defaultLanguage
        }));
      } catch (error) {
        console.error('Error saving progress to localStorage:', error);
        // Silently fail without disrupting the user experience
      }
    } else {
      handleSubmit(newAnswers);
    }
  }, [currentQuestion, answers, defaultLanguage, getQuestions]);

  const handlePrevious = useCallback(() => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedOption(answers[currentQuestion]?.toString() || "");
      setUpdateCounter(prev => prev + 1);
    }
  }, [currentQuestion, answers]);

  const handleSubmit = async (finalAnswers: { [key: number]: number }) => {
    if (!userId) {
      toast.error("You must be logged in to submit the assessment");
      return;
    }

    setIsSubmitting(true);
    try {
      const questions = getQuestions();
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

      const textAnswers: { [key: string]: string } = {};
      Object.keys(finalAnswers).forEach(questionNum => {
        const qNum = parseInt(questionNum);
        const question = questions.find(q => q.id === qNum);
        if (question) {
          const optionIndex = finalAnswers[qNum];
          textAnswers[qNum] = question.options[optionIndex] || '';
        }
      });

      setShowResults(true);

      // Clear local storage only after successful submission
      localStorage.removeItem('assessment_progress');

      // Save results without triggering page refreshes
      try {
        await saveAssessmentResult(
          userId,
          userName || userEmail || '',
          userEmail || '',
          {
            numeric: finalAnswers,
            text: textAnswers,
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
      } catch (error) {
        console.error('Error saving assessment:', error);
        toast.error('Failed to save your assessment results');
      } finally {
        setIsSubmitting(false);
      }

    } catch (error) {
      console.error('Error processing assessment:', error);
      toast.error('Failed to process your assessment');
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
    setShowResults,
    updateCounter
  };
};
