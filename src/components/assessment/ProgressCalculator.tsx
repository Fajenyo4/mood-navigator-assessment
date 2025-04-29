import React from 'react';

interface ProgressCalculatorProps {
  currentQuestion: number;
  totalQuestions: number;
}

const ProgressCalculator = ({ 
  currentQuestion, 
  totalQuestions 
}: ProgressCalculatorProps) => {
  // Calculate progress percentage - ensure it starts at 0% for first question
  const progressPercentage = React.useMemo(() => {
    // When on the first question (index 0), progress should be 0
    if (currentQuestion === 0) return 0;
    // Otherwise calculate as a percentage of completed questions
    return Math.floor((currentQuestion / (totalQuestions - 1)) * 100);
  }, [currentQuestion, totalQuestions]);
  
  return progressPercentage;
};

export default ProgressCalculator;
