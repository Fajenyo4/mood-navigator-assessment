
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

  // Custom legend renderer for better spacing and readability
  const CustomLegend = (props: any) => {
    const { payload } = props;
    
    return (
      <div className="flex justify-center items-center gap-4 mt-2">
        {payload.map((entry: any, index: number) => (
          <div key={`legend-item-${index}`} className="flex items-center">
            <div 
              className="w-3 h-3 rounded-full mr-1.5" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs font-medium">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`w-full ${className}`} style={{ height }}>
      <ChartContainer config={{ 
        depression: { theme: { light: '#ef4444', dark: '#f87171' } },
        anxiety: { theme: { light: '#f59e0b', dark: '#fbbf24' } },
        stress: { theme: { light: '#3b82f6', dark: '#60a5fa' } },
        satisfaction: { theme: { light: '#10b981', dark: '#34d399' } },
      }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={chartData} 
            margin={{ top: 10, right: 10, left: 10, bottom: 60 }}
          >
            <XAxis 
              dataKey="name" 
              angle={-45} 
              textAnchor="end" 
              height={70} 
              tick={{ fill: '#666', fontSize: 12 }}
              interval={0}
            />
            <YAxis 
              tick={{ fill: '#666', fontSize: 12 }} 
              label={{ value: 'Score', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }} 
              domain={[0, dataMax => Math.max(42, dataMax)]} // Set maximum domain to at least 42 for consistency
            />
            <Tooltip content={ChartTooltip} />
            <Legend 
              content={<CustomLegend />}
              verticalAlign="bottom" 
              height={36}
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
      <div className="text-xs text-center mt-2 text-gray-500">
        Hover over or tap bars to see severity level
      </div>
    </div>
  );
};

export default AssessmentChart;
