
import { useRef, useEffect } from 'react';

interface UseAssessmentInitializationProps {
  initialQuestion: number;
}

export const useAssessmentInitialization = ({
  initialQuestion
}: UseAssessmentInitializationProps) => {
  // Reference to track initialization
  const initialized = useRef(false);

  // Run initialization only once
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      
      // No auto-refreshes or auto-saving that might cause issues
      console.log("Assessment initialized with question:", initialQuestion);
    }
  }, [initialQuestion]);

  return {
    initialized
  };
};
