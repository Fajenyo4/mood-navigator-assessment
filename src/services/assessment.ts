
import { createClient } from '@supabase/supabase-js';

// Use the direct Supabase URL and anon key values
const supabaseUrl = 'https://rdlwkjcpbxwijipkcdep.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkbHdramNwYnh3aWppcGtjZGVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTY5OTkyNDgsImV4cCI6MjAzMjU3NTI0OH0.lE4IbloA4aAxaF-zopFQfVOBZDMRY7U5ToDJGmL-14c';

const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
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
