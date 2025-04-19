
import { supabase } from '@/integrations/supabase/client';
import { AssessmentRecord } from '@/utils/scoring/types';
import { parseAnswers } from './utils';

const getTableNameByLanguage = (languageCode: string) => {
  switch (languageCode) {
    case 'zh-CN':
      return 'assessment_results_zh_cn';
    case 'zh-HK':
      return 'assessment_results_zh_hk';
    case 'en':
    default:
      return 'assessment_results_en';
  }
};

export const getAssessmentResults = async (
  userId: string,
  languageCode?: string
): Promise<AssessmentRecord[]> => {
  try {
    console.log('Fetching assessment results for userId:', userId);
    
    const tableName = getTableNameByLanguage(languageCode || 'en');
    
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching assessment results:', error);
      throw error;
    }
    
    console.log('Assessment results fetched:', data);
    
    // Transform the data to ensure it matches the AssessmentRecord type
    const typedResults: AssessmentRecord[] = (data || []).map(item => ({
      id: item.id,
      created_at: item.created_at,
      answers: parseAnswers(item.answers),
      final_mood: item.final_mood,
      email: item.email,
      name: item.name,
      user_id: item.user_id,
      language_code: languageCode || 'en',
      depression_score: item.depression_score,
      anxiety_score: item.anxiety_score,
      stress_score: item.stress_score,
      life_satisfaction_score: item.life_satisfaction_score,
      mental_status: item.mental_status
    }));
    
    return typedResults;
  } catch (error) {
    console.error('Error in getAssessmentResults:', error);
    throw error;
  }
};
