export const Lecture = {
  type: 'object',
  properties: {
    id: {
      type: 'integer',
    },
    title: {
      type: 'string',
    },
    courseId: {
      type: 'integer',
    },
    createdAt: {
      type: 'string',
      format: 'date-time',
    },
  },
};

export const LectureVideo = {
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
    videoId: {
      type: 'string',
    },
  },
};
