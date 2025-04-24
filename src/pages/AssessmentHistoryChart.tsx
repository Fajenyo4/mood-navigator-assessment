import React from 'react';
import { useAssessmentHistory } from '@/hooks/useAssessmentHistory';
import { useAuth } from '@/context/AuthContext';
import TimeSeriesChart from '@/components/assessment/history/TimeSeriesChart';
import HistoryLoadingState from '@/components/assessment/history/HistoryLoadingState';
import EmptyState from '@/components/assessment/history/EmptyState';
import { Button } from '@/components/ui/button';
import { Download, RefreshCw } from 'lucide-react';
import TimeRangeFilter from '@/components/assessment/history/TimeRangeFilter';
import { format } from 'date-fns';

const AssessmentHistoryChart = () => {
  const { user } = useAuth();
  const { 
    assessments, 
    allAssessments,
    loading, 
    error, 
    refreshData
  } = useAssessmentHistory(user?.id);

  const exportToCsv = () => {
    // Prepare CSV data
    const csvHeader = ['Date', 'Depression', 'Anxiety', 'Stress', 'Life Satisfaction', 'Final Mood'];
    
    const csvRows = allAssessments.map(assessment => [
      format(new Date(assessment.created_at), 'yyyy-MM-dd'),
      assessment.depression_score,
      assessment.anxiety_score,
      assessment.stress_score,
      assessment.life_satisfaction_score,
      assessment.final_mood
    ]);
    
    // Combine header and rows
    const csvArray = [csvHeader, ...csvRows];
    
    // Format CSV content
    const csvContent = csvArray.map(row => row.join(',')).join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    // Set link attributes
    link.setAttribute('href', url);
    link.setAttribute('download', `assessment-history-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    
    // Append to document, trigger download, and clean up
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <h1 className="text-2xl font-bold">Mental Health Progress Chart</h1>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={refreshData}
              disabled={loading}
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={exportToCsv}
              disabled={allAssessments.length === 0}
            >
              <Download className="h-4 w-4" />
              Export Data
            </Button>
          </div>
        </div>
        
        <TimeRangeFilter onRangeChange={() => {}} />
      </div>
      
      {loading ? (
        <HistoryLoadingState />
      ) : error ? (
        <div className="text-center p-4 text-red-500">{error}</div>
      ) : assessments.length === 0 ? (
        <EmptyState languageLabel="English" />
      ) : (
        <TimeSeriesChart data={assessments} />
      )}
    </div>
  );
};

export default AssessmentHistoryChart;
