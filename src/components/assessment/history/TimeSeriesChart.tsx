
import React from 'react';
import { format } from 'date-fns';
import { ChartContainer } from "@/components/ui/chart";
import { AssessmentRecord } from '@/utils/scoring/types';
import ChartConfig from './ChartConfig';

interface TimeSeriesChartProps {
  data: AssessmentRecord[];
}

const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({ data }) => {
  const chartData = data
    .map(record => ({
      date: format(new Date(record.created_at), 'MM/yyyy'),
      fullDate: format(new Date(record.created_at), 'MM/dd/yyyy'),
      timestamp: new Date(record.created_at).getTime(),
      depression: record.depression_score,
      anxiety: record.anxiety_score,
      stress: record.stress_score,
      lifeSatisfaction: record.life_satisfaction_score
    }))
    .sort((a, b) => a.timestamp - b.timestamp);

  // Calculate average scores for reference lines
  const averages = chartData.reduce((acc, item) => {
    acc.depression += item.depression || 0;
    acc.anxiety += item.anxiety || 0;
    acc.stress += item.stress || 0;
    acc.lifeSatisfaction += item.lifeSatisfaction || 0;
    return acc;
  }, { depression: 0, anxiety: 0, stress: 0, lifeSatisfaction: 0 });
  
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center bg-white rounded-lg shadow">
        <p className="text-gray-500">No assessment data available</p>
      </div>
    );
  }

  return (
    <div className="w-full h-auto min-h-[400px] p-4 bg-white rounded-lg shadow">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-700" id="chart-title">
          Mental Health Progress Over Time
        </h2>
      </div>
      
      <div aria-label="Mental health progress chart" role="img" className="focus:outline-none">
        <ChartContainer 
          config={{
            depression: { theme: { light: '#f43f5e', dark: '#fb7185' } },
            anxiety: { theme: { light: '#3b82f6', dark: '#60a5fa' } },
            stress: { theme: { light: '#facc15', dark: '#fde047' } },
            satisfaction: { theme: { light: '#14b8a6', dark: '#2dd4bf' } }
          }}
        >
          <ChartConfig data={chartData} averages={averages} />
        </ChartContainer>
      </div>
      
      {chartData.length > 0 && (
        <div className="mt-4 text-sm text-gray-500">
          <p>Data range: {format(new Date(chartData[0].timestamp), 'MMM dd, yyyy')} - {format(new Date(chartData[chartData.length-1].timestamp), 'MMM dd, yyyy')}</p>
        </div>
      )}
    </div>
  );
};

export default TimeSeriesChart;
