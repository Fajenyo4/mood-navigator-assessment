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
import { AVAILABLE_LANGUAGES } from '@/constants/languages';

const AssessmentHistory: React.FC = () => {
  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentRecord | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [isResultLoading, setIsResultLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
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
    if (!assessment) {
      console.error("Cannot prepare result data: assessment is null");
      return null;
    }
    
    try {
      console.log("Preparing result data for assessment:", assessment);
      
      // Check if the answers object has the required properties
      if (!assessment.answers || !assessment.answers.scores || !assessment.answers.levels) {
        console.error("Assessment is missing required data structures:", assessment);
        setHasError(true);
        return null;
      }
      
      const { scores, levels } = assessment.answers;
      
      return {
        mood: assessment.final_mood || "Unknown",
        message: `Assessment taken on ${new Date(assessment.created_at).toLocaleString()}`,
        redirectUrl: "https://www.mican.life/courses-en",
        iconType: getMoodIcon(assessment.final_mood),
        iconColor: getMoodColor(assessment.final_mood),
        depressionResult: {
          score: scores.depression || 0,
          level: (levels.depression as SeverityLevel) || "Normal",
          message: (levels.depression || "normal").toLowerCase(),
          rank: getRankFromLevel(levels.depression || "Normal")
        },
        anxietyResult: {
          score: scores.anxiety || 0,
          level: (levels.anxiety as SeverityLevel) || "Normal",
          message: (levels.anxiety || "normal").toLowerCase(),
          rank: getRankFromLevel(levels.anxiety || "Normal")
        },
        stressResult: {
          score: scores.stress || 0,
          level: (levels.stress as SeverityLevel) || "Normal",
          message: (levels.stress || "normal").toLowerCase(),
          rank: getRankFromLevel(levels.stress || "Normal")
        },
        satisfactionResult: {
          score: scores.lifeSatisfaction || 0,
          level: (levels.lifeSatisfaction as SeverityLevel) || "Normal",
          message: (levels.lifeSatisfaction || "normal").toLowerCase(),
          rank: getRankFromLevel(levels.lifeSatisfaction || "Normal")
        },
        isParent: assessment.answers.scores.isParent !== undefined ? assessment.answers.scores.isParent : 0,
        needsHelp: assessment.answers.scores.needsHelp !== undefined ? assessment.answers.scores.needsHelp : 0,
        assessmentText: assessment.mental_status || ""
      };
    } catch (error) {
      console.error("Error preparing result data:", error);
      setHasError(true);
      return null;
    }
  };

  const getMoodIcon = (mood: string): 'smile' | 'meh' | 'frown' => {
    switch(mood.toLowerCase()) {
      case 'healthy':
        return 'smile';
      case 'medium to high sub-health status':
        return 'meh';
      case 'moderate sub-health status':
        return 'meh';
      case 'medium-to-low sub-health status':
        return 'frown';
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
    try {
      console.log("Viewing results for assessment:", assessment);
      setSelectedAssessment(assessment);
      setIsResultLoading(true);
      setHasError(false);
      
      // Simulate loading for better UX (similar to the main assessment flow)
      setTimeout(() => {
        try {
          const resultData = prepareResultData(assessment);
          if (!resultData) {
            console.error("Failed to prepare result data");
            setHasError(true);
          }
          setIsResultLoading(false);
          setShowResults(true);
        } catch (error) {
          console.error("Error in loading timeout callback:", error);
          setIsResultLoading(false);
          setHasError(true);
          setShowResults(true); // Still show dialog with error state
        }
      }, 500);
    } catch (error) {
      console.error("Error in handleViewResults:", error);
      setHasError(true);
      setIsResultLoading(false);
      setShowResults(true); // Still show dialog with error state
    }
  };

  // Function to retry loading results if there was an error
  const handleRetry = () => {
    if (selectedAssessment) {
      setShowResults(false); // Close the dialog
      // Short delay before retrying
      setTimeout(() => {
        handleViewResults(selectedAssessment);
      }, 100);
    }
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
          result={prepareResultData(selectedAssessment)}
          onManualRedirect={() => {}}
          language={selectedAssessment.language_code || 'en'}
          isLoading={isResultLoading}
          hasError={hasError}
          onRetry={handleRetry}
        />
      )}
    </div>
  );
};

export default AssessmentHistory;
