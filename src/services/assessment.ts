import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Json } from '@/integrations/supabase/types';

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

export const saveAssessmentResult = async (
  userId: string,
  name: string,
  email: string,
  answers: Record<string, any>,
  finalMood: string,
  languageCode: string = 'en',
  scores: {
    depression: number;
    anxiety: number;
    stress: number;
    lifeSatisfaction: number;
  }
) => {
  const tableName = getTableNameByLanguage(languageCode);
  
  const { error } = await supabase
    .from(tableName)
    .insert([
      {
        user_id: userId,
        name,
        email,
        answers,
        final_mood: finalMood,
        depression_score: scores.depression,
        anxiety_score: scores.anxiety,
        stress_score: scores.stress,
        life_satisfaction_score: scores.lifeSatisfaction,
        mental_status: determineMentalStatus(scores)
      }
    ]);
  
  if (error) {
    console.error('Error saving assessment:', error);
    throw error;
  } else {
    console.log('Assessment saved successfully');
  }
};

const determineMentalStatus = (scores: {
  depression: number;
  anxiety: number;
  stress: number;
  lifeSatisfaction: number;
}): string => {
  // Implement mental status determination logic based on scores
  // This is a simplified example - adjust according to your needs
  const avgScore = (scores.depression + scores.anxiety + scores.stress) / 3;
  if (avgScore < 10) return 'Healthy';
  if (avgScore < 20) return 'Mild Concern';
  if (avgScore < 30) return 'Moderate Concern';
  return 'Severe Concern';
};

// Define types for the assessment data structure
export interface AssessmentRecord {
  id: string;
  created_at: string;
  answers: {
    numeric: Record<string, number>;
    text: Record<string, string>;
    scores: {
      depression: number;
      anxiety: number;
      stress: number;
      lifeSatisfaction: number;
      isParent?: number;
      needsHelp?: number;
    };
    levels: {
      depression: string;
      anxiety: string;
      stress: string;
      lifeSatisfaction: string;
    };
  };
  final_mood: string;
  email?: string | null;
  name?: string | null;
  user_id: string;
  language_code: string;
  depression_score: number | null;
  anxiety_score: number | null;
  stress_score: number | null;
  life_satisfaction_score: number | null;
  mental_status: string | null;
}

// Helper function to safely parse JSON answers field
const parseAnswers = (jsonData: Json): AssessmentRecord['answers'] => {
  try {
    // If it's already the correct structure, return it
    if (typeof jsonData === 'object' && jsonData !== null && 
        'numeric' in jsonData && 'text' in jsonData && 
        'scores' in jsonData && 'levels' in jsonData) {
      return jsonData as AssessmentRecord['answers'];
    }
    
    // Handle the case where it's stored as a stringified JSON
    if (typeof jsonData === 'string') {
      const parsed = JSON.parse(jsonData);
      if (parsed && 
          typeof parsed === 'object' && 
          'numeric' in parsed && 
          'text' in parsed && 
          'scores' in parsed && 
          'levels' in parsed) {
        return parsed;
      }
    }
    
    // If structure is different, return a default structure
    console.error('Invalid assessment answers format:', jsonData);
    return {
      numeric: {},
      text: {},
      scores: {
        depression: 0,
        anxiety: 0,
        stress: 0,
        lifeSatisfaction: 0,
        isParent: 0,
        needsHelp: 0
      },
      levels: {
        depression: 'Normal',
        anxiety: 'Normal',
        stress: 'Normal',
        lifeSatisfaction: 'Neutral'
      }
    };
  } catch (error) {
    console.error('Error parsing assessment answers:', error);
    // Return default structure on error
    return {
      numeric: {},
      text: {},
      scores: {
        depression: 0,
        anxiety: 0,
        stress: 0,
        lifeSatisfaction: 0,
        isParent: 0,
        needsHelp: 0
      },
      levels: {
        depression: 'Normal',
        anxiety: 'Normal',
        stress: 'Normal',
        lifeSatisfaction: 'Neutral'
      }
    };
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
      language_code: item.language_code || 'en',
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

export const checkUserExists = async (email: string) => {
  try {
    const { data, error } = await supabase
      .from('assessment_results')
      .select('email')
      .eq('email', email)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      // PGRST116 is the error code for "no rows returned"
      console.error('Error checking if user exists:', error);
      throw error;
    }
    
    return !!data;
  } catch (error) {
    console.error('Error in checkUserExists:', error);
    return false;
  }
};
