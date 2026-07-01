export const lecturesPaths = {
  '/lectures/{lectureId}/videos': {
    get: {
      tags: ['Lectures'],
      summary: 'Get lecture videos',

      security: [
        {
          CookieAuth: [],
        },
      ],

      parameters: [
        {
          name: 'lectureId',
          in: 'path',
          required: true,
          schema: {
            type: 'integer',
          },
        },
      ]  ,

      responses: {
        '200': {
          description: 'Videos',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/LectureVideo',
                },
              },
            },
          },
        },
      },
    },
  },
} ;