'use client';

import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/app/hooks/api';
import axios from 'axios';
import {
  ExamQuestion,
  ExamQuestionChoice,
  ExamSubmissionResponse,
} from '@manasa/shared';
import { useRouter } from 'next/navigation';

export const useExams = (examId: number, enabled: boolean) => {
  return useQuery({
    queryKey: ['exams', examId],
    enabled,
    queryFn: async () => {
      const { data } = await api.get(`/exam/${examId}`);
      const questions = Array.isArray(data) ? data : (data.questions ?? []);
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
        const response = await api.post('/exam/submit', {
          examId,
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

export const useGetExamSubmissions = () => {
  return useQuery({
    queryKey: ['examSubmissions'],
    enabled: true,
    queryFn: async () => {
      const res = await api.get(`/user/grades`);
      if (!res.data) throw new Error('جدث خطأ اثناء تحميل الامتحانات');
      return res.data;
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 10 * 60 * 1000,
  });
};
type UseGetOnSubmitOptions = {
  enabled?: boolean;
};

export const useGetOnSubmit = (
  examId: number,
  options?: UseGetOnSubmitOptions,
) => {
  return useQuery<ExamSubmissionResponse>({
    queryKey: ['exam', examId],

    enabled: !isNaN(examId) && (options?.enabled ?? true),

    queryFn: async () => {
      const res = await api.get(`/user/grades/${examId}`);

      if (!res.data) {
        throw new Error('حدث خطأ أثناء تحميل التصحيح');
      }

      return res.data;
    },

    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
};
