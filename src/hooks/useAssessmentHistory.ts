
import { useState, useEffect, useMemo } from 'react';
import { getAssessmentResults, AssessmentRecord } from '@/services/assessment';
import { toast } from 'sonner';
import { AVAILABLE_LANGUAGES } from '@/components/assessment/AssessmentHistory';

export const useAssessmentHistory = (userId: string | undefined) => {
  const [assessments, setAssessments] = useState<AssessmentRecord[]>([]);
  const [filteredAssessments, setFilteredAssessments] = useState<AssessmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

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
  }, [userId, selectedLanguage, refreshTrigger]);

  // Apply date filters when assessments or date range changes
  useEffect(() => {
    if (!startDate && !endDate) {
      setFilteredAssessments(assessments);
      return;
    }

    const filtered = assessments.filter(assessment => {
      const assessmentDate = new Date(assessment.created_at);
      
      if (startDate && endDate) {
        // Set end date to end of day for inclusive filtering
        const endOfDay = new Date(endDate);
        endOfDay.setHours(23, 59, 59, 999);
        return assessmentDate >= startDate && assessmentDate <= endOfDay;
      } else if (startDate) {
        return assessmentDate >= startDate;
      } else if (endDate) {
        // Set end date to end of day for inclusive filtering
        const endOfDay = new Date(endDate);
        endOfDay.setHours(23, 59, 59, 999);
        return assessmentDate <= endOfDay;
      }
      
      return true;
    });
    
    setFilteredAssessments(filtered);
  }, [assessments, startDate, endDate]);

  const handleDateRangeChange = (start: Date | undefined, end: Date | undefined) => {
    setStartDate(start);
    setEndDate(end);
  };
  
  const refreshData = () => {
    setLoading(true);
    setRefreshTrigger(prev => prev + 1);
  };

  const getLanguageLabel = (code: string): string => {
    const language = AVAILABLE_LANGUAGES.find(lang => lang.code === code);
    return language ? language.label : code.toUpperCase();
  };

  return {
    assessments: filteredAssessments,
    allAssessments: assessments,
    loading,
    error,
    selectedLanguage,
    setSelectedLanguage,
    getLanguageLabel,
    handleDateRangeChange,
    refreshData
  };
};
