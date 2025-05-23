
import { useCallback } from 'react';

interface UseAssessmentNavigationProps {
  currentQuestion: number;
  setCurrentQuestion: (question: number) => void;
  answers: { [key: number]: number };
  selectedOption: string;
  setAnswers: (option: object) => void;
  setSelectedOption: (option: string) => void;
  setUpdateCounter: (cb: (prev: number) => number) => void;
  saveProgressLocally: (question: number, answers: { [key: number]: number }) => void;
  getQuestions: () => any[];
  handleSubmit: (answers: { [key: number]: number }) => void;
}

export const useAssessmentNavigation = ({
  currentQuestion,
  setCurrentQuestion,
  answers,
  setAnswers,
  selectedOption,
  setSelectedOption,
  setUpdateCounter,
  saveProgressLocally,
  getQuestions,
  handleSubmit
}: UseAssessmentNavigationProps) => {
  
  const handleAnswer = useCallback((value: string) => {
    const numericValue = parseInt(value);
    const questions = getQuestions();
    const question = questions[currentQuestion];
    const questionId = currentQuestion + 1;
    
    // Get the proper value for this option
    let answerValue = numericValue;
    
    // Update answers and trigger UI update
    const newAnswers = { ...answers, [questionId]: answerValue };
    setAnswers(newAnswers)
    
    // Update selected option
    setSelectedOption(value);
    setUpdateCounter(prev => prev + 1); // Force re-render for selection UI
    
    const questionCount = questions.length;

    if (currentQuestion < questionCount - 1) {
      const nextQuestion = currentQuestion + 1;
      setCurrentQuestion(nextQuestion);
      
      // Set the next question's selected option if it exists in answers
      const nextSelectedOption = newAnswers[nextQuestion + 1]?.toString() || "";
      setSelectedOption(nextSelectedOption);
      
      // Save progress locally without triggering refreshes
      saveProgressLocally(nextQuestion, newAnswers);
      
      console.log(`Moving to question ${nextQuestion + 1}/${questionCount}, selected: ${nextSelectedOption}, value: ${answerValue}`);
    } else {
      handleSubmit(newAnswers);
    }
  }, [currentQuestion, answers, getQuestions, saveProgressLocally, setCurrentQuestion, setSelectedOption, setUpdateCounter, handleSubmit]);

  const handlePrevious = useCallback(() => {
    if (currentQuestion > 0) {
      const prevQuestion = currentQuestion - 1;
      setCurrentQuestion(prevQuestion);
      
      // Set the previous answer as selected
      const prevSelectedOption = answers[prevQuestion + 1]?.toString() || "";
      setSelectedOption(prevSelectedOption);
      
      // Force UI update to show selection correctly
      setUpdateCounter(prev => prev + 1);
      
      // Update local storage with the current state
      saveProgressLocally(prevQuestion, answers);
      
      console.log(`Moved back to question ${prevQuestion + 1}, selected: ${prevSelectedOption}`);
    }
  }, [currentQuestion, answers, saveProgressLocally, setCurrentQuestion, setSelectedOption, setUpdateCounter]);

  return {
    handleAnswer,
    handlePrevious
  };
};
