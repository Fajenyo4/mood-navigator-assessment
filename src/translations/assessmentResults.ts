import { resultActionsTranslations } from "./resultActions";
import { moodTranslations } from "./mood";
import { moodIconTranslations } from "./moodIcons";

export const assessmentResultsTranslations = {
  'en': {
    title: 'Assessment Results',
    viewHistory: 'View Assessment History',
    ...resultActionsTranslations.en,
    ...moodTranslations.en,
    ...moodIconTranslations.en
  },
  'zh-CN': {
    title: '评估结果',
    viewHistory: '查看评估历史',
    ...resultActionsTranslations["zh-CN"],
    ...moodTranslations["zh-CN"],
    ...moodIconTranslations["zh-CN"]
  },
  'zh-HK': {
    title: '評估結果',
    viewHistory: '查看評估歷史',
    ...resultActionsTranslations["zh-HK"],
    ...moodTranslations["zh-HK"],
    ...moodIconTranslations["zh-HK"]
  }
};
