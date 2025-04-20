
import { useState, useEffect } from 'react';
import { getAssessmentResults, AssessmentRecord } from '@/services/assessment';
import { toast } from 'sonner';
import { AVAILABLE_LANGUAGES } from '@/components/assessment/AssessmentHistory';

export const useAssessmentHistory = (userId: string | undefined) => {
  const [assessments, setAssessments] = useState<AssessmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');

  useEffect(() => {
    const fetchAssessments = async () => {
      if (!userId) {
        setError('You must be logged in to view your assessment history');
        setLoading(false);
        return;
      }

      try {
        const results = await getAssessmentResults(userId, selectedLanguage);
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
  }, [userId, selectedLanguage]);

  const getLanguageLabel = (code: string): string => {
    const language = AVAILABLE_LANGUAGES.find(lang => lang.code === code);
    return language ? language.label : code.toUpperCase();
  };

  return {
    assessments,
    loading,
    error,
    selectedLanguage,
    setSelectedLanguage,
    getLanguageLabel
  };
};
