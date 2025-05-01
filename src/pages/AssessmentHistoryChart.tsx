
import React, { useState } from 'react';
import { useAssessmentHistory } from '@/hooks/useAssessmentHistory';
import { useAuth } from '@/context/AuthContext';
import TimeSeriesChart from '@/components/assessment/history/TimeSeriesChart';
import HistoryLoadingState from '@/components/assessment/history/HistoryLoadingState';
import EmptyState from '@/components/assessment/history/EmptyState';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

const AssessmentHistoryChart = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [isLegendOpen, setIsLegendOpen] = useState(!isMobile);
  
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
    <div className="w-full max-w-6xl mx-auto p-2 md:p-4">
      <Card className="mb-4 md:mb-8">
        <CardHeader className="pb-2 md:pb-4">
          <CardTitle>Mental Health History</CardTitle>
          <CardDescription>
            Track your mental health progress over time. The chart shows your scores for depression, anxiety,
            stress, and life satisfaction.
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-hidden p-2 md:p-6">
          <TimeSeriesChart data={assessments} />
        </CardContent>
      </Card>
      
      <Collapsible open={isLegendOpen} onOpenChange={setIsLegendOpen}>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">Understanding Your Scores</h3>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              {isLegendOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
              <span className="sr-only">Toggle legend</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        
        <CollapsibleContent>
          <Card>
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <h4 className="font-semibold mb-2 text-gray-800">Depression Scale</h4>
                  <ul className="space-y-1 text-xs md:text-sm">
                    <li className="flex gap-2"><span className="w-3 h-3 inline-block bg-green-500 rounded-full mt-1"></span> 0-9: Normal</li>
                    <li className="flex gap-2"><span className="w-3 h-3 inline-block bg-amber-500 rounded-full mt-1"></span> 10-13: Mild</li>
                    <li className="flex gap-2"><span className="w-3 h-3 inline-block bg-orange-500 rounded-full mt-1"></span> 14-20: Moderate</li>
                    <li className="flex gap-2"><span className="w-3 h-3 inline-block bg-red-500 rounded-full mt-1"></span> 21-27: Severe</li>
                    <li className="flex gap-2"><span className="w-3 h-3 inline-block bg-red-600 rounded-full mt-1"></span> 28+: Very Severe</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-gray-800">Anxiety Scale</h4>
                  <ul className="space-y-1 text-xs md:text-sm">
                    <li className="flex gap-2"><span className="w-3 h-3 inline-block bg-green-500 rounded-full mt-1"></span> 0-10: Normal</li>
                    <li className="flex gap-2"><span className="w-3 h-3 inline-block bg-amber-500 rounded-full mt-1"></span> 11-13: Mild</li>
                    <li className="flex gap-2"><span className="w-3 h-3 inline-block bg-orange-500 rounded-full mt-1"></span> 14-20: Moderate</li>
                    <li className="flex gap-2"><span className="w-3 h-3 inline-block bg-red-500 rounded-full mt-1"></span> 21-27: Severe</li>
                    <li className="flex gap-2"><span className="w-3 h-3 inline-block bg-red-600 rounded-full mt-1"></span> 28+: Very Severe</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-gray-800">Stress Scale</h4>
                  <ul className="space-y-1 text-xs md:text-sm">
                    <li className="flex gap-2"><span className="w-3 h-3 inline-block bg-green-500 rounded-full mt-1"></span> 0-16: Normal</li>
                    <li className="flex gap-2"><span className="w-3 h-3 inline-block bg-amber-500 rounded-full mt-1"></span> 17-20: Mild</li>
                    <li className="flex gap-2"><span className="w-3 h-3 inline-block bg-orange-500 rounded-full mt-1"></span> 21-28: Moderate</li>
                    <li className="flex gap-2"><span className="w-3 h-3 inline-block bg-red-500 rounded-full mt-1"></span> 29-37: Severe</li>
                    <li className="flex gap-2"><span className="w-3 h-3 inline-block bg-red-600 rounded-full mt-1"></span> 38+: Very Severe</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-gray-800">Life Satisfaction Scale</h4>
                  <ul className="space-y-1 text-xs md:text-sm">
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
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default AssessmentHistoryChart;
