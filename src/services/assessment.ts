
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

export const getAssessmentResults = async (userId: string) => {
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
    return data || [];
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
