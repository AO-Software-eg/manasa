'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import BackButton from '@/app/components/BackBtn';
import { useCourseById } from '@/app/hooks/queries/useCourses';
import {
  useLectures,
  useLectureProgress,
} from '@/app/hooks/queries/useLectures';
import { useMe } from '@/app/hooks/queries/useMe';
import LoadingComp from '@/app/components/LoadingComp';
import NotAuthorized from '@/app/components/NotAuthorized';
import LectureAccordionItem from '@/app/components/LectureAccordionItem';
import { lecture } from '@/types';
import { useQueryClient } from '@tanstack/react-query';

export default function Page() {
  const params = useParams();
  const courseId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [openExamId, setOpenExamId] = useState<number | null>(null);

  const {
    data: course,
    isLoading: coursesLoading,
    isError: coursesError,
  } = useCourseById(courseId ?? '');

  const { data: userData } = useMe();
  const userId = Number(userData?.id);

  const {
    data: lectures = [],
    isLoading: lecturesLoading,
    isError: lecturesError,
    error,
    refetch,
  } = useLectures(courseId ?? '');

  const { data: progress } = useLectureProgress(userId, Number(courseId));
  const solvedExamCount = progress?.solvedExamCount ?? 0;

  const queryClient = useQueryClient();
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['progress', userId, Number(courseId)] });
  }, [courseId, userId, queryClient]);

  if (!courseId) return null;

  if (coursesLoading || lecturesLoading) return <LoadingComp />;

  const status = (error as { response?: { status?: number } } | null)?.response
    ?.status;
  if (status === 401 || status === 403) {
    return <NotAuthorized />;
  }

  if (coursesError || lecturesError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-foreground bg-background">
        <p className="text-destructive font-medium">
          حدث خطأ أثناء تحميل البيانات
        </p>
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
       لم يتم العثور على الكورس
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
            <BackButton />
            <h1 className="text-right text-3xl font-bold leading-tight text-primary md:text-4xl">
              {course.title}
            </h1>
          </div>
        </div>

        <div>
          <h2 className="mb-8 text-right text-xl font-bold text-foreground md:text-2xl">
            محتوى الكورس
          </h2>

          {lectures.length === 0 ? (
            <p className="py-10 text-center text-muted-foreground">
              لا توجد مواد متاحة
            </p>
          ) : (
            <div className="space-y-4 max-w-2xl">
              {lectures.map((lecture: lecture) => (
                <LectureAccordionItem
                  key={lecture.id}
                  lecture={lecture}
                  solvedExamCount={solvedExamCount}
                  openExamId={openExamId}
                  onOpenExam={setOpenExamId}
                  onCloseExam={() => setOpenExamId(null)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
