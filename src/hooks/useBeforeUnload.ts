
import { useEffect } from 'react';

interface UseBeforeUnloadProps {
  currentQuestion: number;
  showResults: boolean;
  answers: { [key: number]: number };
}

export const useBeforeUnload = ({ 
  currentQuestion, 
  showResults, 
  answers 
}: UseBeforeUnloadProps): void => {
  // Prevent refreshes from resetting the assessment state, but only if there's actual progress
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (currentQuestion > 0 && !showResults && Object.keys(answers).length > 0) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [currentQuestion, showResults, answers]);
};
