
import React from 'react';
import { Loader2 } from 'lucide-react';
import Logo from './Logo';

interface LoadingStateProps {
  message?: string;
}

const LoadingState: React.FC<LoadingStateProps> = React.memo(({ 
  message = "Loading assessment..." 
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <Logo />
      <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
      <p className="text-gray-600">{message}</p>
    </div>
  );
});

LoadingState.displayName = 'LoadingState';

export default LoadingState;
