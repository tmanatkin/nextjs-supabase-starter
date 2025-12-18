"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { riskAssessmentQuestions } from "@/data/riskAssessmentQuestions";
import { Answer } from "@/types/RiskAssessment";

export default function RiskAssessmentPage() {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const currentQuestion = riskAssessmentQuestions[currentQuestionIndex];
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === riskAssessmentQuestions.length - 1;

  const handleNext = () => {
    if (selectedOption !== null) {
      const selectedOptionData = currentQuestion.options[selectedOption];
      const newAnswer: Answer = {
        questionId: currentQuestion.id,
        answer: selectedOptionData.text,
        points: selectedOptionData.points,
      };

      const updatedAnswers = [...answers.filter((a) => a.questionId !== currentQuestion.id), newAnswer];
      setAnswers(updatedAnswers);

      if (isLastQuestion) {
        // Survey complete - calculate total points
        const totalPoints = updatedAnswers.reduce((sum, answer) => sum + answer.points, 0);
        console.log("Survey completed. Answers:", updatedAnswers);
        console.log("Total points:", totalPoints);
        router.push(`/risk-assessment/results?score=${totalPoints}`);
      } else {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        // Load previous answer if going forward and coming back
        const nextQuestion = riskAssessmentQuestions[currentQuestionIndex + 1];
        const previousAnswer = updatedAnswers.find((a) => a.questionId === nextQuestion.id);
        if (previousAnswer) {
          const optionIndex = nextQuestion.options.findIndex((opt) => opt.text === previousAnswer.answer);
          setSelectedOption(optionIndex);
        } else {
          setSelectedOption(null);
        }
      }
    }
  };

  const handlePrevious = () => {
    if (!isFirstQuestion) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      const previousQuestion = riskAssessmentQuestions[currentQuestionIndex - 1];
      const previousAnswer = answers.find((a) => a.questionId === previousQuestion.id);
      if (previousAnswer) {
        const optionIndex = previousQuestion.options.findIndex((opt) => opt.text === previousAnswer.answer);
        setSelectedOption(optionIndex);
      } else {
        setSelectedOption(null);
      }
    }
  };

  const handleCancel = () => {
    router.push("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-2xl relative">
        <button
          onClick={handleCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <CardHeader>
          <CardTitle>Risk Assessment</CardTitle>
          <CardDescription>
            Question {currentQuestionIndex + 1} of {riskAssessmentQuestions.length}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{currentQuestion.question}</h3>
            <div className="space-y-2">
              {currentQuestion.options.map((option, index) => (
                <label
                  key={index}
                  className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedOption === index ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="answer"
                    value={index}
                    checked={selectedOption === index}
                    onChange={() => setSelectedOption(index)}
                    className="h-4 w-4"
                  />
                  <span>{option.text}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <div>
              {!isFirstQuestion && (
                <Button onClick={handlePrevious} variant="outline">
                  Previous
                </Button>
              )}
            </div>
            <Button onClick={handleNext} disabled={selectedOption === null}>
              {isLastQuestion ? "Complete" : "Next"}
            </Button>
          </div>

          <div className="pt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentQuestionIndex + 1) / riskAssessmentQuestions.length) * 100}%`,
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
