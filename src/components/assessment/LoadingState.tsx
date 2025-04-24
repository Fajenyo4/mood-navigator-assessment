
import React from 'react';
import { Loader2 } from 'lucide-react';
import Logo from './Logo';

const LoadingState: React.FC = React.memo(() => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <Logo />
      <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
      <p className="text-gray-600">Processing your assessment...</p>
    </div>
  );
});

LoadingState.displayName = 'LoadingState';

export default LoadingState;
