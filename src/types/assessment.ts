
export interface Question {
  id: number;
  text: string;
  type: 'life-satisfaction' | 'dass' | 'demographic';
  options: string[];
}

export const questions: Question[] = [
  // Life Satisfaction Scale (Questions 1-5)
  {
    id: 1,
    text: "So far, I have achieved the important things I want in life.",
    type: "life-satisfaction",
    options: [
      "Strongly disagree",
      "Disagree", 
      "Slightly disagree",
      "Neither agree nor disagree",
      "Slightly agree",
      "Agree",
      "Strongly agree"
    ]
  },
  {
    id: 2,
    text: "The conditions of my life are excellent.",
    type: "life-satisfaction",
    options: [
      "Strongly disagree",
      "Disagree", 
      "Slightly disagree",
      "Neither agree nor disagree",
      "Slightly agree",
      "Agree",
      "Strongly agree"
    ]
  },
  {
    id: 3,
    text: "In most ways, my life is close to my ideal.",
    type: "life-satisfaction",
    options: [
      "Strongly disagree",
      "Disagree", 
      "Slightly disagree",
      "Neither agree nor disagree",
      "Slightly agree",
      "Agree",
      "Strongly agree"
    ]
  },
  {
    id: 4,
    text: "I am satisfied with my life.",
    type: "life-satisfaction",
    options: [
      "Strongly disagree",
      "Disagree", 
      "Slightly disagree",
      "Neither agree nor disagree",
      "Slightly agree",
      "Agree",
      "Strongly agree"
    ]
  },
  {
    id: 5,
    text: "If I could live my life over, I would change almost nothing.",
    type: "life-satisfaction",
    options: [
      "Strongly disagree",
      "Disagree", 
      "Slightly disagree",
      "Neither agree nor disagree",
      "Slightly agree",
      "Agree",
      "Strongly agree"
    ]
  },
  // DASS-21 Scale (Questions 6-26)
  {
    id: 6,
    text: "I find it hard to wind down.",
    type: "dass",
    options: [
      "Did not apply to me at all",
      "Applied to me to some degree or some of the time",
      "Applied to me to a considerable degree or a good part of time",
      "Applied to me very much or most of the time"
    ]
  },
  {
    id: 7,
    text: "I am aware of dryness in my mouth.",
    type: "dass",
    options: [
      "Did not apply to me at all",
      "Applied to me to some degree or some of the time",
      "Applied to me to a considerable degree or a good part of time",
      "Applied to me very much or most of the time"
    ]
  },
  {
    id: 8,
    text: "I cannot experience any positive feelings at all.",
    type: "dass",
    options: [
      "Did not apply to me at all",
      "Applied to me to some degree or some of the time",
      "Applied to me to a considerable degree or a good part of time",
      "Applied to me very much or most of the time"
    ]
  },
  {
    id: 9,
    text: "I have experienced breathing difficulties (e.g., excessively rapid breathing, breathlessness in the absence of physical exertion).",
    type: "dass",
    options: [
      "Did not apply to me at all",
      "Applied to me to some degree or some of the time",
      "Applied to me to a considerable degree or a good part of time",
      "Applied to me very much or most of the time"
    ]
  },
  {
    id: 10,
    text: "I find it difficult to work up the initiative to do things.",
    type: "dass",
    options: [
      "Did not apply to me at all",
      "Applied to me to some degree or some of the time",
      "Applied to me to a considerable degree or a good part of time",
      "Applied to me very much or most of the time"
    ]
  },
  // ... Adding remaining DASS questions (11-26)
  {
    id: 11,
    text: "I tend to overreact to situations.",
    type: "dass",
    options: [
      "Did not apply to me at all",
      "Applied to me to some degree or some of the time",
      "Applied to me to a considerable degree or a good part of time",
      "Applied to me very much or most of the time"
    ]
  },
  {
    id: 12,
    text: "I experience trembling (e.g., in the hands).",
    type: "dass",
    options: [
      "Did not apply to me at all",
      "Applied to me to some degree or some of the time",
      "Applied to me to a considerable degree or a good part of time",
      "Applied to me very much or most of the time"
    ]
  },
  {
    id: 13,
    text: "I feel that I have a lot of nervous energy.",
    type: "dass",
    options: [
      "Did not apply to me at all",
      "Applied to me to some degree or some of the time",
      "Applied to me to a considerable degree or a good part of time",
      "Applied to me very much or most of the time"
    ]
  },
  {
    id: 14,
    text: "I worry about situations in which I might panic and make a fool of myself.",
    type: "dass",
    options: [
      "Did not apply to me at all",
      "Applied to me to some degree or some of the time",
      "Applied to me to a considerable degree or a good part of time",
      "Applied to me very much or most of the time"
    ]
  },
  {
    id: 15,
    text: "I feel that I have nothing to look forward to.",
    type: "dass",
    options: [
      "Did not apply to me at all",
      "Applied to me to some degree or some of the time",
      "Applied to me to a considerable degree or a good part of time",
      "Applied to me very much or most of the time"
    ]
  },
  {
    id: 16,
    text: "I find myself getting agitated.",
    type: "dass",
    options: [
      "Did not apply to me at all",
      "Applied to me to some degree or some of the time",
      "Applied to me to a considerable degree or a good part of time",
      "Applied to me very much or most of the time"
    ]
  },
  {
    id: 17,
    text: "I find it difficult to relax.",
    type: "dass",
    options: [
      "Did not apply to me at all",
      "Applied to me to some degree or some of the time",
      "Applied to me to a considerable degree or a good part of time",
      "Applied to me very much or most of the time"
    ]
  },
  {
    id: 18,
    text: "I feel down-hearted and blue.",
    type: "dass",
    options: [
      "Did not apply to me at all",
      "Applied to me to some degree or some of the time",
      "Applied to me to a considerable degree or a good part of time",
      "Applied to me very much or most of the time"
    ]
  },
  {
    id: 19,
    text: "I am intolerant of anything that keeps me from getting on with what I am doing.",
    type: "dass",
    options: [
      "Did not apply to me at all",
      "Applied to me to some degree or some of the time",
      "Applied to me to a considerable degree or a good part of time",
      "Applied to me very much or most of the time"
    ]
  },
  {
    id: 20,
    text: "I feel close to panic.",
    type: "dass",
    options: [
      "Did not apply to me at all",
      "Applied to me to some degree or some of the time",
      "Applied to me to a considerable degree or a good part of time",
      "Applied to me very much or most of the time"
    ]
  },
  {
    id: 21,
    text: "I am unable to become enthusiastic about anything.",
    type: "dass",
    options: [
      "Did not apply to me at all",
      "Applied to me to some degree or some of the time",
      "Applied to me to a considerable degree or a good part of time",
      "Applied to me very much or most of the time"
    ]
  },
  {
    id: 22,
    text: "I feel I am not worth much as a person.",
    type: "dass",
    options: [
      "Did not apply to me at all",
      "Applied to me to some degree or some of the time",
      "Applied to me to a considerable degree or a good part of time",
      "Applied to me very much or most of the time"
    ]
  },
  {
    id: 23,
    text: "I feel rather touchy.",
    type: "dass",
    options: [
      "Did not apply to me at all",
      "Applied to me to some degree or some of the time",
      "Applied to me to a considerable degree or a good part of time",
      "Applied to me very much or most of the time"
    ]
  },
  {
    id: 24,
    text: "I am aware of the action of my heart in the absence of physical exertion (e.g., sense of heart rate increase, heart missing a beat).",
    type: "dass",
    options: [
      "Did not apply to me at all",
      "Applied to me to some degree or some of the time",
      "Applied to me to a considerable degree or a good part of time",
      "Applied to me very much or most of the time"
    ]
  },
  {
    id: 25,
    text: "I feel scared without any good reason.",
    type: "dass",
    options: [
      "Did not apply to me at all",
      "Applied to me to some degree or some of the time",
      "Applied to me to a considerable degree or a good part of time",
      "Applied to me very much or most of the time"
    ]
  },
  {
    id: 26,
    text: "I feel that life is meaningless.",
    type: "dass",
    options: [
      "Did not apply to me at all",
      "Applied to me to some degree or some of the time",
      "Applied to me to a considerable degree or a good part of time",
      "Applied to me very much or most of the time"
    ]
  },
  // Demographic Questions (27-28)
  {
    id: 27,
    text: "Are you a parent?",
    type: "demographic",
    options: ["Yes", "No"]
  },
  {
    id: 28,
    text: "Do you have family, friends, colleagues, etc. who are experiencing emotional distress and need help?",
    type: "demographic",
    options: ["Yes", "No"]
  }
];
