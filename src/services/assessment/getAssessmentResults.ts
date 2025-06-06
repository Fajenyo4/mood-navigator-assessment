
import { supabase } from '@/integrations/supabase/client';
import { AssessmentRecord } from '@/utils/scoring/types';
import { parseAnswers } from './utils';

// Cache assessment results by user ID and language
const resultsCache: Record<string, {data: AssessmentRecord[], timestamp: number}> = {};
const CACHE_TTL = 60000; // 1 minute cache TTL

export const getAssessmentResults = async (
  userId: string,
  languageCode?: string
): Promise<AssessmentRecord[]> => {
  try {
    // Check cache first
    const cacheKey = `${userId}_${languageCode || 'en'}`;
    const cachedResults = resultsCache[cacheKey];
    
    if (cachedResults && (Date.now() - cachedResults.timestamp < CACHE_TTL)) {
      console.log('Using cached assessment results');
      return cachedResults.data;
    }
    
    console.log('Fetching assessment results for userId:', userId);
    
    // Optimize query to select only needed fields
    const { data, error } = await supabase
      .from('assessment_results_unified')
      .select('id, created_at, answers, final_mood, email, name, user_id, language_code, depression_score, anxiety_score, stress_score, life_satisfaction_score, mental_status')
      .eq('user_id', userId)
      .eq('language_code', languageCode || 'en')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching assessment results:', error);
      throw error;
    }
    
    // Transform the data
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
    
    // Cache the results
    resultsCache[cacheKey] = {
      data: typedResults,
      timestamp: Date.now()
    };
    
    return typedResults;
  } catch (error) {
    console.error('Error in getAssessmentResults:', error);
    throw error;
  }
};
