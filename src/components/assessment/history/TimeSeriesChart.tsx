
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer } from "@/components/ui/chart";
import { format } from 'date-fns';
import { AssessmentRecord } from '@/utils/scoring/types';

interface TimeSeriesChartProps {
  data: AssessmentRecord[];
}

const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({ data }) => {
  const chartData = data
    .map(record => ({
      date: format(new Date(record.created_at), 'MM/yyyy'),
      timestamp: new Date(record.created_at).getTime(),
      depression: record.depression_score,
      anxiety: record.anxiety_score,
      stress: record.stress_score,
      lifeSatisfaction: record.life_satisfaction_score
    }))
    .sort((a, b) => a.timestamp - b.timestamp);

  return (
    <div className="w-full h-[500px] p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold text-gray-700 mb-6 text-center">
        Mental Health Progress Over Time
      </h2>
      <ChartContainer 
        config={{
          depression: { theme: { light: '#f43f5e', dark: '#fb7185' } },
          anxiety: { theme: { light: '#3b82f6', dark: '#60a5fa' } },
          stress: { theme: { light: '#facc15', dark: '#fde047' } },
          satisfaction: { theme: { light: '#14b8a6', dark: '#2dd4bf' } }
        }}
      >
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="date"
              stroke="#6b7280"
              tick={{ fill: '#6b7280', fontSize: 12 }}
              tickLine={{ stroke: '#6b7280' }}
            />
            <YAxis
              stroke="#6b7280"
              tick={{ fill: '#6b7280', fontSize: 12 }}
              tickLine={{ stroke: '#6b7280' }}
              label={{ 
                value: 'Score', 
                angle: -90, 
                position: 'insideLeft',
                style: { fill: '#6b7280' }
              }}
            />
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
            <Line
              type="monotone"
              dataKey="depression"
              name="Depression"
              stroke="#f43f5e"
              dot={{ fill: '#f43f5e', r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="anxiety"
              name="Anxiety"
              stroke="#3b82f6"
              dot={{ fill: '#3b82f6', r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="stress"
              name="Stress"
              stroke="#facc15"
              dot={{ fill: '#facc15', r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="lifeSatisfaction"
              name="Life Satisfaction"
              stroke="#14b8a6"
              dot={{ fill: '#14b8a6', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};

export default TimeSeriesChart;
