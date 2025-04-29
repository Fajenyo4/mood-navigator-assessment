
import { useCallback } from 'react';
import { toast } from 'sonner';

interface ResetHandlerProps {
  resetAssessment: () => void;
}

const ResetHandler: React.FC<ResetHandlerProps> = ({ resetAssessment }) => {
  // Handle assessment reset
  const handleReset = useCallback(() => {
    // Clear local storage
    localStorage.removeItem('assessment_progress');
    // Reset assessment state
    resetAssessment();
  }, [resetAssessment]);
  
  return { handleReset };
};

export default ResetHandler;
