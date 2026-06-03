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