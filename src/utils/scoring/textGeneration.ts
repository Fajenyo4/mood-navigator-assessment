
import { SeverityLevel } from './types';

/**
 * Generate assessment text in Chinese based on the results
 */
export const generateAssessmentText = (
  mentalHealthStatus: string,
  lifeSatisfactionLevel: SeverityLevel,
  depressionLevel: SeverityLevel,
  anxietyLevel: SeverityLevel,
  stressLevel: SeverityLevel,
  language: string = 'zh-CN'
): string => {
  // Only generate Chinese text for Chinese language assessments
  if (!language.startsWith('zh')) {
    return '';
  }
  
  let output = "你開心嗎？\n\n";
  
  output += "你的心理評估顯示，";
  
  if (mentalHealthStatus === "Psychological Disturbance") {
    output += "你是一個非常不開心的人。你的精神心理健康屬於心理困擾狀態。\n\n";
  } else if (mentalHealthStatus === "Medium-to-Low Sub-Health Status") {
    output += "你是一個很不開心的人。你的精神心理健康屬於亞健康狀態中下。\n\n";
  } else if (mentalHealthStatus === "Moderate Sub-Health Status") {
    output += "你是一個中度不開心的人。你的精神心理健康屬於亞健康狀態中等。\n\n";
  } else if (mentalHealthStatus === "Medium to High Sub-Health Status") {
    output += "你是一個輕微不開心的人。你的精神心理健康屬於亞健康狀態中上。\n\n";
  } else if (mentalHealthStatus === "Healthy") {
    output += "你是一個開心的人，你滿意現在的生活。你的精神心理健康屬於健康狀態。\n\n";
  }
  
  // Life satisfaction
  output += "你對整體生活";
  
  if (lifeSatisfactionLevel === "Very dissatisfied") {
    output += "感到非常不滿。";
  } else if (lifeSatisfactionLevel === "Dissatisfied") {
    output += "感到不滿。";
  } else if (lifeSatisfactionLevel === "Neutral") {
    output += "的滿意程度為中性。";
  } else if (lifeSatisfactionLevel === "Satisfied") {
    output += "感到滿意。";
  } else if (lifeSatisfactionLevel === "Very Satisfied") {
    output += "感到非常滿意。";
  }
  
  // Depression
  if (depressionLevel === "Normal") {
    output += "你沒有低落情緒。";
  } else if (depressionLevel === "Mild") {
    output += "你有輕度的低落情緒。";
  } else if (depressionLevel === "Moderate") {
    output += "你有中度的低落情緒。";
  } else if (depressionLevel === "Severe") {
    output += "你有嚴重的低落情緒。";
  } else if (depressionLevel === "Very Severe") {
    output += "你有很嚴重的低落情緒。";
  }
  
  // Anxiety
  if (anxietyLevel === "Normal") {
    output += "你沒有焦慮情緒。";
  } else if (anxietyLevel === "Mild") {
    output += "你有輕度的焦慮情緒。";
  } else if (anxietyLevel === "Moderate") {
    output += "你有中度的焦慮情緒。";
  } else if (anxietyLevel === "Severe") {
    output += "你有嚴重的焦慮情緒。";
  } else if (anxietyLevel === "Very Severe") {
    output += "你有很嚴重的焦慮情緒。";
  }
  
  // Stress
  if (stressLevel === "Normal") {
    output += "你沒有壓力問題。";
  } else if (stressLevel === "Mild") {
    output += "你有輕度的受壓情況。";
  } else if (stressLevel === "Moderate") {
    output += "你有中度的受壓情況。";
  } else if (stressLevel === "Severe") {
    output += "你有嚴重的受壓情況。";
  } else if (stressLevel === "Very Severe") {
    output += "你有很嚴重的受壓情況。";
  }
  
  return output;
};
