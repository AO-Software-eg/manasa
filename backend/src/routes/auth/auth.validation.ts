import z from 'zod';

const MIN_PASSWORD_LENGTH = 6;
const MIN_NAME_LENGTH = 2;
const EGYPT_MOBILE_REGEX = /^\+201[0125]\d{8}$/;

export const signupSchema = z
  .object({
    email: z.email(),
    name: z.string().min(MIN_NAME_LENGTH, 'Name is too short.'),
    studentPhone: z
      .string()
      .trim()
      .regex(EGYPT_MOBILE_REGEX, 'Invalid egyptian mobile phone number.'),
    parentPhone: z
      .string()
      .trim()
      .regex(EGYPT_MOBILE_REGEX, 'Invalid egyptian mobile phone number.'),
    specialization: z.string().optional(),
    governorate: z.string('Governorate must be picked.'),
    YearCombo: z.string('School Year must be picked.'),
    password: z.string().min(MIN_PASSWORD_LENGTH, 'Password is too short.'),
    confirmPassword: z
      .string()
      .min(MIN_PASSWORD_LENGTH, 'Password is too short.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Password confirmation doesn't match.",
  })
  .refine((data) => data.studentPhone !== data.parentPhone, {
    error: 'Student and parent phone numbers must differ.',
  });

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(MIN_PASSWORD_LENGTH),
});

export const sessionSchema = z.object({
  ip: z.string(),
});

export const resetPasswordSchema = z.object({
  resetToken: z.string(),
  newPassword: z.string().min(MIN_PASSWORD_LENGTH, 'Password is too short'),
});

export type SignupData = z.infer<typeof signupSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type SessionData = z.infer<typeof sessionSchema>;
export type ResetPasswordData = z.infer<typeof resetPasswordSchema>;
