
import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ResultsDialog from './ResultsDialog';
import { useAuth } from '@/context/AuthContext';
import { AssessmentRecord, SeverityLevel } from '@/utils/scoring/types';
import { useAssessmentHistory } from '@/hooks/useAssessmentHistory';
import HistoryLoadingState from './history/HistoryLoadingState';
import AssessmentListItem from './history/AssessmentListItem';
import EmptyState from './history/EmptyState';
import { SEVERITY_RANKS } from '@/utils/assessmentScoring';

export const AVAILABLE_LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'zh-CN', label: 'Simplified Chinese (Mandarin)' },
  { code: 'zh-HK', label: 'Traditional Chinese (Cantonese)' },
];

const AssessmentHistory: React.FC = () => {
  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentRecord | null>(null);
  const [showResults, setShowResults] = useState(false);
  const { user } = useAuth();
  const { 
    assessments, 
    loading, 
    error, 
    selectedLanguage, 
    setSelectedLanguage, 
    getLanguageLabel 
  } = useAssessmentHistory(user?.id);

  // Helper function to determine rank from severity level
  const getRankFromLevel = (level: string): number => {
    return (SEVERITY_RANKS as Record<string, number>)[level] || 3; // Default to middle rank if not found
  };

  const prepareResultData = (assessment: AssessmentRecord) => {
    if (!assessment) return null;
    
    const { scores, levels } = assessment.answers;
    
    return {
      mood: assessment.final_mood,
      message: `Assessment taken on ${new Date(assessment.created_at).toLocaleString()}`,
      redirectUrl: "https://www.micancapital.au/courses-en",
      iconType: getMoodIcon(assessment.final_mood),
      iconColor: getMoodColor(assessment.final_mood),
      depressionResult: {
        score: scores.depression,
        level: levels.depression as SeverityLevel,
        message: "",
        rank: getRankFromLevel(levels.depression)
      },
      anxietyResult: {
        score: scores.anxiety,
        level: levels.anxiety as SeverityLevel,
        message: "",
        rank: getRankFromLevel(levels.anxiety)
      },
      stressResult: {
        score: scores.stress,
        level: levels.stress as SeverityLevel,
        message: "",
        rank: getRankFromLevel(levels.stress)
      },
      satisfactionResult: {
        score: scores.lifeSatisfaction,
        level: levels.lifeSatisfaction as SeverityLevel,
        message: "",
        rank: getRankFromLevel(levels.lifeSatisfaction)
      },
      isParent: assessment.answers.scores.isParent !== undefined ? assessment.answers.scores.isParent : 0,
      needsHelp: assessment.answers.scores.needsHelp !== undefined ? assessment.answers.scores.needsHelp : 0,
      assessmentText: assessment.mental_status || ""
    };
  };

  const getMoodIcon = (mood: string): 'smile' | 'meh' | 'frown' => {
    switch(mood.toLowerCase()) {
      case 'healthy':
        return 'smile';
      case 'medium to high sub-health status':
      case 'moderate sub-health status':
      case 'medium-to-low sub-health status':
        return 'meh';
      case 'psychological disturbance':
      default:
        return 'frown';
    }
  };

  const getMoodColor = (mood: string): string => {
    switch(mood.toLowerCase()) {
      case 'healthy':
        return 'text-green-500';
      case 'medium to high sub-health status':
        return 'text-blue-500';
      case 'moderate sub-health status':
        return 'text-yellow-500';
      case 'medium-to-low sub-health status':
        return 'text-orange-500';
      case 'psychological disturbance':
      default:
        return 'text-red-500';
    }
  };

  const handleViewResults = (assessment: AssessmentRecord) => {
    setSelectedAssessment(assessment);
    setShowResults(true);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Your Assessment History</h2>
        <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Language" />
          </SelectTrigger>
          <SelectContent>
            {AVAILABLE_LANGUAGES.map(language => (
              <SelectItem key={language.code} value={language.code}>
                {language.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {loading ? (
        <HistoryLoadingState />
      ) : error ? (
        <div className="text-center p-4 text-red-500">{error}</div>
      ) : assessments.length === 0 ? (
        <EmptyState languageLabel={getLanguageLabel(selectedLanguage)} />
      ) : (
        <div className="space-y-4">
          {assessments.map((assessment) => (
            <AssessmentListItem
              key={assessment.id}
              assessment={assessment}
              onView={handleViewResults}
              getLanguageLabel={getLanguageLabel}
            />
          ))}
        </div>
      )}

      {selectedAssessment && (
        <ResultsDialog
          open={showResults}
          onOpenChange={setShowResults}
          result={prepareResultData(selectedAssessment)!}
          onManualRedirect={() => {}}
          language={selectedAssessment.language_code || 'en'}
        />
      )}
    </div>
  );
};

export default AssessmentHistory;
