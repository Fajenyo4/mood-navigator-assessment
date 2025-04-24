import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';
import { toast } from 'sonner';

export const saveAssessmentResult = async (
  userId: string,
  name: string,
  email: string,
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
  },
  finalMood: string,
  languageCode: string = 'en',
  scores: {
    depression: number;
    anxiety: number;
    stress: number;
    lifeSatisfaction: number;
  }
) => {
  const { error } = await supabase
    .from('assessment_results_unified')
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
        mental_status: determineMentalStatus(scores),
        language_code: languageCode
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
