import z from 'zod';

export const examSubmissionSchema = z.object({
  examId: z.number(),
  answers: z.array(
    z.object({
      questionId: z.number(),
      choiceId: z.number(),
    }),
  ),
});

export type examSubmissionData = z.infer<typeof examSubmissionSchema>;
