
export interface ChartDataItem {
  name: string;
  value: number;
  level: string;
  color: string;
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
