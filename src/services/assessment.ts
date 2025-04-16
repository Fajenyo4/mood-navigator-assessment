
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

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
