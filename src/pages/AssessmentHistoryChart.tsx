
import React from 'react';
import { useAssessmentHistory } from '@/hooks/useAssessmentHistory';
import { useAuth } from '@/context/AuthContext';
import TimeSeriesChart from '@/components/assessment/history/TimeSeriesChart';
import HistoryLoadingState from '@/components/assessment/history/HistoryLoadingState';
import EmptyState from '@/components/assessment/history/EmptyState';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const AssessmentHistoryChart = () => {
  const { user } = useAuth();
  const { 
    assessments, 
    loading, 
    error, 
    selectedLanguage, 
    getLanguageLabel 
  } = useAssessmentHistory(user?.id);

  if (loading) return <HistoryLoadingState />;
  if (error) return <div className="text-center p-4 text-red-500">{error}</div>;
  if (assessments.length === 0) return <EmptyState languageLabel={getLanguageLabel(selectedLanguage)} />;

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Mental Health History</CardTitle>
          <CardDescription>
            Track your mental health progress over time. The chart shows your scores for depression, anxiety,
            stress, and life satisfaction. The colored background bands represent different severity levels.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TimeSeriesChart data={assessments} />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Understanding Your Scores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2 text-gray-800">Depression Scale</h4>
              <ul className="space-y-1 text-sm">
                <li className="flex gap-2"><span className="w-3 h-3 inline-block bg-green-500 rounded-full mt-1"></span> 0-9: Normal</li>
                <li className="flex gap-2"><span className="w-3 h-3 inline-block bg-amber-500 rounded-full mt-1"></span> 10-13: Mild</li>
                <li className="flex gap-2"><span className="w-3 h-3 inline-block bg-orange-500 rounded-full mt-1"></span> 14-20: Moderate</li>
                <li className="flex gap-2"><span className="w-3 h-3 inline-block bg-red-500 rounded-full mt-1"></span> 21-27: Severe</li>
                <li className="flex gap-2"><span className="w-3 h-3 inline-block bg-red-600 rounded-full mt-1"></span> 28+: Very Severe</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-gray-800">Anxiety Scale</h4>
              <ul className="space-y-1 text-sm">
                <li className="flex gap-2"><span className="w-3 h-3 inline-block bg-green-500 rounded-full mt-1"></span> 0-10: Normal</li>
                <li className="flex gap-2"><span className="w-3 h-3 inline-block bg-amber-500 rounded-full mt-1"></span> 11-13: Mild</li>
                <li className="flex gap-2"><span className="w-3 h-3 inline-block bg-orange-500 rounded-full mt-1"></span> 14-20: Moderate</li>
                <li className="flex gap-2"><span className="w-3 h-3 inline-block bg-red-500 rounded-full mt-1"></span> 21-27: Severe</li>
                <li className="flex gap-2"><span className="w-3 h-3 inline-block bg-red-600 rounded-full mt-1"></span> 28+: Very Severe</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-gray-800">Stress Scale</h4>
              <ul className="space-y-1 text-sm">
                <li className="flex gap-2"><span className="w-3 h-3 inline-block bg-green-500 rounded-full mt-1"></span> 0-16: Normal</li>
                <li className="flex gap-2"><span className="w-3 h-3 inline-block bg-amber-500 rounded-full mt-1"></span> 17-20: Mild</li>
                <li className="flex gap-2"><span className="w-3 h-3 inline-block bg-orange-500 rounded-full mt-1"></span> 21-28: Moderate</li>
                <li className="flex gap-2"><span className="w-3 h-3 inline-block bg-red-500 rounded-full mt-1"></span> 29-37: Severe</li>
                <li className="flex gap-2"><span className="w-3 h-3 inline-block bg-red-600 rounded-full mt-1"></span> 38+: Very Severe</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-gray-800">Life Satisfaction Scale</h4>
              <ul className="space-y-1 text-sm">
                <li className="flex gap-2"><span className="w-3 h-3 inline-block bg-red-500 rounded-full mt-1"></span> 0-13: Very Dissatisfied</li>
                <li className="flex gap-2"><span className="w-3 h-3 inline-block bg-orange-500 rounded-full mt-1"></span> 14-19: Dissatisfied</li>
                <li className="flex gap-2"><span className="w-3 h-3 inline-block bg-amber-500 rounded-full mt-1"></span> 20-26: Neutral</li>
                <li className="flex gap-2"><span className="w-3 h-3 inline-block bg-green-400 rounded-full mt-1"></span> 27-32: Satisfied</li>
                <li className="flex gap-2"><span className="w-3 h-3 inline-block bg-green-500 rounded-full mt-1"></span> 33+: Very Satisfied</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssessmentHistoryChart;
