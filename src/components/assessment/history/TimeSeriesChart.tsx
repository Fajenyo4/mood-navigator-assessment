
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceArea, ReferenceLine } from 'recharts';
import { ChartContainer } from "@/components/ui/chart";
import { format, parseISO } from 'date-fns';
import { AssessmentRecord } from '@/utils/scoring/types';
import { 
  getSeverityLevel, 
  getSeverityColor, 
  getSatisfactionLevel, 
  getSatisfactionColor 
} from '@/utils/assessmentScoring';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface TimeSeriesChartProps {
  data: AssessmentRecord[];
}

const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({ data }) => {
  const [latestRecord, setLatestRecord] = useState<AssessmentRecord | null>(
    data.length > 0 ? data.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0] : null
  );
  
  // Process and consolidate data by day and time
  const chartData = data
    .map(record => {
      const date = new Date(record.created_at);
      return {
        date: format(date, 'yyyy-MM-dd'),
        time: format(date, 'HH:mm'),
        displayDate: format(date, 'MMM d, yyyy'),
        displayTime: format(date, 'h:mm a'),
        fullDisplay: `${format(date, 'MMM d, h:mm a')}`,
        timestamp: date.getTime(),
        depression: record.depression_score,
        anxiety: record.anxiety_score,
        stress: record.stress_score,
        lifeSatisfaction: record.life_satisfaction_score,
        depressionLevel: getSeverityLevel(record.depression_score, 'depression'),
        anxietyLevel: getSeverityLevel(record.anxiety_score, 'anxiety'),
        stressLevel: getSeverityLevel(record.stress_score, 'stress'),
        satisfactionLevel: getSatisfactionLevel(record.life_satisfaction_score)
      };
    })
    .sort((a, b) => a.timestamp - b.timestamp);

  // Severity zones for background coloring
  const depressionZones = [
    { y1: 0, y2: 10, color: '#d1e7dd' },   // Normal - light green
    { y1: 10, y2: 14, color: '#fff3cd' },  // Mild - light yellow
    { y1: 14, y2: 21, color: '#ffe5d0' },  // Moderate - light orange
    { y1: 21, y2: 28, color: '#f8d7da' },  // Severe - light red
    { y1: 28, y2: 42, color: '#ffd0d5' }   // Very Severe - lighter red
  ];
  
  const anxietyZones = [
    { y1: 0, y2: 11, color: '#d1e7dd' },   // Normal
    { y1: 11, y2: 14, color: '#fff3cd' },  // Mild
    { y1: 14, y2: 21, color: '#ffe5d0' },  // Moderate
    { y1: 21, y2: 28, color: '#f8d7da' },  // Severe
    { y1: 28, y2: 42, color: '#ffd0d5' }   // Very Severe
  ];
  
  const stressZones = [
    { y1: 0, y2: 17, color: '#d1e7dd' },   // Normal
    { y1: 17, y2: 21, color: '#fff3cd' },  // Mild
    { y1: 21, y2: 29, color: '#ffe5d0' },  // Moderate
    { y1: 29, y2: 38, color: '#f8d7da' },  // Severe
    { y1: 38, y2: 42, color: '#ffd0d5' }   // Very Severe
  ];

  const satisfactionZones = [
    { y1: 0, y2: 14, color: '#f8d7da' },    // Very dissatisfied
    { y1: 14, y2: 20, color: '#ffe5d0' },   // Dissatisfied
    { y1: 20, y2: 27, color: '#fff3cd' },   // Neutral
    { y1: 27, y2: 33, color: '#e2f0d9' },   // Satisfied
    { y1: 33, y2: 35, color: '#d1e7dd' }    // Very Satisfied
  ];

  const renderReferenceAreas = (zones: Array<{y1: number, y2: number, color: string}>) => {
    return zones.map((zone, index) => (
      <ReferenceArea
        key={`zone-${index}`}
        y1={zone.y1}
        y2={zone.y2}
        fill={zone.color}
        fillOpacity={0.3}
      />
    ));
  };

  // Generate vertical lines for day separators
  const renderDaySeparators = () => {
    // Extract unique dates
    const uniqueDates = [...new Set(chartData.map(item => item.date))];
    
    // For each date change (except the first), add a vertical line
    return uniqueDates.slice(1).map((date) => {
      // Find the first data point with this date
      const firstDataPoint = chartData.find(item => item.date === date);
      if (!firstDataPoint) return null;
      
      return (
        <ReferenceLine
          key={`separator-${date}`}
          x={firstDataPoint.fullDisplay}
          stroke="#d1d5db"
          strokeDasharray="3 3"
          strokeWidth={1}
        />
      );
    });
  };

  // Custom tooltip component for better score interpretation
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Card className="bg-white shadow-md border border-gray-200 p-0 max-w-xs">
          <CardContent className="p-3 text-sm">
            <p className="font-bold mb-1">{payload[0].payload.displayDate}</p>
            <p className="text-xs text-gray-500 mb-2">{payload[0].payload.displayTime}</p>
            {payload.map((entry: any, index: number) => {
              const value = entry.value;
              let level = '';
              let color = '';
              
              if (entry.name === 'depression') {
                level = getSeverityLevel(value, 'depression');
                color = getSeverityColor(level);
              } else if (entry.name === 'anxiety') {
                level = getSeverityLevel(value, 'anxiety');
                color = getSeverityColor(level);
              } else if (entry.name === 'stress') {
                level = getSeverityLevel(value, 'stress');
                color = getSeverityColor(level);
              } else if (entry.name === 'lifeSatisfaction') {
                level = getSatisfactionLevel(value);
                color = getSatisfactionColor(level);
              }
              
              return (
                <div key={`tooltip-${index}`} className="flex justify-between items-center mb-1">
                  <span style={{ color: entry.color }} className="font-medium">
                    {entry.name === 'lifeSatisfaction' ? 'Life Satisfaction' : 
                     entry.name.charAt(0).toUpperCase() + entry.name.slice(1)}:
                  </span>
                  <div className="flex items-center">
                    <span className="mr-2">{value}</span>
                    <Badge style={{ backgroundColor: color }} className="text-white text-xs">
                      {level}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      );
    }
    return null;
  };

  // Function to render a summary of the latest assessment
  const renderLatestSummary = () => {
    if (!latestRecord) return null;

    const depressionLevel = getSeverityLevel(latestRecord.depression_score, 'depression');
    const anxietyLevel = getSeverityLevel(latestRecord.anxiety_score, 'anxiety');
    const stressLevel = getSeverityLevel(latestRecord.stress_score, 'stress');
    const satisfactionLevel = getSatisfactionLevel(latestRecord.life_satisfaction_score);

    return (
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-2">Latest Assessment Summary</h3>
        <p className="text-sm text-gray-600 mb-3">
          {format(new Date(latestRecord.created_at), 'MMMM d, yyyy, h:mm a')}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: '#f43f5e' }}></div>
            <span className="text-sm font-medium">Depression:</span>
            <Badge className="ml-2" style={{ backgroundColor: getSeverityColor(depressionLevel) }}>
              {depressionLevel} ({latestRecord.depression_score})
            </Badge>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: '#3b82f6' }}></div>
            <span className="text-sm font-medium">Anxiety:</span>
            <Badge className="ml-2" style={{ backgroundColor: getSeverityColor(anxietyLevel) }}>
              {anxietyLevel} ({latestRecord.anxiety_score})
            </Badge>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: '#facc15' }}></div>
            <span className="text-sm font-medium">Stress:</span>
            <Badge className="ml-2" style={{ backgroundColor: getSeverityColor(stressLevel) }}>
              {stressLevel} ({latestRecord.stress_score})
            </Badge>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: '#14b8a6' }}></div>
            <span className="text-sm font-medium">Life Satisfaction:</span>
            <Badge className="ml-2" style={{ backgroundColor: getSatisfactionColor(satisfactionLevel) }}>
              {satisfactionLevel} ({latestRecord.life_satisfaction_score})
            </Badge>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-auto md:h-[500px] p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold text-gray-700 mb-6 text-center">
        Mental Health Progress Over Time
      </h2>
      <div className="h-[400px] min-h-[400px]">
        <ChartContainer 
          config={{
            depression: { theme: { light: '#f43f5e', dark: '#fb7185' } },
            anxiety: { theme: { light: '#3b82f6', dark: '#60a5fa' } },
            stress: { theme: { light: '#facc15', dark: '#fde047' } },
            satisfaction: { theme: { light: '#14b8a6', dark: '#2dd4bf' } }
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 50 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="fullDisplay"
                stroke="#6b7280"
                tick={{ fill: '#6b7280', fontSize: 12 }}
                tickLine={{ stroke: '#6b7280' }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                stroke="#6b7280"
                tick={{ fill: '#6b7280', fontSize: 12 }}
                tickLine={{ stroke: '#6b7280' }}
                domain={[0, 42]}
                label={{ 
                  value: 'Score', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { fill: '#6b7280' }
                }}
              />
              {renderReferenceAreas(depressionZones)}
              {renderDaySeparators()}
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value) => {
                  const formattedValue = value === 'lifeSatisfaction' ? 'Life Satisfaction' : 
                    value.charAt(0).toUpperCase() + value.slice(1);
                  return <span className="text-sm font-medium">{formattedValue}</span>;
                }}
              />
              <Line
                type="monotone"
                dataKey="depression"
                name="depression"
                stroke="#f43f5e"
                strokeWidth={2}
                dot={{ fill: '#f43f5e', r: 4 }}
                activeDot={{ r: 6 }}
                isAnimationActive={true}
              />
              <Line
                type="monotone"
                dataKey="anxiety"
                name="anxiety"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 4 }}
                activeDot={{ r: 6 }}
                isAnimationActive={true}
              />
              <Line
                type="monotone"
                dataKey="stress"
                name="stress"
                stroke="#facc15"
                strokeWidth={2}
                dot={{ fill: '#facc15', r: 4 }}
                activeDot={{ r: 6 }}
                isAnimationActive={true}
              />
              <Line
                type="monotone"
                dataKey="lifeSatisfaction"
                name="lifeSatisfaction"
                stroke="#14b8a6"
                strokeWidth={2}
                dot={{ fill: '#14b8a6', r: 4 }}
                activeDot={{ r: 6 }}
                isAnimationActive={true}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
      
      {renderLatestSummary()}
    </div>
  );
};

export default TimeSeriesChart;
