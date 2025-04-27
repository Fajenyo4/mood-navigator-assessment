
import React from 'react';
import { getSeverityLevel, getSeverityColor, getSatisfactionLevel, getSatisfactionColor } from '@/utils/assessmentScoring';

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      name: string;
      value: number;
      level: string;
      category: 'depression' | 'anxiety' | 'stress' | 'lifeSatisfaction';
    };
  }>;
}

const ChartTooltip: React.FC<ChartTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    
    // Determine proper severity level and color based on the category
    let level = data.level;
    let color = '#6b7280'; // Default gray
    
    if (data.name.toLowerCase().includes('depression')) {
      level = getSeverityLevel(data.value, 'depression');
      color = getSeverityColor(level);
    } else if (data.name.toLowerCase().includes('anxiety')) {
      level = getSeverityLevel(data.value, 'anxiety');
      color = getSeverityColor(level);
    } else if (data.name.toLowerCase().includes('stress')) {
      level = getSeverityLevel(data.value, 'stress');
      color = getSeverityColor(level);
    } else if (data.name.toLowerCase().includes('satisfaction')) {
      level = getSatisfactionLevel(data.value);
      color = getSatisfactionColor(level);
    }
    
    return (
      <div className="bg-background p-3 rounded-md border border-border shadow-lg">
        <p className="font-medium">{data.name}</p>
        <p>Score: {data.value}</p>
        <p>Level: <span style={{ color }}>{level}</span></p>
      </div>
    );
  }
  return null;
};

export default ChartTooltip;
