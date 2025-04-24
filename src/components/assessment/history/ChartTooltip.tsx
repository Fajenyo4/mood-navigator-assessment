
import React from 'react';
import { format } from 'date-fns';

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    dataKey: string;
  }>;
  label?: string;
}

const ChartTooltip: React.FC<ChartTooltipProps> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
      <p className="font-medium text-gray-700 mb-2">
        {label && format(new Date(label), 'MMM dd, yyyy')}
      </p>
      <div className="space-y-1">
        {payload.map((entry) => {
          const name = entry.dataKey === 'lifeSatisfaction' 
            ? 'Life Satisfaction' 
            : entry.dataKey.charAt(0).toUpperCase() + entry.dataKey.slice(1);

          return (
            <div key={entry.dataKey} className="flex items-center gap-2">
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-600">{name}:</span>
              <span className="font-medium">{entry.value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChartTooltip;
