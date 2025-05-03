
import React, { useCallback } from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCcw } from 'lucide-react';
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
  onReset?: () => void;
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  currentQuestion,
  totalQuestions,
  progress,
  question,
  selectedOption,
  onAnswer,
  onPrevious,
  showPrevious,
  onReset
}) => {
  const handleOptionClick = useCallback((value: string) => {
    onAnswer(value);
  }, [onAnswer]);

  const handleOptionSelection = useCallback((optionIndex: string) => {
    onAnswer(optionIndex);
  }, [onAnswer]);

  if (!question || !question.text) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <Logo />
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="text-center">
            <p className="text-red-500">Error loading question. Please refresh and try again.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Logo />
      
      <div className="flex justify-between items-center mb-6">
        {showPrevious ? (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onPrevious}
            type="button"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        ) : <div></div>}
        
        {onReset && (
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            type="button"
            className="text-gray-600"
          >
            <RefreshCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
        <Progress value={progress} className="mb-8" />
        
        <h2 className="text-xl font-medium text-gray-900 mb-8">
          {question.text}
        </h2>

        <RadioGroup
          onValueChange={handleOptionSelection}
          className="space-y-4"
          value={selectedOption}
        >
          {question.options.map((option, index) => {
            // Define the option value based on question type
            let optionValue: string;
            
            if (question.optionValues) {
              // If explicit option values are provided, use them
              optionValue = question.optionValues[index].toString();
            } else if (question.type === "life-satisfaction") {
              // Life satisfaction questions (1-7 scale)
              // optionValue = (question.options.length - index).toString();
              optionValue = (index + 1).toString();
            } else if (question.type === "dass") {
              // DASS questions (0-3 scale)
              // optionValue = index.toString();
              optionValue = (question.options.length - (index+1)).toString();
            } else if (question.type === "demographic") {
              // Demographic questions (binary: Yes=0, No=1)
              optionValue = index.toString();
            } else {
              // Default fallback
              optionValue = index.toString();
            }
            
            return (
              <div 
                key={`${currentQuestion}_${index}`} 
                className="transition-all duration-200 ease-in-out"
                onClick={() => handleOptionSelection(optionValue)}
              >
                <div className="flex items-center border border-gray-200 rounded-lg p-4 hover:border-primary hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem 
                    value={optionValue} 
                    id={`q${currentQuestion}_${index}`} 
                    className="mr-3"
                  />
                  <Label 
                    htmlFor={`q${currentQuestion}_${index}`} 
                    className="text-gray-700 cursor-pointer flex-grow text-base"
                  >
                    {option}
                  </Label>
                </div>
              </div>
            );
          })}
        </RadioGroup>
      </div>
    </div>
  );
};

export default React.memo(QuestionDisplay);
