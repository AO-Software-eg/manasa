'use client';

import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/app/hooks/api';
import axios from 'axios';
import { ExamQuestion, ExamQuestionChoice } from '@/types/exams';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

export const useExams = (examId: number) => {
  return useQuery({
    queryKey: ['exams', examId],
    enabled: !isNaN(examId),
    queryFn: async () => {
      const { data } = await api.get(`/exams/${examId}`);
      const questions = Array.isArray(data) ? data : data.questions ?? [];
      return {
        questions: questions.map((question: ExamQuestion) => ({
          id: question.id,
          question: question.question,
          questionChoices: (question.questionChoices ?? []).map(
            (choice: ExamQuestionChoice) => ({
              id: choice.id,
              choiceText: choice.choiceText,
            }),
          ),
        })),
      };
    },
  });
};

export const useSubmitExam = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async ({
      examId,
      studentId,
      answers,
    }: {
      examId: number;
      studentId: number;
      answers: {
        questionId: number;
        choiceId: number;
      }[];
    }) => {
      try {
        const response = await api.post('/exams/submit', {
          examId,
          studentId,
          answers,
        });
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Response Data:', error.response?.data);
          console.error('Status:', error.response?.status);
        }
        throw error;
      }
    },



    onError: (error: unknown) => {
      if (axios.isAxiosError(error)) {
        console.error('Submit error:', error.response?.data);
        console.error('Status:', error.response?.status);
      } else {
        console.error('Unexpected error:', error);
      }
    },
  });
};

export const useGetExamSubmissions = (userId: number) => {
  return useQuery({
    queryKey: ["userId", userId],
    enabled: !isNaN(userId),
    queryFn: async () => {
      const res = await api.get(`/users/${userId}/grades`);
      if (!res.data) throw new Error('جدث خطأ اثناء تحميل الامتحانات');
      return res.data
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 10 * 60 * 1000,
  })
}
export const useGetOnSubmit = (examId: number, userId: number) => {
  return useQuery({
    queryKey: ["examId", examId],
    enabled: !isNaN(examId),
    queryFn: async () => {
      const res = await api.get(`/users/${userId}/grades/${examId}`);
      if (!res.data) throw new Error('جدث خطأ اثناء تحميل التصحيح');
      return res.data
    },
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    
  })

}
