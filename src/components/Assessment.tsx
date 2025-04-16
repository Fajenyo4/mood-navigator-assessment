
import React, { useState } from 'react';
import { questions } from '@/types/assessment';
import QuestionDisplay from './assessment/QuestionDisplay';
import ResultsDialog from './assessment/ResultsDialog';
import { 
  calculateDassScores, 
  determineLevel, 
  determineMoodResult, 
  MoodResult 
} from '@/utils/assessmentScoring';
import { saveAssessmentResult } from '@/services/assessment';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const Assessment = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [textAnswers, setTextAnswers] = useState<{ [key: number]: string }>({});
  const [progress, setProgress] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [result, setResult] = useState<MoodResult>({
    mood: "",
    message: "",
    redirectUrl: "",
    iconType: "smile",
    iconColor: ""
  });
  const { user } = useAuth();

  const calculateScores = async () => {
    try {
      console.log('Calculating scores with answers:', answers);
      const scores = calculateDassScores(answers);
      console.log('Calculated scores:', scores);
      
      const depressionLevel = determineLevel(scores.depression, 'depression');
      const anxietyLevel = determineLevel(scores.anxiety, 'anxiety');
      const stressLevel = determineLevel(scores.stress, 'stress');
      const satisfactionLevel = determineLevel(scores.lifeSatisfaction, 'satisfaction');

      console.log('Levels:', { 
        depression: depressionLevel.level, 
        anxiety: anxietyLevel.level,
        stress: stressLevel.level,
        satisfaction: satisfactionLevel.level
      });

      const moodResult = determineMoodResult(
        depressionLevel,
        anxietyLevel,
        stressLevel,
        satisfactionLevel,
        scores.isParent,
        scores.needsHelp
      );

      console.log('Mood result:', moodResult);
      
      setResult(moodResult);
      setShowResults(true);
      
      // Save the assessment results to Supabase with both numeric and text answers
      if (user) {
        try {
          await saveAssessmentResult(
            user.id,
            user.user_metadata?.name || user.email || '',
            user.email || '',
            { numeric: answers, text: textAnswers }, // Store both numeric and text answers
            moodResult.mood
          );
          console.log('Assessment results saved successfully');
        } catch (error) {
          console.error('Error saving assessment results:', error);
          toast.error('Failed to save your assessment results');
        }
      } else {
        console.warn('User not logged in, cannot save assessment results');
        toast.error('You must be logged in to save assessment results');
      }
      
      setTimeout(() => {
        window.location.href = "https://www.micancapital.au/courses-en";
      }, 10000);
    } catch (error) {
      console.error('Error calculating assessment results:', error);
      toast.error('An error occurred while processing your assessment');
    }
  };

  const handleAnswer = (value: string) => {
    setSelectedOption(value);
    
    let numericValue: number;
    
    if (currentQuestion < 26) {
      // For questions 1-26 (converted to 1-7 scale)
      numericValue = questions[currentQuestion].options.indexOf(value) + 1;
    } else {
      // For demographic questions (27-28)
      numericValue = value === 'Yes' ? 1 : 0;
    }

    console.log(`Question ${currentQuestion + 1}: Answer "${value}" -> Numeric value: ${numericValue}`);

    // Store both numeric value and text answer
    const newAnswers = { ...answers, [currentQuestion + 1]: numericValue };
    const newTextAnswers = { ...textAnswers, [currentQuestion + 1]: value };
    
    setAnswers(newAnswers);
    setTextAnswers(newTextAnswers);
    
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
