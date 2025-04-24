
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
  progress,
  question,
  selectedOption,
  onAnswer,
  onPrevious,
  showPrevious
}) => {
  const options = question?.options || [];

  return (
    <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8">
      <Progress value={progress} className="mb-8" />
      
      <div className="mb-8">
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
        <p className="text-lg text-gray-700 mt-4">{question.text}</p>
      </div>

      <RadioGroup
        onValueChange={onAnswer}
        className="space-y-4"
        value={selectedOption}
      >
        {options.map((option, index) => (
          <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <RadioGroupItem value={index.toString()} id={`q${index}`} />
            <Label 
              htmlFor={`q${index}`} 
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
