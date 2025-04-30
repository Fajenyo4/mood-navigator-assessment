
import { useCallback } from 'react';
import { questions as enQuestions } from '@/translations/en';
import { questions as zhCNQuestions } from '@/translations/zh-CN';
import { questions as zhTWQuestions } from '@/translations/zh-TW';

export const useAssessmentQuestions = (defaultLanguage: string) => {
  const getQuestions = useCallback(() => {
    switch (defaultLanguage) {
      case 'zh-CN': 
        return zhCNQuestions;
      case 'zh-HK':
        return zhTWQuestions; // Use Traditional Chinese (zh-TW) for Cantonese (zh-HK)
      case 'en':
      default:
        return enQuestions;
    }
  }, [defaultLanguage]);

  return { getQuestions };
};
