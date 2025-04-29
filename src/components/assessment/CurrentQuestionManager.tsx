
import React from 'react';
import { Question } from '@/types/assessment';

interface CurrentQuestionManagerProps {
  currentQuestion: number;
  getQuestions: () => any[];
}

const CurrentQuestionManager = ({ 
  currentQuestion, 
  getQuestions 
}: CurrentQuestionManagerProps) => {
  // Memoize the current question for better performance
  const currentQuestionData = React.useMemo((): Question => {
    const questions = getQuestions();
    return questions[currentQuestion];
  }, [currentQuestion, getQuestions]);
  
  return currentQuestionData;
};

export default CurrentQuestionManager;
