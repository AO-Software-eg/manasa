import { z } from 'zod';


const examQuestionChoiceSchema = z.object({
  id: z.string(),
  choice_text: z.string(),
});

export type ExamQuestionChoice = z.infer<typeof examQuestionChoiceSchema>;


const examQuestionSchema = z.object({
  id: z.string(),
  question: z.string(),
  choices: examQuestionChoiceSchema.array(),
});
export type ExamQuestion = z.infer<typeof examQuestionSchema>;