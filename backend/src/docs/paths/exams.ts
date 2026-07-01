export const examsPaths = {
  '/exams/{examId}': {
    get: {
      tags: ['Exams'],
      summary: 'Get exam',
      security: [{ CookieAuth: [] }],
    },
  },

  '/exams/submit': {
    post: {
      tags: ['Exams'],
      summary: 'Submit exam',

      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/SubmitExamRequest',
            },
          },
        },
      },

      responses: {
        '200': {
          description: 'Grade',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/GradeResponse',
              },
            },
          },
        },
      },
    },
  },
} ;