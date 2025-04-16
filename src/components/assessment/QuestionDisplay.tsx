
import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Question } from '@/types/assessment';

interface QuestionDisplayProps {
  currentQuestion: number;
  totalQuestions: number;
  progress: number;
  question: Question;
  selectedOption: string;
  onAnswer: (value: string) => void;
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  currentQuestion,
  totalQuestions,
  progress,
  question,
  selectedOption,
  onAnswer,
}) => {
  return (
    <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8">
      <Progress value={progress} className="mb-8" />
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Question {currentQuestion + 1} of {totalQuestions}
        </h2>
        <p className="text-lg text-gray-700">{question.text}</p>
      </div>

      <RadioGroup
        onValueChange={onAnswer}
        className="space-y-4"
        name={`question-${currentQuestion}`}
        value={selectedOption}
      >
        {question.options.map((option, index) => (
          <div key={index} className="flex items-center space-x-3">
            <RadioGroupItem value={option} id={`q${currentQuestion}-${index}`} />
            <Label htmlFor={`q${currentQuestion}-${index}`} className="text-gray-700">
              {option}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default QuestionDisplay;
