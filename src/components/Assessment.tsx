
import React, { useState } from 'react';
import { questions } from '@/types/assessment';
import QuestionDisplay from './assessment/QuestionDisplay';
import ResultsDialog from './assessment/ResultsDialog';
import { 
  calculateDassScores, 
  determineLevel, 
  determineMoodResult, 
  getAdditionalCourses, 
  MoodResult 
} from '@/utils/assessmentScoring';

const Assessment = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [progress, setProgress] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [result, setResult] = useState<MoodResult>({
    mood: "",
    message: "",
    redirectUrl: "",
    iconType: "smile",
    iconColor: "",
    courseRecommendation: ""
  });

  const calculateScores = () => {
    const scores = calculateDassScores(answers);
    
    const depressionLevel = determineLevel(scores.depression, 'depression');
    const anxietyLevel = determineLevel(scores.anxiety, 'anxiety');
    const stressLevel = determineLevel(scores.stress, 'stress');
    const satisfactionLevel = determineLevel(scores.lifeSatisfaction, 'satisfaction');
    
    console.log("Depression:", scores.depression, "Level:", depressionLevel.level);
    console.log("Anxiety:", scores.anxiety, "Level:", anxietyLevel.level);
    console.log("Stress:", scores.stress, "Level:", stressLevel.level);
    console.log("Life Satisfaction:", scores.lifeSatisfaction, "Level:", satisfactionLevel.level);
    console.log("Overall Mood:", scores.overallMood);

    const moodResult = determineMoodResult(
      depressionLevel,
      anxietyLevel,
      stressLevel,
      satisfactionLevel,
      scores.overallMood
    );

    const additionalCourses = getAdditionalCourses(answers);
    moodResult.courseRecommendation = [moodResult.courseRecommendation, ...additionalCourses].join('\n');

    setResult(moodResult);
    setShowResults(true);
    
    setTimeout(() => {
      window.location.href = moodResult.redirectUrl;
    }, 5000);
  };

  const handleAnswer = (value: string) => {
    setSelectedOption(value);
    
    const numericValue = questions[currentQuestion].type === 'life-satisfaction' 
      ? questions[currentQuestion].options.indexOf(value) 
      : questions[currentQuestion].type === 'demographic'
      ? value === 'Yes' ? 1 : 0
      : questions[currentQuestion].options.indexOf(value);

    const newAnswers = { ...answers, [currentQuestion + 1]: numericValue };
    setAnswers(newAnswers);
    
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
        setProgress(((currentQuestion + 1) / questions.length) * 100);
        setSelectedOption("");
      }, 300);
    } else {
      calculateScores();
    }
  };

  const handleManualRedirect = () => {
    window.location.href = result.redirectUrl;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <QuestionDisplay
        currentQuestion={currentQuestion}
        totalQuestions={questions.length}
        progress={progress}
        question={questions[currentQuestion]}
        selectedOption={selectedOption}
        onAnswer={handleAnswer}
      />
      
      <ResultsDialog
        open={showResults}
        onOpenChange={setShowResults}
        result={result}
        onManualRedirect={handleManualRedirect}
      />
    </div>
  );
};

export default Assessment;
