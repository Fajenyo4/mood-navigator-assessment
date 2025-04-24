
import { useEffect } from 'react';

interface ProgressState {
  currentQuestion: number;
  answers: { [key: number]: number };
  timestamp: number;
  language: string;
}

export const useProgressPersistence = (
  answers: { [key: number]: number },
  currentQuestion: number,
  language: string
) => {
  useEffect(() => {
    if (Object.keys(answers).length === 0) return;
    
    const saveTimeout = setTimeout(() => {
      try {
        localStorage.setItem('assessment_progress', JSON.stringify({
          currentQuestion,
          answers,
          timestamp: Date.now(),
          language
        }));
      } catch (error) {
        console.error('Error saving assessment progress to localStorage:', error);
      }
    }, 300);
    
    return () => clearTimeout(saveTimeout);
  }, [answers, currentQuestion, language]);
};

export const getSavedProgressState = (effectiveLanguage: string) => {
  try {
    const savedProgress = localStorage.getItem('assessment_progress');
    if (savedProgress) {
      const { currentQuestion, answers, timestamp, language } = JSON.parse(savedProgress);
      if (Date.now() - timestamp < 3600000 && language === effectiveLanguage) {
        return { initialQuestion: currentQuestion, initialAnswers: answers };
      }
      localStorage.removeItem('assessment_progress');
    }
  } catch (error) {
    console.error('Error parsing assessment progress:', error);
    localStorage.removeItem('assessment_progress');
  }
  
  return { initialQuestion: 0, initialAnswers: {} };
};
