
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

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
  const [initializationError, setInitializationError] = useState<Error | null>(null);
  
  // Get the effective language - either from props or from auth context
  const effectiveLanguage = defaultLanguage || authLanguage || 'en';
  
  // Get the initial state with proper error handling
  const getSavedProgressState = useCallback(() => {
    try {
      console.log('Checking for saved assessment progress...');
      const savedProgress = localStorage.getItem('assessment_progress');
      if (savedProgress) {
        const { currentQuestion, answers, timestamp, language } = JSON.parse(savedProgress);
        // Only restore if saved within last hour and language matches
        if (Date.now() - timestamp < 3600000 && language === effectiveLanguage) {
          console.log('Found recent saved progress, resuming from question:', currentQuestion);
          return { initialQuestion: currentQuestion, initialAnswers: answers };
        }
        // Clear invalid progress data
        console.log('Found outdated saved progress, clearing');
        localStorage.removeItem('assessment_progress');
      } else {
        console.log('No saved progress found, starting new assessment');
      }
    } catch (error) {
      console.error('Error parsing assessment progress:', error);
      localStorage.removeItem('assessment_progress');
    }
    
    return { initialQuestion: 0, initialAnswers: {} };
  }, [effectiveLanguage]);
  
  // Only run initialization once with memoization for performance
  const initialState = useMemo(() => getSavedProgressState(), [getSavedProgressState]);

  // Get the correct question set based on language with memoization
  const getQuestions = useCallback(() => {
    console.log('Getting questions for language:', effectiveLanguage);
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

  // Calculate the total number of questions for the current language with memoization
  const totalQuestions = useMemo(() => {
    return questionCounts[effectiveLanguage as keyof typeof questionCounts] || enQuestions.length;
  }, [effectiveLanguage]);

  useEffect(() => {
    let isMounted = true;
    
    const initialize = async () => {
      try {
        console.log('Initializing assessment setup...');
        setIsLoading(true);
        
        // Simulate async initialization with a small delay for better UX
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Prepare questions by preloading them
        const currentQuestions = getQuestions();
        console.log(`Loaded ${currentQuestions.length} questions for language: ${effectiveLanguage}`);
        
        if (isMounted) {
          setIsInitialized(true);
          setIsLoading(false);
          console.log('Assessment setup initialized successfully');
        }
      } catch (error: any) {
        console.error('Error during initialization:', error);
        if (isMounted) {
          setInitializationError(error);
          setIsLoading(false);
          toast.error('Failed to load assessment. Please refresh and try again.');
        }
      }
    };

    initialize();
    
    return () => {
      isMounted = false;
    };
  }, [effectiveLanguage, getQuestions]);

  // If there was an error during initialization, show a toast
  useEffect(() => {
    if (initializationError) {
      toast.error('Failed to load assessment. Please refresh and try again.');
    }
  }, [initializationError]);

  return {
    effectiveLanguage,
    isInitialized,
    isLoading,
    totalQuestions,
    getQuestions,
    initialState,
  };
};
