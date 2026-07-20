export const User = {
  type: 'object',
  properties: {
    id: {
      type: 'integer',
    },
    name: {
      type: 'string',
    },
    email: {
      type: 'string',
    },
    studentPhone: {
      type: 'string',
    },
    parentPhone: {
      type: 'string',
    },
    governorate: {
      type: 'string',
    },
    specialization: {
      type: 'string',
      nullable: true,
    },
    year: {
      type: 'string',
    },
  },
};

export const LoginRequest = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
    },
  },
};

export const SignupRequest = {
  type: 'object',
  required: [
    'name',
    'email',
    'password',
    'studentPhone',
    'parentPhone',
    'governorate',
    'YearCombo',
  ],
  properties: {
    name: {
      type: 'string',
    },
    email: {
      type: 'string',
    },
    password: {
      type: 'string',
    },
    studentPhone: {
      type: 'string',
    },
    parentPhone: {
      type: 'string',
    },
    governorate: {
      type: 'string',
    },
    specialization: {
      type: 'string',
    },
    YearCombo: {
      type: 'string',
    },
  },
};

export const EnrollRequest = {
  type: 'object',
  required: ['studentId', 'courseId'],
  properties: {
    studentId: {
      type: 'integer',
    },
    courseId: {
      type: 'integer',
    },
  },
};

export const ProgressResponse = {
  type: 'object',
  properties: {
    videoCount: {
      type: 'integer',
    },
    completedVideoCount: {
      type: 'integer',
    },
    videoCompletionPercentage: {
      type: 'number',
    },
    examCount: {
      type: 'integer',
    },
    solvedExamCount: {
      type: 'integer',
    },
    examProgressPercentage: {
      type: 'number',
    },
    lectureCount: {
      type: 'integer',
    },
    finishedLectureCount: {
      type: 'integer',
    },
    progressPercentage: {
      type: 'number',
    },
  },
};
