import z from 'zod';

export const enrollSchema = z.object({
  courseId: z.number(),
  studentId: z.number(),
});

export type enrollData = z.infer<typeof enrollSchema>;
