
import { useCallback } from 'react';
import { toast } from 'sonner';

interface ResetHandlerProps {
  resetAssessment: () => void;
}

/**
 * Custom hook for handling assessment reset
 */
export const useResetHandler = ({ resetAssessment }: ResetHandlerProps) => {
  // Handle assessment reset
  const handleReset = useCallback(() => {
    // Clear local storage
    localStorage.removeItem('assessment_progress');
    // Reset assessment state
    resetAssessment();
    // Show success message
    toast.success("Assessment reset successfully");
  }, [resetAssessment]);
  
  return { handleReset };
};

/**
 * ResetHandler component that provides reset functionality
 */
const ResetHandler: React.FC<ResetHandlerProps> = ({ resetAssessment }) => {
  const { handleReset } = useResetHandler({ resetAssessment });
  
  // Return null as this is just a functional component
  return null;
};

export default ResetHandler;
