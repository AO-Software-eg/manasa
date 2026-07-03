
export const videosPaths = {
  '/videos/{videoId}': {
    get: {
      tags: ['Videos'],

      summary: 'Generate VdoCipher OTP',

      security: [
        {
          CookieAuth: [],
        },
      ],

      parameters: [
        {
          name: 'videoId',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
          },
        },
      ] ,

      responses: {
        '200': {
          description: 'OTP generated',

          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/VideoOTPResponse',
              },
            },
          },
        },
      },
    },
  },
};