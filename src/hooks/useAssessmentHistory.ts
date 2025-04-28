
import { useState, useEffect } from 'react';
import { getAssessmentResults, AssessmentRecord } from '@/services/assessment';
import { toast } from 'sonner';
import { AVAILABLE_LANGUAGES } from '@/constants/languages';

export const useAssessmentHistory = (userId: string | undefined) => {
  const [assessments, setAssessments] = useState<AssessmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  const [latestAssessment, setLatestAssessment] = useState<AssessmentRecord | null>(null);

  useEffect(() => {
    const fetchAssessments = async () => {
      if (!userId) {
        setError('You must be logged in to view your assessment history');
        setLoading(false);
        return;
      }

      try {
        const results = await getAssessmentResults(userId, selectedLanguage);
        
        // Sort by date - newest first
        const sortedResults = [...results].sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        
        setAssessments(results);
        
        // Set the latest assessment for summary display
        if (sortedResults.length > 0) {
          setLatestAssessment(sortedResults[0]);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching assessment history:', err);
        setError('Failed to load assessment history');
        setLoading(false);
        toast.error('Failed to load your assessment history');
      }
    };

    fetchAssessments();
  }, [userId, selectedLanguage]);

  const getLanguageLabel = (code: string): string => {
    const language = AVAILABLE_LANGUAGES.find(lang => lang.code === code);
    return language ? language.label : code.toUpperCase();
  };

  return {
    assessments,
    latestAssessment,
    loading,
    error,
    selectedLanguage,
    setSelectedLanguage,
    getLanguageLabel
  };
};
