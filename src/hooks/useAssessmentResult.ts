
import { useCallback, useState, useEffect, useMemo } from 'react';
import { calculateDassScores, determineLevel, determineMoodResult } from '@/utils/scoring';
import type { MoodResult } from '@/utils/scoring';
import { toast } from 'sonner';

interface UseAssessmentResultProps {
  answers: { [key: number]: number };
  effectiveLanguage: string;
  showResults: boolean;  // Add this prop to detect when results should be calculated
}

export const useAssessmentResult = ({ 
  answers, 
  effectiveLanguage,
  showResults
}: UseAssessmentResultProps) => {
  const [isResultLoading, setIsResultLoading] = useState(false);
  const [lastResult, setLastResult] = useState<MoodResult | null>(null);
  const [error, setError] = useState<boolean>(false);
  const [retryCount, setRetryCount] = useState(0);

  // Create a memoized default result for performance
  const defaultResult = useMemo(() => ({
    mood: "Medium to High Sub-Health Status",
    message: "Assessment completed",
    redirectUrl: "https://www.mican.life/courses-en",
    iconType: "meh" as "smile" | "meh" | "frown",
    iconColor: "text-blue-500",
    depressionResult: {
      score: 0,
      level: "Normal" as any,
      message: "normal",
      rank: 1
    },
    anxietyResult: {
      score: 0,
      level: "Normal" as any,
      message: "normal",
      rank: 1
    },
    stressResult: {
      score: 0,
      level: "Normal" as any,
      message: "normal",
      rank: 1
    },
    satisfactionResult: {
      score: 16,
      level: "Neutral" as any,
      message: "neutral",
      rank: 3
    },
    isParent: 0,
    needsHelp: 0,
    assessmentText: ""
  }), []);

  // Calculate scores and results with improved error handling and caching
  const getResultData = useCallback((): MoodResult | null => {
    // Set loading state
    setIsResultLoading(true);
    setError(false);
    
    try {
      console.log("Calculating results with answers:", answers);
      
      // Check if answers are empty but handle it gracefully instead of early return
      if (!answers || Object.keys(answers).length === 0) {
        console.log("Warning: No answers provided, using default values");
        setLastResult(defaultResult);
        setIsResultLoading(false);
        return defaultResult;
      }
      
      const scores = calculateDassScores(answers);
      console.log("Calculated scores:", scores);
      
      const depressionLevel = determineLevel(scores.depression, 'depression');
      const anxietyLevel = determineLevel(scores.anxiety, 'anxiety');
      const stressLevel = determineLevel(scores.stress, 'stress');
      const satisfactionLevel = determineLevel(scores.lifeSatisfaction, 'satisfaction');
      
      console.log("Determined levels:", { 
        depression: depressionLevel, 
        anxiety: anxietyLevel, 
        stress: stressLevel, 
        satisfaction: satisfactionLevel 
      });
      
      const result = determineMoodResult(
        depressionLevel,
        anxietyLevel,
        stressLevel,
        satisfactionLevel,
        scores.isParent || 0,
        scores.needsHelp || 0,
        effectiveLanguage
      );
      
      console.log("Final mood result:", result);
      
      // Cache the result for future use
      setLastResult(result);
      // Reset retry count on success
      setRetryCount(0);
      setIsResultLoading(false);
      return result;
    } catch (error) {
      console.error("Error calculating assessment results:", error);
      setIsResultLoading(false);
      setError(true);
      
      // Implement retry logic for transient errors
      if (retryCount < 3) {
        console.log(`Retrying calculation (${retryCount + 1}/3)...`);
        setRetryCount(prev => prev + 1);
        // Retry after a short delay
        setTimeout(() => {
          getResultData();
        }, 500);
        return null;
      }
      
      // After max retries, show error and return default
      toast.error("Unable to calculate your results. Please try again.");
      return defaultResult;
    }
  }, [answers, effectiveLanguage, defaultResult, retryCount]);

  // Automatically calculate results when showResults changes to true
  useEffect(() => {
    if (showResults) {
      console.log("Results requested, calculating...");
      const result = getResultData();
      // Additional safety check
      if (!result) {
        console.log("Warning: getResultData returned null, setting error state");
        setError(true);
      }
    }
  }, [showResults, getResultData]);
  
  return { 
    getResultData,
    isResultLoading,
    lastResult,
    error
  };
};
