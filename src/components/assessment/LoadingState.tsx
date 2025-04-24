
import React from 'react';
import { Loader2 } from 'lucide-react';

// Using React.memo to prevent unnecessary renders
const LoadingState: React.FC = React.memo(() => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
      <p className="text-gray-600">Processing your assessment...</p>
    </div>
  );
});

LoadingState.displayName = 'LoadingState';

export default LoadingState;
