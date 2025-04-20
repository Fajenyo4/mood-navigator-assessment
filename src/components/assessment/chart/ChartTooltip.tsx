
import React from 'react';

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      name: string;
      value: number;
      level: string;
    };
  }>;
}

const ChartTooltip: React.FC<ChartTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-background p-3 rounded-md border border-border shadow-lg">
        <p className="font-medium">{data.name}</p>
        <p>Score: {data.value}</p>
        <p>Level: {data.level}</p>
      </div>
    );
  }
  return null;
};

export default ChartTooltip;
