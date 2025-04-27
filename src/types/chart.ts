
export interface ChartDataItem {
  name: string;
  value: number;
  level: string;
  color: string;
  category?: 'depression' | 'anxiety' | 'stress' | 'lifeSatisfaction';
}

export interface AssessmentChartData {
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
}

export interface AssessmentChartProps {
  data: AssessmentChartData;
  className?: string;
  height?: number | string;
}

export interface TimeSeriesDataPoint {
  date: string;
  time: string;
  displayDate: string;
  displayTime: string;
  fullDisplay: string;
  timestamp: number;
  depression: number;
  anxiety: number;
  stress: number;
  lifeSatisfaction: number;
  depressionLevel: string;
  anxietyLevel: string;
  stressLevel: string;
  satisfactionLevel: string;
}
