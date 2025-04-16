
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Json } from '@/integrations/supabase/types';

export const saveAssessmentResult = async (
  userId: string,
  name: string,
  email: string,
  answers: Record<string, any>,
  finalMood: string
) => {
  const { error } = await supabase
    .from('assessment_results')
    .insert([
      {
        user_id: userId,
        name,
        email,
        answers,
        final_mood: finalMood
      }
    ]);
  
  if (error) {
    console.error('Error saving assessment:', error);
    throw error;
  } else {
    console.log('Assessment saved successfully');
  }
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
        lifeSatisfaction: 0
      },
      levels: {
        depression: 'Unknown',
        anxiety: 'Unknown',
        stress: 'Unknown',
        lifeSatisfaction: 'Unknown'
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
        lifeSatisfaction: 0
      },
      levels: {
        depression: 'Unknown',
        anxiety: 'Unknown',
        stress: 'Unknown',
        lifeSatisfaction: 'Unknown'
      }
    };
  }
};

export const getAssessmentResults = async (userId: string): Promise<AssessmentRecord[]> => {
  try {
    console.log('Fetching assessment results for userId:', userId);
    
    const { data, error } = await supabase
      .from('assessment_results')
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
      user_id: item.user_id
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
