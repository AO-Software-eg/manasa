import { useQuery } from '@tanstack/react-query';
import { api } from '@/app/hooks/api';
import {ExamQuestionChoice, ExamQuestion} from '@/types/exams';


export const useExams = (examId: string) => {
    return useQuery({
        queryKey: ['exams', examId],
        queryFn: async () => {
            const response = await api.get(`/exams/${examId}`);
            const data = response.data;
            console.log(data);
          return {
            questions: data.map((question: ExamQuestion) => ({
              id: question.id,
              question: question.question,
                choices: question.choices.map((choice: ExamQuestionChoice) => ({
                    id: choice.id,
                    choice_text: choice.choice_text,
                })) ,
            })) ,

            
          }
        }
    });
}

