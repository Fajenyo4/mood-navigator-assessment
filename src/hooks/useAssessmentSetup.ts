
import { useState, useEffect, useCallback } from 'react';
import React from 'react';
import { useAuth } from '@/context/AuthContext';

// Import question sets for preloading
import { questions as enQuestions } from '@/translations/en';
import { questions as zhCNQuestions } from '@/translations/zh-CN';
import { questions as zhTWQuestions } from '@/translations/zh-TW';

// Optimize initial loading by precomputing total questions for each language
const questionCounts = {
  'en': enQuestions.length,
  'zh-CN': zhCNQuestions.length,
  'zh-HK': zhTWQuestions.length
};

interface UseAssessmentSetupProps {
  defaultLanguage?: string;
}

interface AssessmentSetupResult {
  effectiveLanguage: string;
  isInitialized: boolean;
  isLoading: boolean;
  totalQuestions: number;
  getQuestions: () => any[];
  initialState: {
    initialQuestion: number;
    initialAnswers: { [key: number]: number };
  };
}

export const useAssessmentSetup = ({ 
  defaultLanguage = 'en' 
}: UseAssessmentSetupProps): AssessmentSetupResult => {
  const { language: authLanguage } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Get the effective language - either from props or from auth context
  const effectiveLanguage = defaultLanguage || authLanguage || 'en';
  
  // Get the initial state - empty by default
  const getSavedProgressState = useCallback(() => {
    try {
      const savedProgress = localStorage.getItem('assessment_progress');
      if (savedProgress) {
        const { currentQuestion, answers, timestamp, language } = JSON.parse(savedProgress);
        // Only restore if saved within last hour and language matches
        if (Date.now() - timestamp < 3600000 && language === effectiveLanguage) {
          return { initialQuestion: currentQuestion, initialAnswers: answers };
        }
        // Clear invalid progress data
        localStorage.removeItem('assessment_progress');
      }
    } catch (error) {
      console.error('Error parsing assessment progress:', error);
      localStorage.removeItem('assessment_progress');
    }
    
    return { initialQuestion: 0, initialAnswers: {} };
  }, [effectiveLanguage]);
  
  // Only run initialization once
  const initialState = useState(() => getSavedProgressState())[0];

  // Get the correct question set based on language
  const getQuestions = useCallback(() => {
    switch (effectiveLanguage) {
      case 'zh-CN': 
        return zhCNQuestions;
      case 'zh-HK':
        return zhTWQuestions; // Use Traditional Chinese (zh-TW) for Cantonese (zh-HK)
      case 'en':
      default:
        return enQuestions;
    }
  }, [effectiveLanguage]);

  // Calculate the total number of questions for the current language
  const totalQuestions = React.useMemo(() => {
    return questionCounts[effectiveLanguage as keyof typeof questionCounts] || enQuestions.length;
  }, [effectiveLanguage]);

  useEffect(() => {
    const initialize = async () => {
      try {
        setIsLoading(true);
        // Preload all question sets in the background
        await Promise.all([
          Promise.resolve(), // Simulate async initialization
          // Questions are already imported at the top, so no need to import again
        ]);
        setIsInitialized(true);
      } catch (error) {
        console.error('Error during initialization:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  return {
    effectiveLanguage,
    isInitialized,
    isLoading,
    totalQuestions,
    getQuestions,
    initialState,
  };
};
