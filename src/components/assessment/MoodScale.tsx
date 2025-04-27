
import React from 'react';
import { Smile, Frown } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface MoodScaleProps {
  value: number;
  label: string;
  title?: string;
  className?: string;
}

const MoodScale: React.FC<MoodScaleProps> = ({ value, label, title, className = '' }) => {
  return (
    <div className={`w-full space-y-2 ${className}`}>
      {title && (
        <h3 className="text-lg font-medium text-center text-green-800">{title}</h3>
      )}
      <div className="flex items-center justify-between gap-4">
        <Frown className="w-6 h-6 text-purple-500" />
        <div className="flex-1 relative">
          <Progress value={value} className="h-3" />
          <div 
            className="absolute -top-6 left-0 w-full flex justify-center"
            style={{ left: `${value}%`, transform: 'translateX(-50%)' }}
          >
            <span className="text-sm font-medium text-red-500">{label}</span>
          </div>
        </div>
        <Smile className="w-6 h-6 text-purple-500" />
      </div>
    </div>
  );
};

export default MoodScale;
