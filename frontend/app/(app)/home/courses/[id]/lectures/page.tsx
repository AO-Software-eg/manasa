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
    <section className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="max-w-md text-center px-4">
        <h1 className="text-6xl mb-4 flex justify-center items-center text-primary">
          <Lock className="h-16 w-16" />
        </h1>
        <h2 className="text-3xl font-bold text-primary">
          هذا المحتوى غير متاح
        </h2>
        <p className="mt-4 text-muted-foreground">
          يجب الاشتراك في الكورس أولاً للوصول إلى المحاضرات والاختبارات.
        </p>
        <Link
          href="/home"
          className="inline-block mt-6 rounded-lg bg-primary px-5 py-2 text-primary-foreground font-semibold hover:bg-primary/90 transition-colors shadow-sm"
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
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-foreground bg-background">
        <p className="text-destructive font-medium">حدث خطأ أثناء تحميل البيانات</p>
        <button
          onClick={() => refetch()}
          className="rounded bg-primary px-5 py-2 text-primary-foreground font-semibold hover:bg-primary/90 transition-colors cursor-pointer"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex min-h-screen items-center justify-center text-foreground bg-background">
        Course not found
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden text-foreground bg-background">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10 dark:opacity-25 shadow-inner"
        style={{
          backgroundImage: `url(${course.imageUrl ? course.imageUrl : '/default-course-image.jpg'})`,
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-background via-50% via-background/90 to-transparent" />

      <div className="relative z-10 mx-auto mt-28 max-w-4xl px-4">
        <div className="mb-12 flex flex-col md:flex-row-reverse justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4 flex-row-reverse w-full md:w-auto justify-between">
            <BackButton route="/" />
            <h1 className="text-right text-3xl font-bold leading-tight text-primary md:text-4xl">
              {course.title}
            </h1>
          </div>
        </div>

        <div>
          <h2 className="mb-8 text-right text-xl font-bold text-foreground md:text-2xl">
            محتوى الكورس
          </h2>

          {assets.length === 0 ? (
            <p className="py-10 text-center text-muted-foreground">
              لا توجد مواد متاحة
            </p>
          ) : (
            <div className="space-y-4 max-w-2xl">
              {assets.map((asset: lecture) => {
                const videos = asset.lectureVideos ?? [];
                const exams = asset.exams ?? [];

                return (
                  <Accordion
                    key={asset.id}
                    type="single"
                    collapsible
                    className="w-full rounded-2xl bg-card border border-border shadow-xs overflow-hidden transition-all duration-300"
                  >
                    <AccordionItem value={`item-${asset.id}`} className="border-none">
                      <AccordionTrigger className="gap-2 rounded-t rounded-b-none bg-secondary/30 text-right px-6 py-4 hover:no-underline">
                        <span className="text-lg font-bold text-primary">
                          {asset.title}
                        </span>
                      </AccordionTrigger>

                      <AccordionContent className="bg-card">
                        <div className="my-2 flex flex-col gap-3 p-4">
                          {videos.length + exams.length === 0 && (
                            <p className="py-10 text-center text-muted-foreground">
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
                              className="flex items-center justify-between rounded-xl border border-border bg-secondary/20 p-4 transition-all hover:border-primary/50 hover:bg-secondary/40 text-right cursor-pointer"
                            >
                              <div className="flex items-center gap-3">
                                <span className="font-semibold text-foreground">
                                  {video.title}
                                </span>
                              </div>
                              <span className="text-sm text-primary font-medium">
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
                                className="w-full flex flex-col"
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
                                    w-full rounded-xl border p-4 transition-all text-right
                                    ${
                                      isLocked
                                        ? 'border-border/60 bg-muted/20 opacity-60 cursor-not-allowed'
                                        : 'border-border bg-secondary/20 hover:border-primary/50 hover:bg-secondary/40 cursor-pointer'
                                    }
                                    disabled:opacity-50
                                  `}
                                >
                                  <div className="flex items-center gap-3">
                                    <span className="font-semibold text-foreground">
                                      {exam.title}
                                    </span>
                                  </div>

                                  <span className="text-sm text-muted-foreground font-medium">
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
                                    confirmClassName="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg"
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
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
