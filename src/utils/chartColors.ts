
export function getColorForLevel(level: string): string {
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

export function getColorForSatisfactionLevel(level: string): string {
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
