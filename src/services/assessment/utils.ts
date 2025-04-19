
import { Json } from '@/integrations/supabase/types';
import { AssessmentRecord } from '@/utils/scoring/types';

export const getTableNameByLanguage = (languageCode: string) => {
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

export const parseAnswers = (jsonData: Json): AssessmentRecord['answers'] => {
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
