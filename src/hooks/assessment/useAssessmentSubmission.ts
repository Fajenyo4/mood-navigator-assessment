
import { useCallback } from 'react';
import { saveAssessmentResult } from '@/services/assessment';
import { calculateDassScores, determineLevel, determineMoodResult } from '@/utils/scoring';
import { toast } from 'sonner';

interface UseAssessmentSubmissionProps {
  userId: string | undefined;
  userName: string | undefined;
  userEmail: string | undefined;
  defaultLanguage: string;
  answers: { [key: number]: number };
  getQuestions: () => any[];
  setIsSubmitting: (value: boolean) => void;
  setShowResults: (value: boolean) => void;
}

export const useAssessmentSubmission = ({
  userId,
  userName,
  userEmail,
  answers,
  defaultLanguage,
  getQuestions,
  setIsSubmitting,
  setShowResults
}: UseAssessmentSubmissionProps) => {
  
  const handleSubmit = useCallback(async (finalAnswers: { [key: number]: number }) => {
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
        scores.needsHelp,
        defaultLanguage
      );

      // const textAnswers: { [key: string]: string } = {};
      // Object.keys(finalAnswers).forEach(questionNum => {
      //   const qNum = parseInt(questionNum);
      //   const question = questions.find(q => q.id === qNum);
      //   if (question) {
      //     const optionIndex = finalAnswers[qNum];
      //     textAnswers[qNum] = question.options[optionIndex] || '';
      //   }
      // });

      setShowResults(true);


      // Save results without triggering page refreshes
      try {
        await saveAssessmentResult(
          userId,
          userName || userEmail || '',
          userEmail || '',
          {
            numeric: finalAnswers,
            text: answers,
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
  }, [userId, userName, userEmail, defaultLanguage, getQuestions, setIsSubmitting, setShowResults]);

  return { handleSubmit };
};
