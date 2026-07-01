export const QuestionChoice = {
  type: 'object',
  properties: {
    id: {
      type: 'integer',
    },
    choiceText: {
      type: 'string',
    },
  },
};

export const Question = {
  type: 'object',
  properties: {
    id: {
      type: 'integer',
    },
    question: {
      type: 'string',
    },
    choices: {
      type: 'array',
      items: {
        $ref: '#/components/schemas/QuestionChoice',
      },
    },
  },
};

export const Exam = {
  type: 'object',
  properties: {
    id: {
      type: 'integer',
    },
    lectureId: {
      type: 'integer',
    },
    title: {
      type: 'string',
    },
  },
};

export const SubmitExamRequest = {
  type: 'object',
  required: ['studentId', 'examId', 'answers'],
  properties: {
    studentId: {
      type: 'integer',
    },
    examId: {
      type: 'integer',
    },
    answers: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          questionId: {
            type: 'integer',
          },
          choiceId: {
            type: 'integer',
          },
        },
      },
    },
  },
};

export const GradeResponse = {
  type: 'object',
  properties: {
    grade: {
      type: 'integer',
    },
    questionCount: {
      type: 'integer',
    },
    percentage: {
      type: 'number',
    },
  },
};
