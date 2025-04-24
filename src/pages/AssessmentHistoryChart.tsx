
import React from 'react';
import { useAssessmentHistory } from '@/hooks/useAssessmentHistory';
import { useAuth } from '@/context/AuthContext';
import TimeSeriesChart from '@/components/assessment/history/TimeSeriesChart';
import HistoryLoadingState from '@/components/assessment/history/HistoryLoadingState';
import EmptyState from '@/components/assessment/history/EmptyState';

const AssessmentHistoryChart = () => {
  const { user } = useAuth();
  const { assessments, loading, error, selectedLanguage, getLanguageLabel } = useAssessmentHistory(user?.id);

  if (loading) return <HistoryLoadingState />;
  if (error) return <div className="text-center p-4 text-red-500">{error}</div>;
  if (assessments.length === 0) return <EmptyState languageLabel={getLanguageLabel(selectedLanguage)} />;

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <h1 className="text-5xl font-bold mb-12 text-center">Your Mental Health History</h1>
      <TimeSeriesChart data={assessments} />
    </div>
  );
};

export default AssessmentHistoryChart;
