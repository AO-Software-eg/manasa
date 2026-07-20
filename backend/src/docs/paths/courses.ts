
export const coursesPaths = {
  '/courses': {
    get: {
      tags: ['Courses'],
      summary: 'Get all courses',
      description: 'Returns a list of all available courses.',

      responses: {
        '200': {
          description: 'Courses retrieved successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CourseListResponse',
              },
            },
          },
        },

        '500': {
          description: 'Internal server error',
        },
      },
    },
  },

  '/courses/{courseId}': {
    get: {
      tags: ['Courses'],
      summary: 'Get course by ID',
      description: 'Returns a single course.',

      parameters: [
        {
          name: 'courseId',
          in: 'path',
          required: true,
          description: 'Course ID',
          schema: {
            type: 'integer',
          },
        },
      ],

      responses: {
        '200': {
          description: 'Course found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CourseResponse',
              },
            },
          },
        },

        '401': {
          description: 'Invalid course id',
        },

        '404': {
          description: 'Course not found',
        },

        '500': {
          description: 'Internal server error',
        },
      },
    },
  },

  '/courses/{courseId}/lectures': {
    get: {
      tags: ['Courses'],
      summary: 'Get course lectures',
      description: 'Returns all lectures that belong to a course.',

      security: [
        {
          CookieAuth: [],
        },
      ],

      parameters: [
        {
          name: 'courseId',
          in: 'path',
          required: true,
          description: 'Course ID',
          schema: {
            type: 'integer',
          },
        },
      ],

      responses: {
        '200': {
          description: 'Course lectures',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    example: 'Found course lectures',
                  },
                  data: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/Lecture',
                    },
                  },
                },
              },
            },
          },
        },

        '401': {
          description: 'Invalid course id',
        },

        '403': {
          description: 'User is not enrolled in this course',
        },

        '404': {
          description: 'Course not found',
        },

        '500': {
          description: 'Internal server error',
        },
      },
    },
  },
};
