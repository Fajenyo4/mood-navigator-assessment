
import { Smile, Meh, Frown } from "lucide-react";

export interface AssessmentResult {
  score: number;
  level: string;
  message: string;
  courseRecommendation: string;
}

export const calculateDassScores = (answers: { [key: number]: number }) => {
  // Depression calculation (q3, q5, q10, q13, q16, q17, q21)
  const depression = ((answers[3] || 0) + (answers[5] || 0) + (answers[10] || 0) + 
                     (answers[13] || 0) + (answers[16] || 0) + (answers[17] || 0) + 
                     (answers[21] || 0)) * 2;

  // Anxiety calculation (q2, q4, q7, q9, q15, q19, q20)
  const anxiety = ((answers[2] || 0) + (answers[4] || 0) + (answers[7] || 0) + 
                  (answers[9] || 0) + (answers[15] || 0) + (answers[19] || 0) + 
                  (answers[20] || 0)) * 2;

  // Stress calculation (q1, q6, q8, q11, q12, q14, q18)
  const stress = ((answers[1] || 0) + (answers[6] || 0) + (answers[8] || 0) + 
                 (answers[11] || 0) + (answers[12] || 0) + (answers[14] || 0) + 
                 (answers[18] || 0)) * 2;

  // Life satisfaction calculation (q22-q26)
  const lifeSatisfaction = (answers[22] || 0) + (answers[23] || 0) + (answers[24] || 0) + 
                          (answers[25] || 0) + (answers[26] || 0);

  const overallMood = (answers[27] || 0) + (answers[28] || 0);

  return { depression, anxiety, stress, lifeSatisfaction, overallMood };
};

export const determineLevel = (score: number, type: 'depression' | 'anxiety' | 'stress' | 'satisfaction'): AssessmentResult => {
  switch (type) {
    case 'depression':
      if (score < 10) return {
        score,
        level: "Normal",
        message: "你沒有低落情緒",
        courseRecommendation: "Course: [廣東話] 大腦、心理、人生"
      };
      if (score < 14) return {
        score,
        level: "Mild",
        message: "你有輕度的低落情緒",
        courseRecommendation: "Course: [廣東話] 情緒低落"
      };
      if (score < 21) return {
        score,
        level: "Moderate",
        message: "你有中度的低落情緒",
        courseRecommendation: "Course: [廣東話] 情緒低落"
      };
      if (score < 28) return {
        score,
        level: "Severe",
        message: "你有嚴重的低落情緒",
        courseRecommendation: "Course: [廣東話] 情緒低落"
      };
      return {
        score,
        level: "Very Severe",
        message: "你有很嚴重的低落情緒",
        courseRecommendation: "Course: [廣東話] 情緒低落"
      };
    
    case 'anxiety':
      if (score < 11) return {
        score,
        level: "Normal",
        message: "沒有焦慮情緒",
        courseRecommendation: "Course: [廣東話] 大腦、心理、人生"
      };
      if (score < 14) return {
        score,
        level: "Mild",
        message: "有輕度的焦慮情緒",
        courseRecommendation: "Course: [廣東話] 焦慮恐慌"
      };
      if (score < 21) return {
        score,
        level: "Moderate",
        message: "有中度的焦慮情緒",
        courseRecommendation: "Course: [廣東話] 焦慮恐慌"
      };
      if (score < 28) return {
        score,
        level: "Severe",
        message: "有嚴重的焦慮情緒",
        courseRecommendation: "Course: [廣東話] 焦慮恐慌"
      };
      return {
        score,
        level: "Very Severe",
        message: "有很嚴重的焦慮情緒",
        courseRecommendation: "Course: [廣東話] 焦慮恐慌"
      };
    
    case 'stress':
      if (score < 17) return {
        score,
        level: "Normal",
        message: "並沒有壓力問題",
        courseRecommendation: "Course: [廣東話] 大腦、心理、人生"
      };
      if (score < 21) return {
        score,
        level: "Mild",
        message: "並有輕度的受壓情況",
        courseRecommendation: "Course: 「『壓力』！增強抗壓能力！」"
      };
      if (score < 29) return {
        score,
        level: "Moderate",
        message: "並有中度的受壓情況",
        courseRecommendation: "Course: 「『壓力』！增強抗壓能力！」"
      };
      if (score < 38) return {
        score,
        level: "Severe",
        message: "並有嚴重的受壓情況",
        courseRecommendation: "Course: 「『壓力』！增強抗壓能力！」"
      };
      return {
        score,
        level: "Very Severe",
        message: "並有很嚴重的受壓情況",
        courseRecommendation: "Course: 「『壓力』！增強抗壓能力！」"
      };
    
    case 'satisfaction':
      if (score < 14) return {
        score,
        level: "Very Dissatisfied",
        message: "感到非常不滿",
        courseRecommendation: "Course: [廣東話] 自我价值"
      };
      if (score < 20) return {
        score,
        level: "Dissatisfied",
        message: "感到不滿",
        courseRecommendation: "Course: [廣東話] 自我价值"
      };
      if (score < 27) return {
        score,
        level: "Neutral",
        message: "的滿意程度為中性",
        courseRecommendation: "Course: [廣東話] 自我价值"
      };
      if (score < 33) return {
        score,
        level: "Satisfied",
        message: "感到滿意",
        courseRecommendation: "Course: [廣東話] 大腦、心理、人生"
      };
      return {
        score,
        level: "Very Satisfied",
        message: "感到非常滿意",
        courseRecommendation: "Course: [廣東話] 大腦、心理、人生"
      };
    
    default:
      return {
        score,
        level: "Normal",
        message: "Normal levels",
        courseRecommendation: "Course: [廣東話] 大腦、心理、人生"
      };
  }
};

