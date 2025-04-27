
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
    <div className={`w-full space-y-6 ${className}`}>
      {title && (
        <h3 className="text-xl font-medium text-green-800">{title}</h3>
      )}
      <div className="flex items-center justify-between gap-6 relative pt-8">
        <Frown className="w-6 h-6 text-purple-500" />
        <div className="flex-1">
          <Progress value={value} className="h-3" />
          <div 
            className="absolute -top-2 left-0"
            style={{ left: `${value}%`, transform: 'translateX(-50%)' }}
          >
            <span className="text-sm font-medium text-red-500 whitespace-nowrap">{label}</span>
          </div>
        </div>
        <Smile className="w-6 h-6 text-purple-500" />
      </div>
    </div>
  );
};

export default MoodScale;
