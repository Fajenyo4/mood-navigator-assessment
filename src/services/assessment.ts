
import { supabase } from '@/integrations/supabase/client';

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
  
  if (error) throw error;
};

export const getAssessmentResults = async (userId: string) => {
  const { data, error } = await supabase
    .from('assessment_results')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};
