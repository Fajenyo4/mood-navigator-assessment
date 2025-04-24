
import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import ChartTooltip from './ChartTooltip';
import { useIsMobile } from '@/hooks/use-mobile';

interface ChartConfigProps {
  data: Array<{
    fullDate: string;
    depression: number;
    anxiety: number;
    stress: number;
    lifeSatisfaction: number;
  }>;
  averages: {
    depression: number;
    anxiety: number;
    stress: number;
    lifeSatisfaction: number;
  };
}

const ChartConfig: React.FC<ChartConfigProps> = ({ data, averages }) => {
  const isMobile = useIsMobile();

  return (
    <ResponsiveContainer width="100%" height={isMobile ? 300 : 400}>
      <LineChart
        data={data}
        margin={{ 
          top: 5, 
          right: isMobile ? 10 : 30, 
          left: isMobile ? 10 : 20, 
          bottom: isMobile ? 60 : 25 
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis 
          dataKey="fullDate"
          stroke="#6b7280"
          tick={{ fill: '#6b7280', fontSize: isMobile ? 10 : 12 }}
          tickLine={{ stroke: '#6b7280' }}
          height={60}
          angle={-45}
          textAnchor="end"
        />
        <YAxis
          stroke="#6b7280"
          tick={{ fill: '#6b7280', fontSize: isMobile ? 10 : 12 }}
          tickLine={{ stroke: '#6b7280' }}
          label={{ 
            value: 'Score', 
            angle: -90, 
            position: 'insideLeft',
            style: { fill: '#6b7280', fontSize: isMobile ? 10 : 12 }
          }}
        />
        <Tooltip content={<ChartTooltip />} />
        <Legend 
          verticalAlign="bottom" 
          height={36}
          wrapperStyle={{
            paddingTop: '1rem',
            fontSize: isMobile ? '10px' : '12px'
          }}
        />
        
        <ReferenceLine 
          y={averages.depression} 
          stroke="#f43f5e" 
          strokeDasharray="3 3" 
          label={{ 
            value: 'Avg Depression',
            position: 'right',
            fill: '#f43f5e',
            fontSize: isMobile ? 10 : 12
          }} 
        />
        <ReferenceLine 
          y={averages.anxiety} 
          stroke="#3b82f6" 
          strokeDasharray="3 3" 
          label={{ 
            value: 'Avg Anxiety',
            position: 'right',
            fill: '#3b82f6',
            fontSize: isMobile ? 10 : 12
          }} 
        />
        
        <Line
          type="monotone"
          dataKey="depression"
          name="Depression"
          stroke="#f43f5e"
          strokeWidth={2}
          dot={{ fill: '#f43f5e', r: 4 }}
          activeDot={{ r: 6 }}
        />
        <Line
          type="monotone"
          dataKey="anxiety"
          name="Anxiety"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={{ fill: '#3b82f6', r: 4 }}
          activeDot={{ r: 6 }}
        />
        <Line
          type="monotone"
          dataKey="stress"
          name="Stress"
          stroke="#facc15"
          strokeWidth={2}
          dot={{ fill: '#facc15', r: 4 }}
          activeDot={{ r: 6 }}
        />
        <Line
          type="monotone"
          dataKey="lifeSatisfaction"
          name="Life Satisfaction"
          stroke="#14b8a6"
          strokeWidth={2}
          dot={{ fill: '#14b8a6', r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ChartConfig;
