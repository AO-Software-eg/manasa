import z from 'zod';

export const MIN_PASSWORD_LENGTH = 6;
export const MIN_NAME_LENGTH = 2;
export const EGYPT_MOBILE_REGEX = /^\+201[0125]\d{8}$/;

export const userSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  studentPhone: z.string(),
  parentPhone: z.string(),
  specialization: z.string().nullable(),
  governorate: z.string(),
  year: z.string(),
  passwordHash: z.string(),
});

// Courses table in db
export const courseSchema = z.object({
  id: z.string(),
  title: z.string(),
  image_url: z.string(),
  price: z.number(),
  year: z.string(),
  specialization: z.string().nullable(),
  description: z.string().nullable(),
  tags: z.string().nullable(),
});

// Lectures table in db
export const lectureSchema = z.object({
  id: z.string(),
  course_id: z.string(),
  title: z.string(),
});

// Lecture videos table in db
export const lectureVideoSchema = z.object({
  id: z.string(),
  lecture_id: z.string(),
  title: z.string(),
  video_id: z.string(),
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
