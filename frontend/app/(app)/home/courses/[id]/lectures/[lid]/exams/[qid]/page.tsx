'use client';

import { ChevronLeft, Send } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useExams } from '@/app/hooks/queries/useExams';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import Timer from '@/app/components/Timer';
import { ExamQuestion } from '@/types/exams';
import PopUp from '@/app/components/PopUp';
import { useMe } from '@/app/hooks/queries/useMe';
import { useSubmitExam } from '@/app/hooks/queries/useExams';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

function Page() {
  const { qid } = useParams();
  const { id } = useParams();
  const { lid } = useParams();
  const examId = qid ? Number(qid) : NaN;
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isQuestionVisited, setIsQuestionVisited] = useState<number[]>([1]);
  const [onExit, setOnExit] = useState(false);
  const [onOpenExit, setOpenOnExit] = useState(false);
  const [onSubmit, setOnSubmit] = useState(false);
  const [timeDone, setTimeDone] = useState(false);
  const { data: userData } = useMe();
  const SubmitExam = useSubmitExam();

  // ----------------------------
  // Helpers
  // ----------------------------

  const markQuestionAsVisited = (questionNumber: number) => {
    setIsQuestionVisited((prev) =>
      prev.includes(questionNumber) ? prev : [...prev, questionNumber],
    );
  };

  const { data, isLoading, error } = useExams(examId);

  const questionCount = data?.questions.length || 0;

  const handleSubmitData = useCallback(() => {
    if (!userData) return;

    const formattedAnswers = Object.entries(answers).map(
      ([questionId, choiceId]) => ({
        questionId: Number(questionId),
        choiceId,
      }),
    );

    SubmitExam.mutate(
      {
        studentId: userData.id,
        examId,
        answers: formattedAnswers,
      },
      {
        onSuccess: (data) => {
          console.log('Exam submitted successfully:', data);
          router.push(`/home/courses/${id}/lectures/${lid}/exams/${examId}/submitted`);
        },
        onError: (error) => {
          console.error(error);
        },
      }
    );
  }, [answers, userData, examId, id, router, SubmitExam]);

  useEffect(() => {
    if (onExit) {
      setAnswers({});
      setCurrentQuestion(1);
      setIsQuestionVisited([1]);
      router.push('/home/courses/');
    }
  }, [onExit, router]);

  useEffect(() => {
    if (timeDone) {
      toast('انتهى الوقت المحدد للامتحان. سيتم تقديم إجاباتك الآن.');
      handleSubmitData();
    }
  }, [timeDone]);
  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-background flex items-center justify-center p-6 text-foreground">
        <Card className="w-full max-w-md bg-card border-border">
          <CardContent className="flex flex-col items-center gap-4 py-10">
            <div className="h-10 w-10 rounded-full border-4 border-muted border-t-primary animate-spin" />

            <h2 className="text-xl font-semibold">
              جاري تحميل بيانات الامتحان
            </h2>

            <p className="text-muted-foreground text-center">
              برجاء الانتظار قليلاً...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen bg-background flex items-center justify-center p-6 text-foreground">
        <Card className="w-full max-w-md bg-card border-destructive">
          <CardContent className="flex flex-col items-center gap-4 py-10">

            <h2 className="text-2xl font-semibold text-destructive">
              حدث خطأ
            </h2>

            <p className="text-muted-foreground text-center">
              تعذر تحميل بيانات الامتحان
            </p>

            <Button onClick={() => window.location.reload()} className="cursor-pointer">
              إعادة المحاولة
            </Button>

          </CardContent>
        </Card>
      </div>
    );
  }



  // ----------------------------
  // Navigation
  // ----------------------------

  const nextQuestion = () => {
    setCurrentQuestion((prev) => {
      const next = Math.min(prev + 1, questionCount);
      markQuestionAsVisited(next);
      return next;
    });
  };

  const prevQuestion = () => {
    setCurrentQuestion((prev) => {
      const previous = Math.max(prev - 1, 1);
      markQuestionAsVisited(previous);
      return previous;
    });
  };

  const gotoQuestion = (questionNumber: number) => {
    setCurrentQuestion(questionNumber);
    markQuestionAsVisited(questionNumber);
  };

  // ----------------------------
  // Answers
  // ----------------------------

  const handleSelect = (optionId: number) => {
    const currentQuestionData = data?.questions[currentQuestion - 1];
    if (!currentQuestionData) return;

    setAnswers((prev) => ({
      ...prev,
      [currentQuestionData.id]: optionId,
    }));
  };

  // ----------------------------
  // Current selected answer
  // ----------------------------

  const currentQuestionData = data?.questions[currentQuestion - 1];


  const selectedOption: number | undefined = currentQuestionData
    ? answers[currentQuestionData.id]
    : undefined;

  return (
    <div className="max-w-full flex flex-col p-4 gap-4 min-h-screen bg-background text-foreground pt-28">
      {/* Top Actions */}
      <div className="flex flex-row-reverse items-start my-4 p-4 justify-between w-full">
        <button
          className="flex items-center bg-destructive/10 border border-destructive/30 p-3 rounded-2xl flex-row-reverse gap-2 text-sm text-destructive hover:bg-destructive/25 transition cursor-pointer"
          onClick={() => setOpenOnExit(true)}
        >
          <ChevronLeft size={16} />
          الخروج من الامتحان
        </button>

        <button
          className="flex items-center bg-primary hover:bg-primary/95 text-primary-foreground p-3 rounded-2xl flex-row-reverse gap-2 text-sm transition shadow-sm cursor-pointer"
          onClick={() => setOnSubmit(true)}
        >
          <Send size={16} />
          إرسال الإجابات
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 lg:h-[calc(102dvh-5rem)] lg:overflow-y-auto overflow-x-hidden">
        {/* Question Navigation */}
        <div className="mb-10 w-full max-w-4xl mx-auto bg-card border border-border rounded-3xl p-6 shadow-xs">
          {/* Timer */}
          <Timer timeDone={timeDone} setTimeDone={setTimeDone} />

          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              السؤال {currentQuestion} من {questionCount}
            </p>
            <p className="text-sm text-primary font-bold">
              {Object.keys(answers).length} / {questionCount} مجاب
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-secondary rounded-full mb-6 overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{
                width: `${(Object.keys(answers).length / questionCount) * 100}%`,
              }}
            />
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-wrap gap-3 justify-center">
            {Array(questionCount)
              .fill(0)
              .map((_, index) => {
                const questionNumber = index + 1;
                const isCurrent = questionNumber === currentQuestion;
                const questionId = data?.questions[questionNumber - 1]?.id;
                const isAnswered = questionId !== undefined
                  ? answers[questionId] !== undefined
                  : false;
                const isVisited = isQuestionVisited.includes(questionNumber);

                return (
                  <button
                    key={index}
                    onClick={() => gotoQuestion(questionNumber)}
                    className={`
                      w-12 h-12 rounded-2xl flex items-center justify-center
                      text-sm font-semibold transition-all duration-200 border cursor-pointer
                      ${isCurrent
                        ? 'bg-primary border-primary text-primary-foreground scale-110 shadow-md shadow-primary/30'
                        : isAnswered
                          ? 'bg-emerald-600 border-emerald-500 text-white hover:scale-105 shadow-xs'
                          : isVisited
                            ? 'bg-amber-500 border-amber-400 text-black hover:scale-105 shadow-xs'
                            : 'bg-secondary border-border text-foreground hover:bg-secondary/80 hover:scale-105'
                      }
                    `}
                  >
                    {questionNumber}
                  </button>
                );
              })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-5 mt-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-primary" />
              الحالي
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-emerald-600" />
              مجاب
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-amber-500" />
              تمت زيارته
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-secondary border border-border" />
              غير مفتوح
            </div>
          </div>
        </div>

        {data?.questions.map((question: ExamQuestion, index: number) => {
          if (index + 1 !== currentQuestion) return null;
          return (
            <div key={question.id} className="max-w-4xl mx-auto">
              <h1 className="text-2xl md:text-3xl font-bold mb-6 text-right leading-tight">
                {question.question}
              </h1>
              <RadioGroup
                value={selectedOption !== undefined ? selectedOption.toString() : ''}
                className="w-full flex flex-col items-end gap-4"
                onValueChange={(value) => {
                  handleSelect(Number(value));
                }}
              >
                {question.questionChoices.map((option) => (
                  <div
                    key={option.id}
                    className={`
                      flex flex-row-reverse items-center gap-3 w-full rounded-2xl transition-all border
                      ${
                      selectedOption === option.id
                        ? 'bg-primary/10 border-primary shadow-xs'
                        : 'bg-card border-border hover:border-primary/50 hover:bg-secondary/40'
                      }
                    `}
                  >
                    <RadioGroupItem
                      value={option.id.toString()}
                      id={option.id.toString()}
                      className="mx-4"
                    />
                    <Label
                      htmlFor={option.id.toString()}
                      className="w-full flex justify-end text-right py-5 px-2 cursor-pointer text-base text-foreground font-semibold"
                    >
                      {option.choiceText}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center p-4">
        <button
          className={`
            ${currentQuestion === 1 ? 'opacity-0 pointer-events-none' : 'hover:bg-secondary/80'}
            border border-border bg-card rounded-2xl px-5 py-3
            flex items-center gap-2 flex-row-reverse transition cursor-pointer text-foreground
          `}
          onClick={() => prevQuestion()}
          disabled={currentQuestion === 1}
        >
          السابق
          <ChevronLeft size={16} className="rotate-180" />
        </button>

        <button
          className={`
            ${currentQuestion === questionCount ? 'opacity-50 cursor-not-allowed' : 'bg-primary text-primary-foreground hover:bg-primary/90'}
            px-5 py-3 rounded-2xl flex items-center gap-2 flex-row-reverse transition cursor-pointer font-semibold
          `}
          onClick={() => nextQuestion()}
          disabled={currentQuestion === questionCount}
        >
          <ChevronLeft size={16} />
          التالي
        </button>
      </div>

      <PopUp
        open={onOpenExit}
        title="هل أنت متأكد أنك تريد الخروج؟"
        description="سيتم فقدان جميع الإجابات غير المحفوظة."
        confirmText="خروج"
        confirmClassName="bg-destructive hover:bg-destructive/90 text-destructive-foreground font-semibold"
        onClose={() => setOpenOnExit(false)}
        onConfirm={() => setOnExit(true)}
        pending={false}
      />

      <PopUp
        open={onSubmit}
        title="هل أنت متأكد أنك تريد تقديم الامتحان؟"
        description="تأكد من مراجعة إجاباتك قبل تقديم الامتحان."
        confirmText={SubmitExam.isPending ? "جاري ارسال الاجابات" : "تقديم الامتحان"}
        confirmClassName="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
        onClose={() => setOnSubmit(false)}
        onConfirm={handleSubmitData}
        pending={SubmitExam.isPending}
      />
    </div>
  );
}

export default Page;