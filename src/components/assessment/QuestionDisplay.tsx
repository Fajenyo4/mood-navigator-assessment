
import React, { memo, useCallback } from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { Question } from '@/types/assessment';
import Logo from './Logo';

interface QuestionDisplayProps {
  currentQuestion: number;
  totalQuestions: number;
  progress: number;
  question: Question;
  selectedOption: string;
  onAnswer: (value: string) => void;
  onPrevious?: () => void;
  showPrevious?: boolean;
}

const QuestionOption = memo(({ 
  index, 
  option, 
  isSelected 
}: { 
  index: number; 
  option: string; 
  isSelected: boolean;
}) => (
  <div 
    className="transition-all duration-200 ease-in-out transform hover:scale-[1.01]"
  >
    <div className={`flex items-center border ${isSelected ? 'border-primary bg-gray-50' : 'border-gray-200'} rounded-lg p-4 hover:border-primary hover:bg-gray-50 cursor-pointer transition-colors duration-200`}>
      <RadioGroupItem 
        value={index.toString()} 
        id={`q${index}`} 
        className="mr-3"
      />
      <Label 
        htmlFor={`q${index}`} 
        className="text-gray-700 cursor-pointer flex-grow text-base"
      >
        {option}
      </Label>
    </div>
  </div>
));

QuestionOption.displayName = 'QuestionOption';

const QuestionDisplay = memo(function QuestionDisplay({
  currentQuestion,
  totalQuestions,
  progress,
  question,
  selectedOption,
  onAnswer,
  onPrevious,
  showPrevious
}: QuestionDisplayProps) {
  const handleOptionSelect = useCallback((value: string) => {
    onAnswer(value);
  }, [onAnswer]);
  
  const handlePreviousClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (onPrevious) onPrevious();
  }, [onPrevious]);

  if (!question) {
    return <div className="w-full max-w-2xl mx-auto text-center p-8">Loading question...</div>;
  }

  const options = question.options || [];

  return (
    <div className="w-full max-w-2xl mx-auto transition-all duration-300 ease-in-out">
      <Logo />
      
      {showPrevious && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handlePreviousClick}
          className="mb-6 hover:bg-gray-100 transition-colors duration-200"
          type="button" 
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      )}

      <div className="bg-white rounded-xl shadow-lg p-8 mb-6 hover:shadow-xl transition-all duration-300">
        <Progress 
          value={progress} 
          className="mb-8 transition-all duration-500 ease-out" 
        />
        
        <h2 className="text-xl font-medium text-gray-900 mb-8 text-center">
          {question.text}
        </h2>

        <RadioGroup
          onValueChange={handleOptionSelect}
          className="space-y-4"
          value={selectedOption}
          defaultValue={selectedOption}
        >
          {options.map((option, index) => (
            <QuestionOption 
              key={index}
              index={index}
              option={option}
              isSelected={selectedOption === index.toString()}
            />
          ))}
        </RadioGroup>
      </div>
    </div>
  );
});

QuestionDisplay.displayName = 'QuestionDisplay';

export default QuestionDisplay;
