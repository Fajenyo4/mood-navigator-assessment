import React, { useState } from 'react';

import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register the required Chart.js components
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceArea, ReferenceLine } from 'recharts';
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
import { TrendingUp, TrendingDown } from 'lucide-react';
import DateRangeFilter from './DateRangeFilter';
import ChartGuide from './ChartGuide';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface TimeSeriesChartProps {
  data: AssessmentRecord[];
}

const severityZones = {
  depression: [
    { y1: 0, y2: 9, color: '#10b981' },
    { y1: 10, y2: 13, color: '#f59e0b' },
    { y1: 14, y2: 20, color: '#f97316' },
    { y1: 21, y2: 27, color: '#ef4444' },
    { y1: 28, y2: 42, color: '#dc2626' },
  ],
  anxiety: [
    { y1: 0, y2: 10, color: '#10b981' },
    { y1: 11, y2: 13, color: '#f59e0b' },
    { y1: 14, y2: 20, color: '#f97316' },
    { y1: 21, y2: 27, color: '#ef4444' },
    { y1: 28, y2: 42, color: '#dc2626' },
  ],
  stress: [
    { y1: 0, y2: 16, color: '#10b981' },
    { y1: 17, y2: 20, color: '#f59e0b' },
    { y1: 21, y2: 28, color: '#f97316' },
    { y1: 29, y2: 37, color: '#ef4444' },
    { y1: 38, y2: 42, color: '#dc2626' },
  ]
};

