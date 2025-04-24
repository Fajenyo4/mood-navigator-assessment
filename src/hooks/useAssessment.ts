
import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
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

// Cache questions map for direct access
const QUESTIONS_MAP = {
  'en': enQuestions,
  'zh-CN': zhCNQuestions,
  'zh-HK': zhTWQuestions
};

export const useAssessment = ({ 
  userId, 
  userName, 
  userEmail, 
  defaultLanguage = 'en',
  initialQuestion = 0,
  initialAnswers = {}
}: UseAssessmentProps) => {
  // Get questions based on language - memoized to prevent recreating on each render
  const questions = useMemo(() => {
    return QUESTIONS_MAP[defaultLanguage as keyof typeof QUESTIONS_MAP] || QUESTIONS_MAP['en'];
  }, [defaultLanguage]);

  const [currentQuestion, setCurrentQuestion] = useState(initialQuestion);
  const [answers, setAnswers] = useState<{ [key: number]: number }>(initialAnswers);
  const [showResults, setShowResults] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>((initialAnswers[initialQuestion + 1]?.toString()) || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Use a ref to track if a submission is in progress
  const isSubmittingRef = useRef(false);

  // Cache the question count for better performance
  const questionCount = useMemo(() => questions.length, [questions]);

  // Store progress in localStorage with debouncing to prevent excessive writes
  useEffect(() => {
    if (Object.keys(answers).length === 0) return;
    
    const saveTimeout = setTimeout(() => {
      try {
        localStorage.setItem('assessment_progress', JSON.stringify({
          currentQuestion,
          answers,
          timestamp: Date.now(),
          language: defaultLanguage
        }));
      } catch (error) {
        console.error('Error saving assessment progress to localStorage:', error);
      }
    }, 300); // Debounce localStorage writes by 300ms
    
    return () => clearTimeout(saveTimeout);
  }, [answers, currentQuestion, defaultLanguage]);

  // Handle browser beforeunload event to warn about losing progress
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (Object.keys(answers).length > 0 && !showResults) {
        // Standard way to show a confirmation dialog
        e.preventDefault();
        e.returnValue = ''; // Chrome requires returnValue to be set
        return ''; // This message isn't actually displayed in modern browsers
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [answers, showResults]);

  // Memoize answers processing to avoid unnecessary recalculations
  const handleAnswer = useCallback((value: string) => {
    try {
      const numericValue = parseInt(value);
      
      setAnswers(prev => {
        const newAnswers = { ...prev, [currentQuestion + 1]: numericValue };
        return newAnswers;
      });
      
      setSelectedOption(value);

      // Move to next question or submit
      if (currentQuestion < questionCount - 1) {
        setCurrentQuestion(currentQ => {
          const nextQuestion = currentQ + 1;
          return nextQuestion;
        });
        setSelectedOption("");
      } else {
        // Create new answers object with the latest answer
        const finalAnswers = { ...answers, [currentQuestion + 1]: numericValue };
        handleSubmit(finalAnswers);
      }
    } catch (error) {
      console.error('Error handling answer:', error);
      toast.error('There was an error processing your answer. Please try again.');
    }
  }, [currentQuestion, answers, questionCount]);

  // Optimize previous question navigation
  const handlePrevious = useCallback(() => {
    if (currentQuestion > 0) {
      const prevQuestion = currentQuestion - 1;
      setCurrentQuestion(prevQuestion);
      setSelectedOption(answers[prevQuestion + 1]?.toString() || "");
    }
  }, [currentQuestion, answers]);

  // Optimize textAnswers creation with memoization
  const createTextAnswers = useCallback((finalAnswers: { [key: number]: number }) => {
    const textAnswers: { [key: string]: string } = {};
    Object.entries(finalAnswers).forEach(([questionNumStr, optionIndex]) => {
      const qNum = parseInt(questionNumStr);
      const question = questions.find(q => q.id === qNum);
      if (question && question.options && question.options[optionIndex]) {
        textAnswers[qNum] = question.options[optionIndex];
      }
    });
    return textAnswers;
  }, [questions]);

  // Optimize the submission process
  const handleSubmit = async (finalAnswers: { [key: number]: number }) => {
    // Prevent duplicate submissions
    if (isSubmittingRef.current) {
      return;
    }
    
    if (!userId) {
      toast.error("You must be logged in to submit the assessment");
      return;
    }
    
    isSubmittingRef.current = true;
    setIsSubmitting(true);
    
    try {
      // Calculate scores - memoized for performance
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

      // Create text answers in background
      const textAnswers = createTextAnswers(finalAnswers);

      // Show results immediately
      setShowResults(true);
      
      // Clear progress to prevent reloading data after completion
      localStorage.removeItem('assessment_progress');

      // Save results in background
      saveAssessmentResult(
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
      ).catch(error => {
        console.error('Error saving assessment:', error);
        toast.error('Failed to save your assessment results');
      }).finally(() => {
        setIsSubmitting(false);
        isSubmittingRef.current = false;
      });
    } catch (error) {
      console.error('Error processing assessment:', error);
      toast.error('Failed to process your assessment');
      setIsSubmitting(false);
      isSubmittingRef.current = false;
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
