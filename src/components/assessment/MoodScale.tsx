
import React from 'react';
import { Smile, Frown } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface MoodScaleProps {
  value: number;
  label: string;
  title?: string;
  className?: string;
  isNegativeScale?: boolean;
}

const MoodScale: React.FC<MoodScaleProps> = ({ 
  value, 
  label, 
  title, 
  className = '',
  isNegativeScale = false
}) => {
  // For negative scales (depression, anxiety, stress), lower is better
  // For positive scales (life satisfaction), higher is better
  // This ensures proper positioning of the label based on scale type
  const adjustedValue = isNegativeScale ? (100 - value) : value;
  
  // Determine text color based on position/severity
  const getTextColor = () => {
    if (isNegativeScale) {
      if (value >= 75) return "text-red-500";
      if (value >= 50) return "text-orange-500";
      if (value >= 25) return "text-yellow-500";
      return "text-green-500";
    } else {
      if (value >= 75) return "text-green-500";
      if (value >= 50) return "text-yellow-500";
      if (value >= 25) return "text-orange-500";
      return "text-red-500";
    }
  };

  return (
    <div className={`w-full space-y-8 ${className}`}>
      {title && (
        <h3 className="text-xl font-medium text-green-800 mb-2">{title}</h3>
      )}
      <div className="flex items-center justify-between gap-6 relative mt-8">
        <Frown className="w-6 h-6 text-purple-500" />
        <div className="flex-1 relative">
          <Progress value={adjustedValue} className="h-3" />
          <div 
            className="absolute -top-8 left-0 w-full flex justify-center"
            style={{ left: `${adjustedValue}%`, transform: 'translateX(-50%)' }}
          >
            <span className={`text-sm font-medium ${getTextColor()} text-center max-w-[120px] truncate px-2 mt-4`}>
              {label}
            </span>
          </div>
        </div>
        <Smile className="w-6 h-6 text-purple-500" />
      </div>
    </div>
  );
};

export default MoodScale;
