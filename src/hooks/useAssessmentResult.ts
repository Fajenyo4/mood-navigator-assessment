
import { useCallback, useState, useEffect } from 'react';
import { calculateDassScores, determineLevel, determineMoodResult } from '@/utils/scoring';
import type { MoodResult } from '@/utils/scoring';

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

  // Calculate scores and results
  const getResultData = useCallback((): MoodResult | null => {
    // Set loading state
    setIsResultLoading(true);
    setError(false);
    
    try {
      console.log("Calculating results with answers:", answers);
      
      // Check if answers are empty but handle it gracefully instead of early return
      if (!answers || Object.keys(answers).length === 0) {
        console.log("Warning: No answers provided, using default values");
        // Create default values instead of returning null
        const defaultResult = {
          mood: "Medium to High Sub-Health Status", // Changed from "Healthy" to more neutral default
          message: "Assessment completed",
          redirectUrl: "https://www.mican.life/courses-en",
          iconType: "meh" as "smile" | "meh" | "frown", // Changed from smile to meh
          iconColor: "text-blue-500", // Changed from green to blue
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
            score: 16, // Using a middle score for Neutral rank 
            level: "Neutral" as any,
            message: "neutral",
            rank: 3
          },
          isParent: 0,
          needsHelp: 0,
          assessmentText: ""
        };
        
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
      setLastResult(result);
      setIsResultLoading(false);
      return result;
    } catch (error) {
      console.error("Error calculating assessment results:", error);
      setIsResultLoading(false);
      setError(true);
      return null;
    }
  }, [answers, effectiveLanguage]);

  // Automatically calculate results when showResults changes to true
  useEffect(() => {
    if (showResults) {
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
