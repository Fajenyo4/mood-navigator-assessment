
import React, { useCallback } from 'react';
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

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  progress,
  question,
  selectedOption,
  onAnswer,
  onPrevious,
  showPrevious
}) => {
  const options = question?.options || [];

  // Create a stable reference to the handler to avoid re-renders
  const handleOptionClick = useCallback((value: string) => {
    onAnswer(value);
  }, [onAnswer]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Logo />
      
      {showPrevious && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onPrevious}
          className="mb-6"
          type="button" // Explicitly set type to avoid form submissions
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      )}

      <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
        <Progress value={progress} className="mb-8" />
        
        <h2 className="text-xl font-medium text-gray-900 mb-8 text-center">
          {question.text}
        </h2>

        <RadioGroup
          onValueChange={onAnswer}
          className="space-y-4"
          value={selectedOption}
        >
          {options.map((option, index) => (
            <div 
              key={index} 
              className="transition-all duration-200 ease-in-out"
              onClick={() => handleOptionClick(index.toString())}
            >
              <div className="flex items-center border border-gray-200 rounded-lg p-4 hover:border-primary hover:bg-gray-50 cursor-pointer">
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
          ))}
        </RadioGroup>
      </div>
    </div>
  );
};

export default React.memo(QuestionDisplay); // Memoize component to prevent unnecessary re-renders
