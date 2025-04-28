
import { useState, useCallback, useEffect, useRef } from 'react';
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
  // Reference to track initialization
  const initialized = useRef(false);

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
  
  // Only save progress locally without triggering any refreshes
  const saveProgressLocally = useCallback((newQuestion: number, newAnswers: { [key: number]: number }) => {
    try {
      localStorage.setItem('assessment_progress', JSON.stringify({
        currentQuestion: newQuestion,
        answers: newAnswers,
        timestamp: Date.now(),
        language: defaultLanguage
      }));
    } catch (error) {
      console.error('Error saving progress to localStorage:', error);
      // Silently fail without disrupting user experience
    }
  }, [defaultLanguage]);

  // Add a reset function to completely reset the assessment state
  const resetAssessment = useCallback(() => {
    setCurrentQuestion(0);
    setAnswers({});
    setSelectedOption("");
    setShowResults(false);
    setUpdateCounter(prev => prev + 1);
    
    // Clear any saved progress from localStorage
    localStorage.removeItem('assessment_progress');
    
    console.log("Assessment has been reset to initial state");
    toast.success("Assessment reset successfully");
  }, []);

  const handleAnswer = useCallback((value: string) => {
    const numericValue = parseInt(value);
    const newAnswers = { ...answers, [currentQuestion + 1]: numericValue };
    
    setAnswers(newAnswers);
    setSelectedOption(value);
    setUpdateCounter(prev => prev + 1); // Force re-render for selection UI
    
    const questions = getQuestions();
    const questionCount = questions.length;

    if (currentQuestion < questionCount - 1) {
      const nextQuestion = currentQuestion + 1;
      setCurrentQuestion(nextQuestion);
      setSelectedOption("");
      
      // Save progress locally without triggering refreshes
      saveProgressLocally(nextQuestion, newAnswers);
    } else {
      handleSubmit(newAnswers);
    }
  }, [currentQuestion, answers, getQuestions, saveProgressLocally]);

  const handlePrevious = useCallback(() => {
    if (currentQuestion > 0) {
      const prevQuestion = currentQuestion - 1;
      setCurrentQuestion(prevQuestion);
      // Set the previous answer as selected
      setSelectedOption(answers[prevQuestion + 1]?.toString() || "");
      // Force UI update to show selection correctly
      setUpdateCounter(prev => prev + 1);
      
      // Update local storage with the current state
      saveProgressLocally(prevQuestion, answers);
    }
  }, [currentQuestion, answers, saveProgressLocally]);

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
        
        // Clear local storage only after successful submission
        localStorage.removeItem('assessment_progress');
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

  // Run initialization only once
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      
      // No auto-refreshes or auto-saving that might cause issues
      console.log("Assessment initialized with question:", initialQuestion);
    }
  }, [initialQuestion]);

  return {
    currentQuestion,
    answers,
    showResults,
    selectedOption,
    isSubmitting,
    handleAnswer,
    handlePrevious,
    setShowResults,
    updateCounter,
    resetAssessment  // Export the reset function
  };
};
