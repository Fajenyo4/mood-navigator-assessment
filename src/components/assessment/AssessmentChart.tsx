
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip, Legend } from 'recharts';
import { ChartContainer } from "@/components/ui/chart";
import { AssessmentChartProps } from '@/types/chart';
import ChartTooltip from './chart/ChartTooltip';
import { transformChartData } from './chart/transformChartData';

const AssessmentChart: React.FC<AssessmentChartProps> = ({ 
  data, 
  className = "", 
  height = 300 
}) => {
  const chartData = transformChartData(data);

  return (
    <div className={`w-full ${className}`} style={{ height }}>
      <ChartContainer config={{ 
        depression: { theme: { light: '#ef4444', dark: '#f87171' } },
        anxiety: { theme: { light: '#f59e0b', dark: '#fbbf24' } },
        stress: { theme: { light: '#3b82f6', dark: '#60a5fa' } },
        satisfaction: { theme: { light: '#10b981', dark: '#34d399' } },
      }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 50 }}>
            <XAxis 
              dataKey="name" 
              angle={-45} 
              textAnchor="end" 
              height={70} 
              tick={{ fill: '#666', fontSize: 12 }}
            />
            <YAxis 
              tick={{ fill: '#666', fontSize: 12 }} 
              label={{ value: 'Score', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }} 
            />
            <Tooltip content={ChartTooltip} />
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              formatter={(value) => <span className="text-sm font-medium">{value}</span>} 
            />
            <Bar 
              dataKey="value" 
              animationDuration={1500} 
              animationEasing="ease-in-out"
              radius={[4, 4, 0, 0]}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};

export default AssessmentChart;
