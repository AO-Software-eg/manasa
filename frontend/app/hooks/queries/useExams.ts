import { useQuery } from '@tanstack/react-query';
import { api } from '@/app/hooks/api';
import { ExamQuestion , ExamQuestionChoice } from '@/types/exams';
export const useExams = (examId: number) => {
  return useQuery({
    queryKey: ['exams', examId],
    enabled: !isNaN(examId),
    queryFn: async () => {
      const { data } = await api.get(`/exams/${examId}`);
      return {
        questions: data.map((question: ExamQuestion) => ({
          id: question.id,
          question: question.question,
          questionChoices: (question.questionChoices ?? []).map((choice: ExamQuestionChoice) => ({
            id: choice.id,
            choiceText: choice.choiceText,
          })),
        })),
      };
    },
  });
};