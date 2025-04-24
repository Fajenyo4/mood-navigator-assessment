
import { supabase } from '@/integrations/supabase/client';
import { AssessmentRecord } from '@/utils/scoring/types';
import { parseAnswers } from './utils';

export const getAssessmentResults = async (
  userId: string,
  languageCode?: string
): Promise<AssessmentRecord[]> => {
  try {
    console.log('Fetching assessment results for userId:', userId);
    
    const { data, error } = await supabase
      .from('assessment_results_unified')
      .select('*')
      .eq('user_id', userId)
      .eq('language_code', languageCode || 'en')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching assessment results:', error);
      throw error;
    }
    
    console.log('Assessment results fetched:', data);
    
    const typedResults: AssessmentRecord[] = (data || []).map(item => ({
      id: item.id,
      created_at: item.created_at,
      answers: parseAnswers(item.answers),
      final_mood: item.final_mood,
      email: item.email,
      name: item.name,
      user_id: item.user_id,
      language_code: item.language_code,
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
