
import React from 'react';
import { Button } from "@/components/ui/button";
import { ExternalLink, History } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ResultActionsProps {
  redirectUrl: string;
  countdown: number;
}

const ResultActions: React.FC<ResultActionsProps> = ({ redirectUrl, countdown }) => {
  // Direct redirect without using window.open
  const handleRedirect = () => {
    try {
      // Add referrer to help LearnWorlds identify the source
      const redirectUrlWithRef = new URL(redirectUrl);
      redirectUrlWithRef.searchParams.append('ref', 'mood-assessment');
      redirectUrlWithRef.searchParams.append('completed', 'true');
      
      // Use location.href for a clean redirect within the same tab
      window.location.href = redirectUrlWithRef.toString();
    } catch (error) {
      console.error("Redirect error:", error);
      // Fallback to simple redirect if URL construction fails
      window.location.href = redirectUrl;
    }
  };

  return (
    <>
      <div className="text-sm text-gray-500 text-center mt-4">
        <p>Your results have been saved. Redirecting to courses in {countdown} seconds...</p>
      </div>
      
      <div className="flex flex-col gap-3 w-full">
        <Button 
          onClick={handleRedirect}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <ExternalLink className="w-4 h-4" />
          <span>Go to Mican Capital Courses</span>
        </Button>
        
        <Link to="/history" className="w-full">
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2"
          >
            <History className="w-4 h-4" />
            <span>View Assessment History</span>
          </Button>
        </Link>
      </div>
    </>
  );
};

export default ResultActions;
