// post and get  Exam operations
export type ExamQuestionChoice = {
  id: number;
  choiceText: string;
};

export type ExamQuestion = {
  id: number;
  question: string;
  questionChoices: ExamQuestionChoice[];
};

export type ExamSubmission = {
  studentId: number;
  examId: number;
  answers: Array<{
    questionId: number;
    choiceId: number;
  }>;
};

// get exam grades

export type Exam = {
  createdAt: string;
  id: number;
  lectureId: number;
  title: string;

}

export type Submissions = {
  id: number;
  studentId: number;
  createdAt: string;
  grade: number;
  questionCount: number;
  exam: {
    id: number;
    title: string;
  };
  answerSubmissions: AnswerGrade[];
};
export type AnswerGrade= {
  studentId: number;
  examSubmissionId: number;
  question: {
    id: number;
    question: string;
  };
  questionChoice: {
    id: number;
    choiceText: string;
    isCorrect: boolean;
  };
};
