export const Course = {
  type: 'object',
  properties: {
    id: {
      type: 'integer',
      example: 1,
    },
    title: {
      type: 'string',
    },
    imageUrl: {
      type: 'string',
    },
    price: {
      type: 'integer',
    },
    year: {
      type: 'string',
    },
    specialization: {
      type: 'string',
      nullable: true,
    },
    description: {
      type: 'string',
      nullable: true,
    },
    tags: {
      type: 'string',
      nullable: true,
    },
    createdAt: {
      type: 'string',
      format: 'date-time',
    },
  },
};

export const CourseListResponse = {
  type: 'object',
  properties: {
    message: {
      type: 'string',
    },
    data: {
      type: 'array',
      items: {
        $ref: '#/components/schemas/Course',
      },
    },
  },
};

export const CourseResponse = {
  type: 'object',
  properties: {
    message: {
      type: 'string',
    },
    data: {
      $ref: '#/components/schemas/Course',
    },
  },
};
