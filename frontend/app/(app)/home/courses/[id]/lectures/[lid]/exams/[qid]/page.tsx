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

function Page() {
  const { qid } = useParams();
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
    SubmitExam.mutate({
      studentId: userData.id,
      examId,
      answers: formattedAnswers,
    });
  }, [userData, answers, examId, SubmitExam]);

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
    return <div>Loading...</div>;
  }

  if (error) {
    console.error('Error fetching exam data:', error);
    return <div>Something went wrong</div>;
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
    <div className="max-w-full flex flex-col p-4 gap-4 min-h-screen bg-[#0d0d0d] text-white">
      {/* Top Actions */}
      <div className="flex flex-row-reverse items-start my-4 p-4 justify-between w-full">
        <button
          className="flex items-center bg-red-500/20 border border-red-500/40 p-3 rounded-2xl flex-row-reverse gap-2 text-sm hover:bg-red-500/30 transition"
          onClick={() => setOpenOnExit(true)}
        >
          <ChevronLeft size={16} />
          الخروج من الامتحان
        </button>

        <button
          className="flex items-center bg-green-600 hover:bg-green-700 p-3 rounded-2xl flex-row-reverse gap-2 text-sm text-white transition"
          onClick={() => setOnSubmit(true)}
        >
          <Send size={16} />
          إرسال الإجابات
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 lg:h-[calc(102dvh-5rem)] lg:overflow-y-auto overflow-x-hidden">
        {/* Question Navigation */}
        <div className="mb-10 w-full max-w-4xl mx-auto bg-[#111827] border border-gray-800 rounded-3xl p-6 shadow-lg">
          {/* Timer */}
          <Timer timeDone={timeDone} setTimeDone={setTimeDone} />

          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-400">
              السؤال {currentQuestion} من {questionCount}
            </p>
            <p className="text-sm text-blue-400">
              {Object.keys(answers).length} / {questionCount} مجاب
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-gray-800 rounded-full mb-6 overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
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
                      text-sm font-semibold transition-all duration-200 border
                      ${
                        isCurrent
                          ? 'bg-blue-600 border-blue-400 scale-110 shadow-lg shadow-blue-500/30'
                          : isAnswered
                          ? 'bg-green-600 border-green-400 hover:scale-105'
                          : isVisited
                          ? 'bg-yellow-500 border-yellow-300 text-black hover:scale-105'
                          : 'bg-gray-800 border-gray-700 hover:bg-gray-700 hover:scale-105'
                      }
                    `}
                  >
                    {questionNumber}
                  </button>
                );
              })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-5 mt-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-600" />
              الحالي
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-600" />
              مجاب
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-yellow-500" />
              تمت زيارته
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-gray-800 border border-gray-700" />
              غير مفتوح
            </div>
          </div>
        </div>

        {data?.questions.map((question: ExamQuestion, index: number) => {
          if (index + 1 !== currentQuestion) return null;
          return (
            <div key={question.id} className="max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold mb-4 text-right">
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
                        // BUG FIX: Compare number to number, not number to string.
                        selectedOption === option.id
                          ? 'bg-blue-600 border-blue-400 shadow-lg shadow-blue-500/20'
                          : 'bg-[#111827] border-gray-700 hover:border-blue-500 hover:bg-[#172036]'
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
                      className="w-full flex justify-end text-right py-5 px-2 cursor-pointer text-base"
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
            ${currentQuestion === 1 ? 'opacity-0 pointer-events-none' : 'hover:bg-gray-700'}
            border border-gray-700 bg-[#111827] rounded-2xl px-5 py-3
            flex items-center gap-2 flex-row-reverse transition
          `}
          onClick={() => prevQuestion()}
          disabled={currentQuestion === 1}
        >
          السابق
          <ChevronLeft size={16} className="rotate-180" />
        </button>

        <button
          className={`
            ${currentQuestion === questionCount ? 'opacity-50 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
            text-white px-5 py-3 rounded-2xl flex items-center gap-2 flex-row-reverse transition
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
        confirmClassName="bg-red-500 hover:bg-red-600"
        onClose={() => setOpenOnExit(false)}
        onConfirm={() => setOnExit(true)}
      />

      <PopUp
        open={onSubmit}
        title="هل أنت متأكد أنك تريد تقديم الامتحان؟"
        description="تأكد من مراجعة إجاباتك قبل تقديم الامتحان."
        confirmText="تقديم الامتحان"
        confirmClassName="bg-green-600 hover:bg-green-700"
        onClose={() => setOnSubmit(false)}
        onConfirm={handleSubmitData}
      />
    </div>
  );
}

export default Page;