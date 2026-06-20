'use client';
import { useParams, useSearchParams } from 'next/navigation';
import { useMe } from '@/app/hooks/queries/useMe';
import { useGetOnSubmit } from '@/app/hooks/queries/useExams';

export default function Page() {
  const params = useParams();
  const searchParams = useSearchParams();
  const submissionId = Number(params.examSubmissionId);
  const examId = Number(searchParams.get('examId')) ?? 0;
  const { data: userData } = useMe();
  const { data } = useGetOnSubmit(examId, userData?.id ?? 0);

  const submission = data?.submissions?.find((s: any) => s.id === submissionId);


  if (!data || !submission) return null;

  const correctCount = submission.answerSubmissions.filter(
    (a: any) => a.questionChoice.isCorrect
  ).length;

  const pct = Math.round((submission.grade / submission.questionCount) * 100);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Header */}
      <h1 className="text-2xl font-medium mb-1">{data.exam.title}</h1>
      <p className="text-sm text-muted-foreground mb-6">
        {new Date(data.exam.createdAt).toLocaleDateString()}
      </p>

      {/* Score summary */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="bg-black rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-1">الدرجة</p>
          <p
            className={`text-2xl font-medium ${submission.grade >= submission.questionCount / 2
                ? 'text-green-700 dark:text-green-200'
                : 'text-red-600 dark:text-red-200'
              }`}
          >
            {submission.grade} / {submission.questionCount}
          </p>
        </div>
        <div className="bg-black rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-1">النتيجة</p>
          <p
            className={`text-2xl font-medium ${pct >= 50 ? 'text-green-700 dark:text-green-200' : 'text-red-600 dark:text-red-200'
              }`}
          >
            {pct}%
          </p>
        </div>
        <div className="bg-black rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-1">اجابات صحيحة</p>
          <p className="text-2xl font-medium">
            {correctCount}
          </p>
        </div>
      </div>

      {/* Question cards */}
      <div className="flex flex-col gap-3">
        {submission.answerSubmissions.map((answer: any, index: number) => {
          const isCorrect = answer.questionChoice.isCorrect;

          return (
            <div
              key={answer.question.id}
              className={`rounded-xl border p-4 ${isCorrect
                  ? 'bg-green-500/10 border-green-500/30 text-green-700 dark:bg-green-950/30 dark:border-green-800 dark:text-green-200'
                  : 'bg-destructive/10 border-destructive/30 text-destructive dark:bg-destructive/20 dark:border-destructive/40'
                }`} >
              {/* Question number + status */}
              <div
                className={`flex items-center gap-2 text-xs font-medium uppercase tracking-wide mb-2 ${isCorrect
                    ? 'text-green-700 dark:text-green-200'
                    : 'text-destructive dark:text-destructive'
                  }`}
              >

                {isCorrect ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><path d="m15 9-6 6m0-6 6 6" />
                  </svg>
                )}
                السؤال {index + 1}
              </div>

              {/* Question text (RTL for Arabic) */}
              <p className="text-sm text-right leading-relaxed mb-3" dir="rtl">
                {answer.question.question}
              </p>

              {/* Selected answer pill */}
              <p className="text-xs text-muted-foreground mb-1">الأجابة المختارة</p>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${isCorrect
                    ? 'bg-green-500/15 text-green-700 dark:bg-green-800/40 dark:text-green-200'
                    : 'bg-destructive/15 text-destructive dark:bg-destructive/20 dark:text-destructive'

                  }`}
              >
                {isCorrect ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                )}
                {answer.questionChoice.choiceText}
              </span>
              {
                !isCorrect && (
                  <div>
                    <h1>
                 الأجابة الصحيحه :<span> اسم فاعل</span>
                    </h1>
                  </div>
                )
              }
            </div>


          );

        })}
      </div>
    </div>
  );
}