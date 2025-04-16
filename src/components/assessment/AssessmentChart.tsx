
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip, Legend } from 'recharts';
import { ChartContainer } from "@/components/ui/chart";

interface ChartDataItem {
  name: string;
  value: number;
  level: string;
  color: string;
}

interface AssessmentChartProps {
  data: {
    depression: {
      score: number;
      level: string;
    };
    anxiety: {
      score: number;
      level: string;
    };
    stress: {
      score: number;
      level: string;
    };
    lifeSatisfaction: {
      score: number;
      level: string;
    };
  };
  className?: string;
  height?: number | string;
}

const AssessmentChart: React.FC<AssessmentChartProps> = ({ 
  data, 
  className = "", 
  height = 300 
}) => {
  const chartData: ChartDataItem[] = [
    {
      name: 'Depression',
      value: data.depression.score,
      level: data.depression.level,
      color: getColorForLevel(data.depression.level)
    },
    {
      name: 'Anxiety',
      value: data.anxiety.score,
      level: data.anxiety.level,
      color: getColorForLevel(data.anxiety.level)
    },
    {
      name: 'Stress',
      value: data.stress.score,
      level: data.stress.level,
      color: getColorForLevel(data.stress.level)
    },
    {
      name: 'Life Satisfaction',
      value: data.lifeSatisfaction.score,
      level: data.lifeSatisfaction.level,
      color: getColorForSatisfactionLevel(data.lifeSatisfaction.level)
    }
  ];

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
            <Tooltip
              content={({ active, payload }) => {
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
              }}
            />
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

// Helper functions to determine colors based on levels
function getColorForLevel(level: string): string {
  switch (level.toLowerCase()) {
    case 'normal':
      return '#10b981'; // Green
    case 'mild':
      return '#fbbf24'; // Yellow
    case 'medium':
    case 'moderate':
      return '#f59e0b'; // Orange
    case 'critical':
    case 'severe':
      return '#ef4444'; // Red
    case 'very serious':
    case 'extremely severe':
      return '#7f1d1d'; // Dark red
    default:
      return '#6b7280'; // Gray
  }
}

function getColorForSatisfactionLevel(level: string): string {
  switch (level.toLowerCase()) {
    case 'very satisfied':
      return '#10b981'; // Green
    case 'satisfactory':
    case 'satisfied':
      return '#34d399'; // Light green
    case 'neutral':
      return '#fbbf24'; // Yellow
    case 'unsatisfactory':
    case 'dissatisfied':
      return '#f59e0b'; // Orange
    case 'very unsatisfactory':
    case 'very dissatisfied':
      return '#ef4444'; // Red
    default:
      return '#6b7280'; // Gray
  }
}

export default AssessmentChart;
