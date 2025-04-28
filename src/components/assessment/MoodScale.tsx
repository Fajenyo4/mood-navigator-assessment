
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

  // Ensure label position stays within the scale bounds
  const labelPosition = Math.max(0, Math.min(100, adjustedValue));

  return (
    <div className={`w-full ${className}`}>
      {title && (
        <h3 className="text-lg font-medium text-green-800 mb-3">{title}</h3>
      )}
      <div className="flex items-center justify-between gap-4 relative pt-10">
        <Frown className="w-5 h-5 text-purple-500 flex-shrink-0" />
        <div className="flex-1 relative">
          <Progress value={adjustedValue} className="h-3" />
          <div 
            className="absolute -top-8 transform -translate-x-1/2"
            style={{ left: `${labelPosition}%` }}
          >
            <span className={`text-sm font-medium ${getTextColor()} px-2 py-1 bg-white rounded-md shadow-sm whitespace-nowrap`}>
              {label}
            </span>
          </div>
        </div>
        <Smile className="w-5 h-5 text-purple-500 flex-shrink-0" />
      </div>
    </div>
  );
};

export default MoodScale;
