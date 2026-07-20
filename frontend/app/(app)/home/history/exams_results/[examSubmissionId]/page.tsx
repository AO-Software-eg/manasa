'use client';

import { useEffect } from 'react';
import {
  useParams,
  useRouter,
  useSearchParams,
} from 'next/navigation';

import { useMe } from '@/app/hooks/queries/useMe';
import { useGetOnSubmit } from '@/app/hooks/queries/useExams';

import {
  AnswerGrade,
  Submissions,
} from '@/types';

export default function Page() {
  const router = useRouter();

  const params = useParams();

  const searchParams = useSearchParams();

  const submissionId = Number(params.examSubmissionId);

  const examId = Number(searchParams.get('examId'));

  const { data: userData } = useMe();

  const userId = userData?.id;

  const { data, isLoading } = useGetOnSubmit(examId, userId);

  const submission = data?.submissions.find((s: Submissions) => s.id === submissionId);

  useEffect(() => {
    if (!isLoading && (!data || !submission)) {
      router.replace('/home/history/exams_results');
    }
  }, [isLoading, data, submission, router]);

  if (isLoading) {
    return <h1>loading...</h1>;
  }

  if (!data || !submission) {
    return null;
  }

  const correctCount = submission.answerSubmissions.filter(
    (a: AnswerGrade) => a.questionChoice.isCorrect,
  ).length;

  const pct =
    submission.questionCount > 0
      ? Math.round((submission.grade / submission.questionCount) * 100)
      : 0;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-medium mb-1">{data.exam.title}</h1>

      <p className="text-sm text-muted-foreground mb-6">
        {new Date(submission.createdAt).toLocaleDateString()}
      </p>

      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-1">الدرجة</p>

          <p
            className={`text-2xl font-medium ${
              submission.grade >= submission.questionCount / 2
                ? 'text-primary'
                : 'text-destructive'
            }`}
          >
            {submission.grade} / {submission.questionCount}
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-1">النتيجة</p>

          <p
            className={`text-2xl font-medium ${
              pct >= 50 ? 'text-primary' : 'text-destructive'
            }`}
          >
            {pct}%
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-1">اجابات صحيحة</p>

          <p className="text-2xl font-medium">{correctCount}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {submission.answerSubmissions.map((answer: AnswerGrade, index: number) => {
          const isCorrect = answer.questionChoice.isCorrect;
          const correctChoice = answer.question.correctChoices?.[0];

          return (
            <div
              key={answer.question.id}
              className={`rounded-xl border p-4 ${
                isCorrect
                  ? 'bg-primary/10 border-primary/30 text-primary'
                  : 'bg-destructive/10 border-destructive/30 text-destructive'
              }`}
            >
              <div
                className={`flex items-center gap-2 text-xs font-medium uppercase tracking-wide mb-2 ${
                  isCorrect ? 'text-primary' : 'text-destructive'
                }`}
              >
                السؤال {index + 1}
              </div>

              <p className="text-sm text-right leading-relaxed mb-3" dir="rtl">
                {answer.question.question}
              </p>

              <p className="text-xs text-muted-foreground mb-1">الأجابة المختارة</p>

              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${
                  isCorrect ? 'bg-primary/15 text-primary' : 'bg-destructive/15 text-destructive'
                }`}
              >
                {answer.questionChoice.choiceText}
              </span>

              {!isCorrect && (
                <div className="mt-2 text-sm">
                  الأجابة الصحيحة:{' '}
                  <span className="font-medium">{correctChoice?.choiceText}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

