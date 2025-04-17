
import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { Question } from '@/types/assessment';

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
  currentQuestion,
  totalQuestions,
  progress,
  question,
  selectedOption,
  onAnswer,
  onPrevious,
  showPrevious
}) => {
  // Use the options directly from the question
  const options = question?.options || [];

  return (
    <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8">
      <Progress value={progress} className="mb-8" />
      
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          {showPrevious && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onPrevious}
              className="p-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <h2 className="text-2xl font-semibold text-gray-800">
            Question {currentQuestion + 1} of {totalQuestions}
          </h2>
        </div>
        <p className="text-lg text-gray-700">{question.text}</p>
      </div>

      <RadioGroup
        onValueChange={onAnswer}
        className="space-y-4"
        name={`question-${currentQuestion}`}
        value={selectedOption}
      >
        {options.map((option, index) => (
          <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <RadioGroupItem value={index.toString()} id={`q${currentQuestion}-${index}`} />
            <Label 
              htmlFor={`q${currentQuestion}-${index}`} 
              className="text-gray-700 cursor-pointer flex-grow"
            >
              {option}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default QuestionDisplay;
