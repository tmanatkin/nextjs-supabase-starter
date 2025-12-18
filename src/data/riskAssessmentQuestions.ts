import { Question } from "@/types/RiskAssessment";

export const riskAssessmentQuestions: Question[] = [
  {
    id: 1,
    question: "How would you describe the age of your home?",
    options: [
      { text: "Less than 5 years old", points: 1 },
      { text: "5-20 years old", points: 2 },
      { text: "20-50 years old", points: 3 },
      { text: "Over 50 years old", points: 4 },
    ],
  },
  {
    id: 2,
    question: "What type of safety features does your home have?",
    options: [
      { text: "Full security system, detectors, fire extinguisher", points: 1 },
      { text: "Partial security system or only detectors", points: 2 },
      { text: "Basic smoke detectors only", points: 3 },
      { text: "No safety features", points: 4 },
    ],
  },
  {
    id: 3,
    question: "How often do you perform home maintenance?",
    options: [
      { text: "Regularly", points: 1 },
      { text: "Occasionally", points: 2 },
      { text: "Rarely", points: 3 },
      { text: "Almost never", points: 4 },
    ],
  },
  {
    id: 4,
    question: "What is your vehicle's age and condition?",
    options: [
      { text: "Less than 3 years, excellent condition", points: 1 },
      { text: "3-10 years, good condition", points: 2 },
      { text: "10-15 years, fair condition", points: 3 },
      { text: "15+ years, poor condition", points: 4 },
    ],
  },
  {
    id: 5,
    question: "How many miles do you drive per year?",
    options: [
      { text: "Less than 5,000 miles", points: 1 },
      { text: "5,000-12,000 miles", points: 2 },
      { text: "12,000-20,000 miles", points: 3 },
      { text: "20,000+ miles", points: 4 },
    ],
  },
  {
    id: 6,
    question: "Do you have any history of accidents or claims in the past 5 years?",
    options: [
      { text: "None", points: 1 },
      { text: "1 minor claim", points: 2 },
      { text: "2 claims", points: 3 },
      { text: "3+ claims", points: 4 },
    ],
  },
  {
    id: 7,
    question: "What type of neighborhood do you live in?",
    options: [
      { text: "Low crime/low traffic", points: 1 },
      { text: "Moderate crime or traffic", points: 2 },
      { text: "Higher crime or traffic", points: 3 },
      { text: "High crime/high traffic", points: 4 },
    ],
  },
  {
    id: 8,
    question: "How are your vehicles stored overnight?",
    options: [
      { text: "Garage, locked", points: 1 },
      { text: "Driveway, gated or secure", points: 2 },
      { text: "Street parking in safe area", points: 3 },
      { text: "Street parking in high-risk area", points: 4 },
    ],
  },
  {
    id: 9,
    question: "What steps have you taken to reduce home insurance risks?",
    options: [
      { text: "Comprehensive updates (wiring, plumbing, roof, fire-resistant)", points: 1 },
      { text: "Some updates", points: 2 },
      { text: "Minimal updates", points: 3 },
      { text: "No updates", points: 4 },
    ],
  },
  {
    id: 10,
    question: "How would you describe your driving habits?",
    options: [
      { text: "Defensive, rarely exceeds speed limits", points: 1 },
      { text: "Generally safe with occasional minor mistakes", points: 2 },
      { text: "Some risky behavior or frequent violations", points: 3 },
      { text: "Regular risky behavior or multiple violations", points: 4 },
    ],
  },
];
