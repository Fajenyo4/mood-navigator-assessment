
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer } from "@/components/ui/chart";
import { format } from 'date-fns';
import { AssessmentRecord } from '@/utils/scoring/types';

interface TimeSeriesChartProps {
  data: AssessmentRecord[];
}

const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({ data }) => {
  const chartData = data.map(record => ({
    date: format(new Date(record.created_at), 'MM/yyyy'),
    depression: record.depression_score,
    anxiety: record.anxiety_score,
    stress: record.stress_score,
    lifeSatisfaction: record.life_satisfaction_score
  })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="w-full h-[400px]">
      <ChartContainer 
        config={{
          depression: { theme: { light: '#ef4444', dark: '#f87171' } },
          anxiety: { theme: { light: '#3b82f6', dark: '#60a5fa' } },
          stress: { theme: { light: '#f59e0b', dark: '#fbbf24' } },
          satisfaction: { theme: { light: '#10b981', dark: '#34d399' } }
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              label={{ value: 'Month/Year', position: 'bottom' }}
            />
            <YAxis 
              label={{ value: 'Score', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="depression" name="Depression" stroke="#ef4444" />
            <Line type="monotone" dataKey="anxiety" name="Anxiety" stroke="#3b82f6" />
            <Line type="monotone" dataKey="stress" name="Stress" stroke="#f59e0b" />
            <Line type="monotone" dataKey="lifeSatisfaction" name="Life Satisfaction" stroke="#10b981" />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};

export default TimeSeriesChart;
