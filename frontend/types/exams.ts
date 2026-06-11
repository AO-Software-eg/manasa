import { z } from 'zod';


const examQuestionChoiceSchema = z.object({
  id: z.number(),
  choiceText: z.string(),
});

export type ExamQuestionChoice = z.infer<typeof examQuestionChoiceSchema>;


const examQuestionSchema = z.object({
  id: z.number(),
  question: z.string(),
  questionChoices: examQuestionChoiceSchema.array(),
});
export type ExamQuestion = z.infer<typeof examQuestionSchema>;



 const examSubmissionSchema = z.object({
  studentId: z.number(),
  examId: z.number(),
  answers: z.array(
    z.object({
      questionId: z.number(),
      choiceId: z.number(),
    }),
  ),
});

export type examSubmissionSchema = z.infer<typeof examQuestionSchema>;