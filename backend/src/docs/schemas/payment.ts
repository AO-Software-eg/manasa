export const BuyItemRequest = {
  type: 'object',
  required: ['type', 'itemType', 'itemId', 'phoneNumber'],
  properties: {
    type: {
      type: 'string',
      enum: ['item'],
    },
    itemType: {
      type: 'string',
      enum: ['course'],
      example: 'course',
    },
    itemId: {
      type: 'integer',
      example: 12,
    },
    phoneNumber: {
      type: 'string',
      example: '+201281050635',
    },
  },
};

export const WalletDepositRequest = {
  type: 'object',
  required: ['type', 'amount', 'phoneNumber'],
  properties: {
    type: {
      type: 'string',
      enum: ['wallet-deposit'],
    },
    amount: {
      type: 'integer',
      example: 200,
    },
    phoneNumber: {
      type: 'string',
      example: '+201281050635',
    },
  },
};

export const PaymobIntentionResponse = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      example: 'intention_xxxxxxxxx',
    },
    client_secret: {
      type: 'string',
    },
    payment_keys: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    payment_methods: {
      type: 'array',
      items: {
        type: 'integer',
      },
    },
    amount: {
      type: 'integer',
      example: 50000,
    },
    currency: {
      type: 'string',
      example: 'EGP',
    },
    payment_url: {
      type: 'string',
      format: 'uri',
    },
  },
};

export const PaymobCallbackRequest = {
  type: 'object',
  properties: {
    type: {
      type: 'string',
      example: 'TRANSACTION',
    },
    obj: {
      type: 'object',
      properties: {
        payment_key_claims: {
          type: 'object',
          properties: {
            billing_data: {
              type: 'object',
              properties: {
                email: {
                  type: 'string',
                  format: 'email',
                },
              },
            },
            extra: {
              type: 'object',
              properties: {
                itemData: {
                  type: 'object',
                },
              },
            },
          },
        },
      },
    },
  },
};
