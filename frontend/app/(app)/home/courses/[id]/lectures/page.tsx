'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import BackButton from '@/app/components/BackBtn';
import { lecture } from '@/types';
import { useCourseById } from '@/app/hooks/queries/useCourses';
import { useLectures } from '@/app/hooks/queries/useLectures';
import LoadingComp from '@/app/components/LoadingComp';
import PopUp from '@/app/components/PopUp';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Lock } from 'lucide-react';
import { useGetExamSubmissions } from '@/app/hooks/queries/useExams';
import { useMe } from '@/app/hooks/queries/useMe';
import { useState } from 'react';
import { useLectureProgress } from '@/app/hooks/queries/useLectures';

function NotAuthorized() {
  return (
    <section className="min-h-screen flex items-center justify-center">
      <div className="max-w-md text-center">
        <h1 className="text-9xl mb-4 flex justify-center items-center">
          <Lock />
        </h1>
        <h2 className="text-3xl font-bold text-[#e6d3a3]">
          هذا المحتوى غير متاح
        </h2>
        <p className="mt-4 text-zinc-400">
          يجب الاشتراك في الكورس أولاً للوصول إلى المحاضرات والاختبارات.
        </p>
        <Link
          href="/home"
          className="inline-block mt-6 rounded-lg bg-[#e6d3a3] px-5 py-2 text-black font-semibold"
        >
          تصفح الكورسات
        </Link>
      </div>
    </section>
  );
}

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const [openExamId, setOpenExamId] = useState<number | null>(null);

  const courseId = Array.isArray(params.id) ? params.id[0] : params.id;

  const {
    data: course,
    isLoading: coursesLoading,
    isError: coursesError,
  } = useCourseById(courseId ?? '');

  const { data: userData } = useMe();
  const userId = userData?.id ?? 0;

  const { data: submittedExams } = useGetExamSubmissions(userId);

  const solvedExamIds = new Set(
    submittedExams?.map((exam: any) => exam.examId),
  );

  const {
    data: assets = [],
    isLoading: assetsLoading,
    isError: assetsError,
    error,
    refetch,
  } = useLectures(courseId ?? '');

  const { data } = useLectureProgress(userData?.id, Number(courseId));

  if (!courseId) return null;

  if (coursesLoading || assetsLoading) return <LoadingComp />;

  const status = (error as any)?.response?.status;
  if (status === 401 || status === 403) {
    return <NotAuthorized />;
  }

  if (coursesError || assetsError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-red-500">حدث خطأ أثناء تحميل البيانات</p>
        <button
          onClick={() => refetch()}
          className="rounded bg-blue-500 px-4 py-2 text-white"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex min-h-screen items-center justify-center text-white">
        Course not found
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25 shadow-inner shadow-[#0D0D0D]/90"
        style={{
          backgroundImage: `url(${course.imageUrl ? course.imageUrl : '/default-course-image.jpg'})`,
        }}
      />

      <div className="absolute inset-0 bg-linear-to-t from-[#0D0D0D] via-55% via-[#0D0D0D]/90 to-transparent" />

      <div className="relative z-10 mx-auto mt-20 max-w-4xl">
        <div className="mb-12">
          <BackButton route="/" />
          <h1 className="text-right text-4xl font-bold leading-tight text-[#e6d3a3] md:text-5xl">
            {course.title}
          </h1>
        </div>

        <div>
          <h2 className="mb-8 text-right text-2xl font-bold text-[#E5E5E5] md:text-3xl">
            محتوى الكورس
          </h2>

          {assets.length === 0 ? (
            <p className="py-10 text-center text-gray-400">
              لا توجد مواد متاحة
            </p>
          ) : (
            assets.map((asset: lecture) => {
              const videos = asset.lectureVideos ?? [];
              const exams = asset.exams ?? [];

              return (
                <Accordion
                  key={asset.id}
                  type="single"
                  collapsible
                  className="max-w-lg rounded-md bg-[#38342B] mb-4"
                >
                  <AccordionItem value={`item-${asset.id}`}>
                    <AccordionTrigger className="gap-2 rounded-t rounded-b-none bg-[#141412] text-right">
                      <span className="px-4 text-xl font-semibold text-[#e6d3a3]">
                        {asset.title}
                      </span>
                    </AccordionTrigger>

                    <AccordionContent>
                      <div className="my-2 flex flex-col gap-3 p-3">
                        {videos.length + exams.length === 0 && (
                          <p className="py-10 text-center text-gray-400">
                            لا توجد مواد متاحة
                          </p>
                        )}

                        {videos.map((video) => (
                          <button
                            key={video.id}
                            onClick={() =>
                              router.push(
                                `/home/courses/${courseId}/lectures/${asset.id}/videos/${video.id}`,
                              )
                            }
                            className="flex items-center justify-between rounded-xl border border-zinc-700 bg-zinc-900/60 p-4 transition-all hover:border-blue-500 hover:bg-zinc-800"
                          >
                            <div className="flex items-center gap-3">
                              <span className="font-medium text-zinc-100">
                                {video.title}
                              </span>
                            </div>
                            <span className="text-sm text-zinc-400">
                              مشاهدة
                            </span>
                          </button>
                        ))}

                        {exams.map((exam, index) => {
                          const solvedExamCount = data?.solvedExamCount ?? 0;

                          const isSolved = index < solvedExamCount;

                          const isCurrentExam = index === solvedExamCount;

                          const isLocked = index > solvedExamCount;

                          const disabled = isSolved || isLocked;

                          return (
                            <div
                              key={exam.id}
                              className="w-full flex items-center justify-between"
                            >
                              <button
                                disabled={disabled}
                                onClick={() => {
                                  if (isCurrentExam) {
                                    setOpenExamId(exam.id);
                                  }
                                }}
                                className={`
          flex items-center justify-between
          w-full rounded-xl border
          p-4 transition-all

          ${
            isLocked
              ? 'border-zinc-800 bg-zinc-900/40'
              : 'border-zinc-700 bg-zinc-900/60 hover:border-emerald-500 hover:bg-zinc-800'
          }

          disabled:opacity-50
        `}
                              >
                                <div className="flex items-center gap-3">
                                  <span className="font-medium text-zinc-100">
                                    {exam.title}
                                  </span>
                                </div>

                                <span className="text-sm text-zinc-400">
                                  {isSolved
                                    ? 'تم الحل'
                                    : isLocked
                                      ? 'مغلق'
                                      : 'اختبار'}
                                </span>
                              </button>

                              {isCurrentExam && (
                                <PopUp
                                  open={openExamId === exam.id}
                                  title="هل انت متأكد من بدأ الأمتحان ؟"
                                  description="تنبيه هام جدا جدا جدا&#10;خلي بالك الامتحان مدته : 45 دقيقة&#10;مينفعش تخرج من الاختبار قبل ما تكون خلصت الاختبار ..."
                                  confirmText="بدء الأمتحان"
                                  confirmClassName="bg-green-500 hover:bg-green-600"
                                  onClose={() => setOpenExamId(null)}
                                  pending={false}
                                  onConfirm={() =>
                                    router.push(
                                      `/home/courses/${courseId}/lectures/${asset.id}/exams/${exam.id}`,
                                    )
                                  }
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
