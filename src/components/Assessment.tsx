
import React, { useState } from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { questions } from '@/types/assessment';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Smile, Meh, Frown } from "lucide-react";

const Assessment = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [progress, setProgress] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [result, setResult] = useState<{
    mood: string;
    redirectUrl: string;
    icon: React.ReactNode;
  }>({ mood: "", redirectUrl: "", icon: null });

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
    // Determine depression level
    let depressionLevel = "";
    if (depression >= 28) {
      depressionLevel = "Extremely Severe";
    } else if (depression >= 21) {
      depressionLevel = "Severe";
    } else if (depression >= 14) {
      depressionLevel = "Moderate";
    } else if (depression >= 10) {
      depressionLevel = "Mild";
    } else {
      depressionLevel = "Normal";
    }

    // Determine anxiety level
    let anxietyLevel = "";
    if (anxiety >= 20) {
      anxietyLevel = "Extremely Severe";
    } else if (anxiety >= 15) {
      anxietyLevel = "Severe";
    } else if (anxiety >= 10) {
      anxietyLevel = "Moderate";
    } else if (anxiety >= 8) {
      anxietyLevel = "Mild";
    } else {
      anxietyLevel = "Normal";
    }

    // Determine stress level
    let stressLevel = "";
    if (stress >= 34) {
      stressLevel = "Extremely Severe";
    } else if (stress >= 26) {
      stressLevel = "Severe";
    } else if (stress >= 19) {
      stressLevel = "Moderate";
    } else if (stress >= 15) {
      stressLevel = "Mild";
    } else {
      stressLevel = "Normal";
    }

    // Determine life satisfaction level
    let satisfactionLevel = "";
    if (lifeSatisfaction <= 9) {
      satisfactionLevel = "Extremely Dissatisfied";
    } else if (lifeSatisfaction <= 14) {
      satisfactionLevel = "Dissatisfied";
    } else if (lifeSatisfaction <= 19) {
      satisfactionLevel = "Slightly Dissatisfied";
    } else if (lifeSatisfaction <= 25) {
      satisfactionLevel = "Neutral";
    } else if (lifeSatisfaction <= 29) {
      satisfactionLevel = "Slightly Satisfied";
    } else if (lifeSatisfaction <= 34) {
      satisfactionLevel = "Satisfied";
    } else {
      satisfactionLevel = "Extremely Satisfied";
    }

    let mood = "";
    let redirectUrl = "";
    let icon = null;

    if (depressionLevel === "Extremely Severe" || anxietyLevel === "Extremely Severe" || stressLevel === "Extremely Severe") {
      mood = "Severe Psychological Distress";
      redirectUrl = "https://example.com/severe-psychological-distress";
      icon = <Frown className="w-12 h-12 text-red-500" />;
    } else if (
      ["Severe", "Extremely Severe"].includes(depressionLevel) ||
      ["Severe", "Extremely Severe"].includes(anxietyLevel) ||
      ["Severe", "Extremely Severe"].includes(stressLevel)
    ) {
      mood = "Psychological Distress";
      redirectUrl = "https://example.com/psychological-distress";
      icon = <Frown className="w-12 h-12 text-orange-500" />;
    } else if (
      depressionLevel === "Moderate" ||
      anxietyLevel === "Moderate" ||
      stressLevel === "Moderate" ||
      ["Dissatisfied", "Extremely Dissatisfied"].includes(satisfactionLevel)
    ) {
      mood = "Moderate Subhealth";
      redirectUrl = "https://example.com/moderate-subhealth";
      icon = <Meh className="w-12 h-12 text-yellow-500" />;
    } else if (
      depressionLevel === "Mild" ||
      anxietyLevel === "Mild" ||
      stressLevel === "Mild" ||
      satisfactionLevel === "Slightly Dissatisfied"
    ) {
      mood = "Mild Subhealth";
      redirectUrl = "https://example.com/mild-subhealth";
      icon = <Meh className="w-12 h-12 text-blue-500" />;
    } else if (overallMood <= 2) {
      mood = "Low Mood";
      redirectUrl = "https://example.com/low-mood";
      icon = <Meh className="w-12 h-12 text-purple-500" />;
    } else {
      mood = "Healthy";
      redirectUrl = "https://example.com/healthy";
      icon = <Smile className="w-12 h-12 text-green-500" />;
    }

    setResult({ mood, redirectUrl, icon });
    setShowResults(true);
    
    // Set up automatic redirect after 5 seconds
    setTimeout(() => {
      window.location.href = redirectUrl;
    }, 5000);
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

  const handleManualRedirect = () => {
    window.location.href = result.redirectUrl;
  };

  return (
    <>
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

      <Dialog open={showResults} onOpenChange={setShowResults}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Assessment Results</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4 py-4">
            {result.icon}
            <p className="text-xl font-semibold text-center">{result.mood}</p>
            <p className="text-sm text-gray-500 text-center">
              Redirecting in 5 seconds...
            </p>
            <Button onClick={handleManualRedirect} className="mt-4">
              Redirect Now
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Assessment;
