
import React from 'react';
import { Button } from "@/components/ui/button";
import { ExternalLink, History } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ResultActionsProps {
  redirectUrl: string;
  countdown: number;
}

const ResultActions: React.FC<ResultActionsProps> = ({ redirectUrl, countdown }) => {
  return (
    <>
      <div className="text-sm text-gray-500 text-center mt-4">
        <p>Your results have been saved. Redirecting to courses in {countdown} seconds...</p>
      </div>
      
      <div className="flex flex-col gap-3 w-full">
        <Button 
          onClick={() => window.location.href = redirectUrl} 
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
