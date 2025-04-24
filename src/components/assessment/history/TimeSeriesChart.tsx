
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { ChartContainer } from "@/components/ui/chart";
import { format } from 'date-fns';
import { AssessmentRecord } from '@/utils/scoring/types';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut } from 'lucide-react';

interface TimeSeriesChartProps {
  data: AssessmentRecord[];
}

const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({ data }) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  
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
    
  const zoomIn = () => {
    if (zoomLevel < 3) setZoomLevel(zoomLevel + 0.5);
  };
  
  const zoomOut = () => {
    if (zoomLevel > 0.5) setZoomLevel(zoomLevel - 0.5);
  };
  
  // Calculate average scores for reference lines
  const averages = chartData.reduce((acc, item) => {
    acc.depression += item.depression || 0;
    acc.anxiety += item.anxiety || 0;
    acc.stress += item.stress || 0;
    acc.lifeSatisfaction += item.lifeSatisfaction || 0;
    return acc;
  }, { depression: 0, anxiety: 0, stress: 0, lifeSatisfaction: 0 });
  
  if (chartData.length > 0) {
    averages.depression /= chartData.length;
    averages.anxiety /= chartData.length;
    averages.stress /= chartData.length;
    averages.lifeSatisfaction /= chartData.length;
  }

  return (
    <div className="w-full h-[500px] p-4 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-700">
          Mental Health Progress Over Time
        </h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={zoomOut}
            disabled={zoomLevel <= 0.5}
            className="flex items-center"
          >
            <ZoomOut className="h-4 w-4 mr-1" />
            Zoom Out
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={zoomIn}
            disabled={zoomLevel >= 3}
            className="flex items-center"
          >
            <ZoomIn className="h-4 w-4 mr-1" />
            Zoom In
          </Button>
        </div>
      </div>
      <ChartContainer 
        config={{
          depression: { theme: { light: '#f43f5e', dark: '#fb7185' } },
          anxiety: { theme: { light: '#3b82f6', dark: '#60a5fa' } },
          stress: { theme: { light: '#facc15', dark: '#fde047' } },
          satisfaction: { theme: { light: '#14b8a6', dark: '#2dd4bf' } }
        }}
      >
        <ResponsiveContainer width="100%" height={400 * zoomLevel}>
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="fullDate"
              stroke="#6b7280"
              tick={{ fill: '#6b7280', fontSize: 12 }}
              tickLine={{ stroke: '#6b7280' }}
              height={60}
              angle={-45}
              textAnchor="end"
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
            <Tooltip 
              formatter={(value, name) => {
                // Convert name to string before using string methods
                const nameStr = String(name);
                if (nameStr === 'lifeSatisfaction') return [value, 'Life Satisfaction'];
                return [value, nameStr.charAt(0).toUpperCase() + nameStr.slice(1)];
              }}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Legend verticalAlign="bottom" height={36} />
            
            {/* Reference lines for averages */}
            <ReferenceLine 
              y={averages.depression} 
              stroke="#f43f5e" 
              strokeDasharray="3 3" 
              label={{ value: 'Avg Depression', position: 'right', fill: '#f43f5e' }} 
            />
            <ReferenceLine 
              y={averages.anxiety} 
              stroke="#3b82f6" 
              strokeDasharray="3 3" 
              label={{ value: 'Avg Anxiety', position: 'right', fill: '#3b82f6' }} 
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
      </ChartContainer>
      {chartData.length > 0 && (
        <div className="mt-4 text-sm text-gray-500">
          <p>Data range: {format(new Date(chartData[0].timestamp), 'MMM dd, yyyy')} - {format(new Date(chartData[chartData.length-1].timestamp), 'MMM dd, yyyy')}</p>
        </div>
      )}
    </div>
  );
};

export default TimeSeriesChart;
