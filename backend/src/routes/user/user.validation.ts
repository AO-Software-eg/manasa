import z from 'zod';

export const enrollSchema = z.object({
  courseId: z.number(),
});

export type enrollData = z.infer<typeof enrollSchema>;