const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({ data }) => {
  const [latestRecord, setLatestRecord] = useState<AssessmentRecord | null>(
    data.length > 0 ? data.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0] : null
  );
  
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

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

  const getTrendIcon = (current: number, previous: number | undefined) => {
    if (!previous) return null;
    const diff = current - previous;
    
    if (diff === 0) return null;
    
    const color = diff > 0 ? 'text-red-500' : 'text-green-500';
    const Icon = diff > 0 ? TrendingUp : TrendingDown;
    
    return <Icon className={`inline-block ml-2 h-4 w-4 ${color}`} />;
  };

  const filteredChartData = chartData.filter(item => {
    if (!startDate && !endDate) return true;
    const itemDate = new Date(item.timestamp);
    if (startDate && !endDate) return itemDate >= startDate;
    if (!startDate && endDate) return itemDate <= endDate;
    return itemDate >= (startDate as Date) && itemDate <= (endDate as Date);
  });

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

  const renderDaySeparators = () => {
    const uniqueDates = [...new Set(filteredChartData.map(item => item.date))];
    
    return uniqueDates.slice(1).map((date) => {
      const firstDataPoint = filteredChartData.find(item => item.date === date);
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

  const CustomLegend = (props: any) => {
    const { payload } = props;
    
    return (
      <div className="flex justify-center items-center gap-6 pb-2">
        {payload.map((entry: any, index: number) => (
          <div key={`legend-item-${index}`} className="flex items-center">
            <div 
              className="w-3 h-3 rounded-full mr-1.5" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs font-medium">
              {entry.value === 'lifeSatisfaction' ? 'Life Satisfaction' : 
               entry.value.charAt(0).toUpperCase() + entry.value.slice(1)}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const depressionLevel = latestRecord ? getSeverityLevel(latestRecord.depression_score, 'depression') : '';
  const anxietyLevel = latestRecord ? getSeverityLevel(latestRecord.anxiety_score, 'anxiety') : '';
  const stressLevel = latestRecord ? getSeverityLevel(latestRecord.stress_score, 'stress') : '';
  const satisfactionLevel = latestRecord ? getSatisfactionLevel(latestRecord.life_satisfaction_score) : '';

  const renderLatestSummary = () => {
    if (!latestRecord) return null;

    const previousRecord = data.length >= 2 ? data[data.length - 2] : null;

    const assessments = [
      {
        label: 'Depression',
        score: latestRecord.depression_score,
        prevScore: previousRecord?.depression_score,
        level: depressionLevel,
        scoreColor: getSeverityColor(depressionLevel),
        dotColor: '#f43f5e',
      },
      {
        label: 'Anxiety',
        score: latestRecord.anxiety_score,
        prevScore: previousRecord?.anxiety_score,
        level: anxietyLevel,
        scoreColor: getSeverityColor(anxietyLevel),
        dotColor: '#3b82f6',
      },
      {
        label: 'Stress',
        score: latestRecord.stress_score,
        prevScore: previousRecord?.stress_score,
        level: stressLevel,
        scoreColor: getSeverityColor(stressLevel),
        dotColor: '#facc15',
      },
      {
        label: 'Life Satisfaction',
        score: latestRecord.life_satisfaction_score,
        prevScore: previousRecord?.life_satisfaction_score,
        level: satisfactionLevel,
        scoreColor: getSatisfactionColor(satisfactionLevel),
        dotColor: '#14b8a6',
      },
    ];

    return (
      <div className="my-8">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">Latest Assessment Summary</h3>
          <ChartGuide />
        </div>
        <p className="text-sm text-gray-600 mb-3">
          {format(new Date(latestRecord.created_at), 'MMMM d, yyyy, h:mm a')}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {assessments.map(({ label, score, prevScore, level, scoreColor, dotColor }) => (
            <div key={label} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: dotColor }}></div>
                <span className="text-sm font-medium">{label}:</span>
              </div>
              <div className="flex items-center">
                <Badge className="ml-2" style={{ backgroundColor: scoreColor }}>
                  {level} ({score})
                </Badge>
                {getTrendIcon(score, prevScore)}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-auto md:min-h-[600px] p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
        Mental Health Progress Over Time
      </h2>
      
      <DateRangeFilter
        startDate={startDate}
        endDate={endDate}
        onRangeChange={(start, end) => {
          setStartDate(start);
          setEndDate(end);
        }}
      />

      {/* <div className="w-full flex flex-col mb-8 h-auto">
      <ChartContainer 
        config={{
          depression: { theme: { light: '#f43f5e', dark: '#fb7185' } },
          anxiety: { theme: { light: '#3b82f6', dark: '#60a5fa' } },
          stress: { theme: { light: '#facc15', dark: '#fde047' } },
          satisfaction: { theme: { light: '#14b8a6', dark: '#2dd4bf' } }
        }}
      >
        <ResponsiveContainer width="99%" height="500px">
          <LineChart
            data={filteredChartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 100 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="fullDisplay"
              stroke="#6b7280"
              tick={(props) => {
                const { x, y, payload } = props;
                return (
                  <g transform={`translate(${x},${y})`}>
                    <text
                      x={0}
                      y={0}
                      dy={10}
                      textAnchor="end"
                      fill="#6b7280"
                      fontSize={11}
                      transform="rotate(-45)"
                    >
                      {payload.value}
                    </text>
                  </g>
                );
              }}
              tickLine={{ stroke: '#6b7280' }}
              height={80}
              minTickGap={10}
              interval="preserveStartEnd"
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
            {renderReferenceAreas(severityZones.depression)}
            {renderDaySeparators()}
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              content={<CustomLegend />}
              verticalAlign="top"
              height={36}
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
    </div> */}

      <div>
        {MyResponsiveChart({ filteredChartData, renderReferenceAreas, renderDaySeparators, severityZones })}
      </div>

      
      <div className="w-full h-px bg-gray-200 my-6"></div>
      
      <div className="mt-8">
        {renderLatestSummary()}
      </div>
    </div>
  );
};

export default TimeSeriesChart;

const MyResponsiveChart = ({ filteredChartData, renderReferenceAreas, renderDaySeparators, severityZones }) => {
  // Prepare chart data structure for Chart.js
  const chartData = {
    labels: filteredChartData.map((data) => data.fullDisplay),
    datasets: [
      {
        label: 'Depression',
        data: filteredChartData.map((data) => data.depression),
        borderColor: '#f43f5e',
        backgroundColor: 'rgba(244, 63, 94, 0.2)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Anxiety',
        data: filteredChartData.map((data) => data.anxiety),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Stress',
        data: filteredChartData.map((data) => data.stress),
        borderColor: '#facc15',
        backgroundColor: 'rgba(250, 204, 21, 0.2)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Life Satisfaction',
        data: filteredChartData.map((data) => data.lifeSatisfaction),
        borderColor: '#14b8a6',
        backgroundColor: 'rgba(20, 184, 166, 0.2)',
        fill: true,
        tension: 0.4,
      }
    ],
  };

  // Chart.js options to make it responsive
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
          color: '#6b7280',
        },
        ticks: {
          color: '#6b7280',
          font: { size: 12 },
        },
        grid: {
          color: '#e5e7eb',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Score',
          color: '#6b7280',
        },
        ticks: {
          color: '#6b7280',
        },
        grid: {
          color: '#e5e7eb',
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.raw}`;
          }
        }
      },
      legend: {
        position: 'top',
      },
    },
  };

  return (
    <div className="w-full flex flex-col mb-8 h-auto">
      <ChartContainer 
        config={{
          depression: { theme: { light: '#f43f5e', dark: '#fb7185' } },
          anxiety: { theme: { light: '#3b82f6', dark: '#60a5fa' } },
          stress: { theme: { light: '#facc15', dark: '#fde047' } },
          satisfaction: { theme: { light: '#14b8a6', dark: '#2dd4bf' } }
        }}
      >
        <div style={{ position: 'relative', height: '500px' }}>
          <Line data={chartData} options={chartOptions} />
        </div>
      </ChartContainer>
    </div>
  );
};

