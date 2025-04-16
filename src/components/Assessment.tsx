import React, { useState } from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { questions } from '@/types/assessment';

const Assessment = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [progress, setProgress] = useState(0);

  const calculateScores = () => {
    const depression = ((answers[3] || 0) + (answers[5] || 0) + (answers[10] || 0) + 
                       (answers[13] || 0) + (answers[16] || 0) + (answers[17] || 0) + 
                       (answers[21] || 0)) * 2;

    const anxiety = ((answers[2] || 0) + (answers[4] || 0) + (answers[7] || 0) + 
                    (answers[9] || 0) + (answers[15] || 0) + (answers[19] || 0) + 
                    (answers[20] || 0)) * 2;

    const stress = ((answers[1] || 0) + (answers[6] || 0) + (answers[8] || 0) + 
                   (answers[11] || 0) + (answers[12] || 0) + (answers[14] || 0) + 
                   (answers[18] || 0)) * 2;

    const lifeSatisfaction = (answers[22] || 0) + (answers[23] || 0) + (answers[24] || 0) + 
                            (answers[25] || 0) + (answers[26] || 0);

    const overallMood = (answers[27] || 0) + (answers[28] || 0);

    return determineStatus(depression, anxiety, stress, lifeSatisfaction, overallMood);
  };

  const determineStatus = (
    depression: number, 
    anxiety: number, 
    stress: number, 
    lifeSatisfaction: number,
    overallMood: number
  ) => {
    const depressionLevel = depression <= 9 ? "Normal" :
                          depression <= 13 ? "Mild" :
                          depression <= 20 ? "Moderate" :
                          depression <= 27 ? "Severe" : "Extremely Severe";

    const anxietyLevel = anxiety <= 7 ? "Normal" :
                        anxiety <= 9 ? "Mild" :
                        anxiety <= 14 ? "Moderate" :
                        anxiety <= 19 ? "Severe" : "Extremely Severe";

    const stressLevel = stress <= 14 ? "Normal" :
                       stress <= 18 ? "Mild" :
                       stress <= 25 ? "Moderate" :
                       stress <= 33 ? "Severe" : "Extremely Severe";

    const satisfactionLevel = lifeSatisfaction <= 9 ? "Extremely Dissatisfied" :
                            lifeSatisfaction <= 14 ? "Dissatisfied" :
                            lifeSatisfaction <= 19 ? "Slightly Dissatisfied" :
                            lifeSatisfaction <= 25 ? "Neutral" :
                            lifeSatisfaction <= 29 ? "Satisfied" : "Extremely Satisfied";

    if (depressionLevel === "Extremely Severe" || anxietyLevel === "Extremely Severe" || stressLevel === "Extremely Severe") {
      window.location.href = "https://example.com/severe-psychological-distress";
    } else if (
      ["Severe", "Extremely Severe"].includes(depressionLevel) ||
      ["Severe", "Extremely Severe"].includes(anxietyLevel) ||
      ["Severe", "Extremely Severe"].includes(stressLevel)
    ) {
      window.location.href = "https://example.com/psychological-distress";
    } else if (
      depressionLevel === "Moderate" ||
      anxietyLevel === "Moderate" ||
      stressLevel === "Moderate" ||
      ["Dissatisfied", "Extremely Dissatisfied"].includes(satisfactionLevel)
    ) {
      window.location.href = "https://example.com/moderate-subhealth";
    } else if (
      depressionLevel === "Mild" ||
      anxietyLevel === "Mild" ||
      stressLevel === "Mild" ||
      satisfactionLevel === "Slightly Dissatisfied"
    ) {
      window.location.href = "https://example.com/mild-subhealth";
    } else if (overallMood <= 2) {
      window.location.href = "https://example.com/low-mood";
    } else {
      window.location.href = "https://example.com/healthy";
    }
  };

  const handleAnswer = (value: string) => {
    const numericValue = questions[currentQuestion].type === 'life-satisfaction' 
      ? questions[currentQuestion].options.indexOf(value) 
      : questions[currentQuestion].type === 'demographic'
      ? value === 'Yes' ? 1 : 0
      : questions[currentQuestion].options.indexOf(value);

    const newAnswers = { ...answers, [currentQuestion + 1]: numericValue };
    setAnswers(newAnswers);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setProgress(((currentQuestion + 1) / questions.length) * 100);
    } else {
      calculateScores();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8">
        <Progress value={progress} className="mb-8" />
        
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Question {currentQuestion + 1} of {questions.length}
          </h2>
          <p className="text-lg text-gray-700">{questions[currentQuestion].text}</p>
        </div>

        <RadioGroup
          onValueChange={handleAnswer}
          className="space-y-4"
        >
          {questions[currentQuestion].options.map((option, index) => (
            <div key={index} className="flex items-center space-x-3">
              <RadioGroupItem value={option} id={`q${currentQuestion}-${index}`} />
              <Label htmlFor={`q${currentQuestion}-${index}`} className="text-gray-700">
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
};

export default Assessment;
