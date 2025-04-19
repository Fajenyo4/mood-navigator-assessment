
import React, { useState, useEffect } from 'react';
import { getAssessmentResults, AssessmentRecord } from '@/services/assessment';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ResultsDialog from './ResultsDialog';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Loader2, Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SeverityLevel } from '@/utils/scoring/types';

export const AVAILABLE_LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'zh-CN', label: 'Simplified Chinese (Mandarin)' },
  { code: 'zh-HK', label: 'Traditional Chinese (Cantonese)' },
];

const AssessmentHistory: React.FC = () => {
  const [assessments, setAssessments] = useState<AssessmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentRecord | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  const { user } = useAuth();

  useEffect(() => {
    const fetchAssessments = async () => {
      if (!user) {
        setError('You must be logged in to view your assessment history');
        setLoading(false);
        return;
      }

      try {
        const results = await getAssessmentResults(user.id, selectedLanguage);
        setAssessments(results);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching assessment history:', err);
        setError('Failed to load assessment history');
        setLoading(false);
        toast.error('Failed to load your assessment history');
      }
    };

    fetchAssessments();
  }, [user, selectedLanguage]);

  const handleViewResults = (assessment: AssessmentRecord) => {
    setSelectedAssessment(assessment);
    setShowResults(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const prepareResultData = (assessment: AssessmentRecord) => {
    if (!assessment) return null;
    
    const { scores, levels } = assessment.answers;
    
    return {
      mood: assessment.final_mood,
      message: `Assessment taken on ${formatDate(assessment.created_at)}`,
      redirectUrl: "https://www.micancapital.au/courses-en",
      iconType: getMoodIcon(assessment.final_mood),
      iconColor: getMoodColor(assessment.final_mood),
      depressionResult: {
        score: scores.depression,
        level: levels.depression as SeverityLevel,
        message: ""
      },
      anxietyResult: {
        score: scores.anxiety,
        level: levels.anxiety as SeverityLevel,
        message: ""
      },
      stressResult: {
        score: scores.stress,
        level: levels.stress as SeverityLevel,
        message: ""
      },
      satisfactionResult: {
        score: scores.lifeSatisfaction,
        level: levels.lifeSatisfaction as SeverityLevel,
        message: ""
      },
      // Add the missing properties required by MoodResult type with appropriate fallbacks
      isParent: assessment.answers.scores.isParent !== undefined ? assessment.answers.scores.isParent : 0,
      needsHelp: assessment.answers.scores.needsHelp !== undefined ? assessment.answers.scores.needsHelp : 0
    };
  };

  const getMoodIcon = (mood: string): 'smile' | 'meh' | 'frown' => {
    switch(mood.toLowerCase()) {
      case 'health status':
        return 'smile';
      case 'upper-middle subhealth status':
      case 'moderate subhealth status':
      case 'subhealth status':
        return 'meh';
      case 'psychological distress':
      default:
        return 'frown';
    }
  };

  const getMoodColor = (mood: string): string => {
    switch(mood.toLowerCase()) {
      case 'health status':
        return 'text-green-500';
      case 'upper-middle subhealth status':
        return 'text-blue-500';
      case 'moderate subhealth status':
        return 'text-orange-500';
      case 'subhealth status':
        return 'text-yellow-500';
      case 'psychological distress':
      default:
        return 'text-red-500';
    }
  };

  const getLanguageLabel = (code: string): string => {
    const language = AVAILABLE_LANGUAGES.find(lang => lang.code === code);
    return language ? language.label : code.toUpperCase();
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
        <div className="flex justify-center items-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="text-center p-4 text-red-500">{error}</div>
      ) : assessments.length === 0 ? (
        <div className="text-center p-4">
          <p className="mb-4 text-gray-600">
            No assessments found for {getLanguageLabel(selectedLanguage)}.
          </p>
          <Button onClick={() => window.location.href = "/"}>
            Take Assessment
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {assessments.map((assessment) => (
            <div 
              key={assessment.id} 
              className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-lg">{assessment.final_mood}</h3>
                  <p className="text-sm text-gray-500">
                    {formatDate(assessment.created_at)} - {getLanguageLabel(assessment.language_code || 'en')}
                  </p>
                  {assessment.mental_status && (
                    <p className="text-sm text-blue-600 mt-1">
                      Mental Status: {assessment.mental_status}
                    </p>
                  )}
                </div>
                <Button 
                  onClick={() => handleViewResults(assessment)}
                  variant="outline"
                >
                  View Results
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedAssessment && (
        <ResultsDialog
          open={showResults}
          onOpenChange={setShowResults}
          result={prepareResultData(selectedAssessment)!}
          onManualRedirect={() => window.location.href = "https://www.micancapital.au/courses-en"}
        />
      )}
    </div>
  );
};

export default AssessmentHistory;
