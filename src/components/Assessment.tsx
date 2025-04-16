
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"

interface Question {
  id: number;
  text: string;
}

const questions: Question[] = [
  { id: 1, text: "I found myself getting upset by quite trivial things" },
  { id: 2, text: "I was aware of dryness of my mouth" },
  { id: 3, text: "I couldn't seem to experience any positive feeling at all" },
  { id: 4, text: "I experienced breathing difficulty" },
  { id: 5, text: "I found it difficult to work up the initiative to do things" },
  { id: 6, text: "I tended to over-react to situations" },
  { id: 7, text: "I experienced trembling" },
  { id: 8, text: "I felt that I was using a lot of nervous energy" },
  { id: 9, text: "I was worried about situations in which I might panic" },
  { id: 10, text: "I felt that I had nothing to look forward to" },
  { id: 11, text: "I found myself getting agitated" },
  { id: 12, text: "I found it difficult to relax" },
  { id: 13, text: "I felt down-hearted and blue" },
  { id: 14, text: "I was intolerant of anything that kept me from getting on" },
  { id: 15, text: "I felt I was close to panic" },
  { id: 16, text: "I was unable to become enthusiastic about anything" },
  { id: 17, text: "I felt I wasn't worth much as a person" },
  { id: 18, text: "I felt that I was rather touchy" },
  { id: 19, text: "I felt changes in my heart rate without physical exertion" },
  { id: 20, text: "I felt scared without any good reason" },
  { id: 21, text: "I felt that life was meaningless" },
  { id: 22, text: "In most ways my life is close to my ideal" },
  { id: 23, text: "The conditions of my life are excellent" },
  { id: 24, text: "I am satisfied with my life" },
  { id: 25, text: "So far I have gotten the important things I want in life" },
  { id: 26, text: "If I could live my life over, I would change almost nothing" },
  { id: 27, text: "How do you generally feel?" },
  { id: 28, text: "How would you rate your overall satisfaction?" }
];

const Assessment = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [progress, setProgress] = useState(0);

  const calculateScores = () => {
    // Depression score
    const depression = ((answers[3] || 0) + (answers[5] || 0) + (answers[10] || 0) + 
                       (answers[13] || 0) + (answers[16] || 0) + (answers[17] || 0) + 
                       (answers[21] || 0)) * 2;

    // Anxiety score
    const anxiety = ((answers[2] || 0) + (answers[4] || 0) + (answers[7] || 0) + 
                    (answers[9] || 0) + (answers[15] || 0) + (answers[19] || 0) + 
                    (answers[20] || 0)) * 2;

    // Stress score
    const stress = ((answers[1] || 0) + (answers[6] || 0) + (answers[8] || 0) + 
                   (answers[11] || 0) + (answers[12] || 0) + (answers[14] || 0) + 
                   (answers[18] || 0)) * 2;

    // Life satisfaction score
    const lifesatisfaction = (answers[22] || 0) + (answers[23] || 0) + (answers[24] || 0) + 
                            (answers[25] || 0) + (answers[26] || 0);

    return determineStatus(depression, anxiety, stress, lifesatisfaction);
  };

  const determineStatus = (depression: number, anxiety: number, stress: number, lifesatisfaction: number) => {
    // Depression level
    let depressionLevel = depression < 10 ? "Normal" :
                         depression < 14 ? "Mild" :
                         depression < 21 ? "Moderate" :
                         depression < 28 ? "Severe" : "Very Severe";

    // Anxiety level
    let anxietyLevel = anxiety < 11 ? "Normal" :
                      anxiety < 14 ? "Mild" :
                      anxiety < 21 ? "Moderate" :
                      anxiety < 28 ? "Severe" : "Very Severe";

    // Stress level
    let stressLevel = stress < 17 ? "Normal" :
                     stress < 21 ? "Mild" :
                     stress < 29 ? "Moderate" :
                     stress < 38 ? "Severe" : "Very Severe";

    // Life satisfaction level
    let satisfactionLevel = lifesatisfaction < 14 ? "Very dissatisfied" :
                          lifesatisfaction < 20 ? "Dissatisfied" :
                          lifesatisfaction < 27 ? "Neutral" :
                          lifesatisfaction < 33 ? "Satisfied" : "Very Satisfied";

    // Determine overall class
    const levels = [depressionLevel, anxietyLevel, stressLevel];
    const severityOrder = ["Normal", "Mild", "Moderate", "Severe", "Very Severe"];
    const maxSeverity = levels.reduce((max, level) => {
      return severityOrder.indexOf(level) > severityOrder.indexOf(max) ? level : max;
    });

    // Determine mental health status
    if ((maxSeverity === "Severe" || maxSeverity === "Very Severe") ||
        (maxSeverity === "Moderate" && ["Dissatisfied", "Very dissatisfied"].includes(satisfactionLevel))) {
      window.location.href = "https://example.com/psychological-disturbance";
    } else if (maxSeverity === "Moderate" ||
              (maxSeverity === "Mild" && ["Dissatisfied", "Very dissatisfied"].includes(satisfactionLevel))) {
      window.location.href = "https://example.com/medium-low-subhealth";
    } else if (maxSeverity === "Mild" ||
              (maxSeverity === "Normal" && ["Dissatisfied", "Very dissatisfied"].includes(satisfactionLevel))) {
      window.location.href = "https://example.com/moderate-subhealth";
    } else if (maxSeverity === "Normal" && satisfactionLevel === "Neutral") {
      window.location.href = "https://example.com/medium-high-subhealth";
    } else {
      window.location.href = "https://example.com/healthy";
    }
  };

  const handleAnswer = (value: string) => {
    const newAnswers = { ...answers, [currentQuestion + 1]: parseInt(value) };
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
          value={answers[currentQuestion + 1]?.toString()}
          className="space-y-4"
        >
          {[0, 1, 2, 3].map((value) => (
            <div key={value} className="flex items-center space-x-3">
              <RadioGroupItem value={value.toString()} id={`q${currentQuestion}-${value}`} />
              <Label htmlFor={`q${currentQuestion}-${value}`} className="text-gray-700">
                {value === 0 ? "Not at all" :
                 value === 1 ? "Sometimes" :
                 value === 2 ? "Often" : "Always"}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
};

export default Assessment;
