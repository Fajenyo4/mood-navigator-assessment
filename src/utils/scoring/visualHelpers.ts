
/**
 * Get color for visualizing severity levels
 */
export const getSeverityColor = (level: string): string => {
  switch (level) {
    case 'Normal':
      return '#10b981'; // Green
    case 'Mild':
      return '#f59e0b'; // Amber
    case 'Moderate':
      return '#f97316'; // Orange
    case 'Severe':
      return '#ef4444'; // Red
    case 'Very Severe':
      return '#dc2626'; // Dark red
    default:
      return '#6b7280'; // Gray
  }
};

/**
 * Get color for visualizing satisfaction levels
 */
export const getSatisfactionColor = (level: string): string => {
  switch (level) {
    case 'Very Satisfied':
      return '#10b981'; // Green
    case 'Satisfied':
      return '#34d399'; // Light green
    case 'Neutral':
      return '#f59e0b'; // Amber
    case 'Dissatisfied':
      return '#f97316'; // Orange
    case 'Very dissatisfied':
      return '#ef4444'; // Red
    default:
      return '#6b7280'; // Gray
  }
};
