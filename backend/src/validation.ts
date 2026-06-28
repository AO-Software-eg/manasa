import z from 'zod';

export const MIN_PASSWORD_LENGTH = 6;
export const MIN_NAME_LENGTH = 2;
export const EGYPT_MOBILE_REGEX = /^\+201[0125]\d{8}$/;

export const examSubmissionSchema = z.object({
  studentId: z.number(),
  examId: z.number(),
  answers: z.array(
    z.object({
      questionId: z.number(),
      choiceId: z.number(),
    }),
  ),
});

export type examSubmissionData = z.infer<typeof examSubmissionSchema>;

export const enrollSchema = z.object({
  courseId: z.number(),
  studentId: z.number(),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(MIN_PASSWORD_LENGTH),
});

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

export const buyItemSchema = z.object({
  itemId: z.number(),
  itemType: z.enum(['course']),
  phoneNumber: z
    .string()
    .regex(EGYPT_MOBILE_REGEX, 'Invalid egyptian mobile phone number'),
});

export type buyItemData = z.infer<typeof buyItemSchema>;
