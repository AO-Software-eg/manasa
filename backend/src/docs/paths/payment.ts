export const paymentPaths = {
  '/payment/buy-item': {
    post: {
      tags: ['Payment'],
      summary: 'Create a Paymob payment intention',
      description:
        'Creates a Paymob payment intention for purchasing a supported item (currently courses only).',

      security: [
        {
          bearerAuth: [],
        },
      ],

      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/BuyItemRequest',
            },
          },
        },
      },

      responses: {
        '200': {
          description: 'Payment intention created successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/PaymobIntentionResponse',
              },
            },
          },
        },

        '400': {
          description: 'Invalid request or unauthorized',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
            },
          },
        },

        '404': {
          description: 'Course not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
            },
          },
        },

        '501': {
          description: 'Unsupported item type',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
            },
          },
        },

        '500': {
          description: 'Server error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
            },
          },
        },
      },
    },
  },

  '/payment/paymob-callback': {
    post: {
      tags: ['Payment'],
      summary: 'Paymob webhook callback',
      description:
        'Receives transaction notifications from Paymob after payment.',

      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/PaymobCallbackRequest',
            },
          },
        },
      },

      responses: {
        '200': {
          description: 'Webhook processed successfully',
        },

        '400': {
          description: 'Invalid webhook payload',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
            },
          },
        },

        '500': {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
            },
          },
        },
      },
    },
  },
};