export type MoodResult = {
  mood: string;
  message: string;
  redirectUrl: string;
  iconType: 'frown' | 'meh' | 'smile';
  iconColor: string;
  depressionResult?: AssessmentResult;
  anxietyResult?: AssessmentResult;
  stressResult?: AssessmentResult;
  satisfactionResult?: AssessmentResult;
};

const getDassSeverity = (depressionLevel: AssessmentResult, anxietyLevel: AssessmentResult, stressLevel: AssessmentResult): string => {
  const levels = ["Normal", "Mild", "Moderate", "Severe", "Very Severe"];
  const severityMap: Record<string, number> = {
    "Normal": 0,
    "Mild": 1,
    "Moderate": 2,
    "Severe": 3,
    "Very Severe": 4
  };

  const maxSeverity = Math.max(
    severityMap[depressionLevel.level],
    severityMap[anxietyLevel.level],
    severityMap[stressLevel.level]
  );

  return levels[maxSeverity];
};

export const getAdditionalCourses = (answers: { [key: number]: number }): string[] => {
  const additionalCourses: string[] = [];
  
  // Parent course recommendation
  if (answers[27] === 1) {
    additionalCourses.push("Course: [廣東話] 父母之道");
  }
  
  // Helper course recommendation
  if (answers[28] === 1) {
    additionalCourses.push("Course: [廣東話] 大腦、心理、人生、自我价值、焦慮恐慌、情緒低落");
  }
  
  return additionalCourses;
};

export const determineMoodResult = (
  depressionLevel: AssessmentResult,
  anxietyLevel: AssessmentResult,
  stressLevel: AssessmentResult,
  satisfactionLevel: AssessmentResult,
  overallMood: number
): MoodResult => {
  const dassSeverity = getDassSeverity(depressionLevel, anxietyLevel, stressLevel);
  const isLowSatisfaction = satisfactionLevel.level === "Very Dissatisfied" || satisfactionLevel.level === "Dissatisfied";

  // Determining Mental Health Status based on DASS severity and life satisfaction
  let moodStatus = "";
  let moodMessage = "你開心嗎？\n你的心理評估顯示，";
  let iconType: 'frown' | 'meh' | 'smile' = 'meh';
  let iconColor = "text-yellow-500";
  
  // Case 1: Severe/Very Severe DASS OR Moderate DASS with low satisfaction
  if (
    dassSeverity === "Severe" || 
    dassSeverity === "Very Severe" ||
    (dassSeverity === "Moderate" && isLowSatisfaction)
  ) {
    moodStatus = "心理困擾";
    moodMessage += "你是一個非常不開心的人。你的精神心理健康屬於\"心理困擾\"狀態。";
    iconType = "frown";
    iconColor = "text-red-500";
  }
  // Case 2: Moderate DASS OR Mild DASS with low satisfaction
  else if (
    dassSeverity === "Moderate" ||
    (dassSeverity === "Mild" && isLowSatisfaction)
  ) {
    moodStatus = "亞健康狀態中下";
    moodMessage += "你是一個很不開心的人。你的精神心理健康屬於\"亞健康狀態中下\"。";
    iconType = "meh";
    iconColor = "text-yellow-500";
  }
  // Case 3: Mild DASS OR Normal DASS with low satisfaction
  else if (
    dassSeverity === "Mild" ||
    (dassSeverity === "Normal" && isLowSatisfaction)
  ) {
    moodStatus = "亞健康狀態中等";
    moodMessage += "你是一個中度不開心的人。你的精神心理健康屬於\"亞健康狀態中等\"。";
    iconType = "meh";
    iconColor = "text-blue-500";
  }
  // Case 4: Normal DASS with neutral satisfaction
  else if (
    dassSeverity === "Normal" && 
    satisfactionLevel.level === "Neutral"
  ) {
    moodStatus = "亞健康狀態中上";
    moodMessage += "你是一個輕微不開心的人。你的精神心理健康屬於\"亞健康狀態中上\"。";
    iconType = "meh";
    iconColor = "text-purple-500";
  }
  // Case 5: Normal DASS with high satisfaction
  else if (
    dassSeverity === "Normal" && 
    (satisfactionLevel.level === "Satisfied" || satisfactionLevel.level === "Very Satisfied")
  ) {
    moodStatus = "健康狀態";
    moodMessage += "你是一個開心的人，你滿意現在的生活。你的精神心理健康屬於\"健康狀態\"。";
    iconType = "smile";
    iconColor = "text-green-500";
  }
  
  // Add detailed assessment results to the message
  moodMessage += `\n你對整體生活${satisfactionLevel.message}。${depressionLevel.message}。${anxietyLevel.message}。${stressLevel.message}。`;
  
  return {
    mood: moodStatus,
    message: moodMessage,
    redirectUrl: "https://www.micancapital.au/courses-en",
    iconType,
    iconColor,
    depressionResult: depressionLevel,
    anxietyResult: anxietyLevel,
    stressResult: stressLevel,
    satisfactionResult: satisfactionLevel
  };
};
