import z from 'zod';

export const EGYPT_MOBILE_REGEX = /^\+201[0125]\d{8}$/;

export const buyItemSchema = z.object({
  type: z.enum(['item']),
  itemId: z.number(),
  itemType: z.enum(['course']),
  phoneNumber: z
    .string()
    .regex(EGYPT_MOBILE_REGEX, 'Invalid egyptian mobile phone number'),
});

export const walletDepositSchema = z.object({
  type: z.enum(['wallet-deposit']),
  amount: z.number(),
  phoneNumber: z
    .string()
    .regex(EGYPT_MOBILE_REGEX, 'Invalid egyptian mobile phone number'),
});

export type buyItemData = z.infer<typeof buyItemSchema>;
export type walletDepositData = z.infer<typeof walletDepositSchema>;
