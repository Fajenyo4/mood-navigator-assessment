
import { ChartDataItem, AssessmentChartData } from '@/types/chart';
import { getColorForLevel, getColorForSatisfactionLevel } from '@/utils/chartColors';

export function transformChartData(data: AssessmentChartData): ChartDataItem[] {
  return [
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
}
