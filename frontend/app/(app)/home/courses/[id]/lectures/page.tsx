'use client';
import { useParams, useRouter } from 'next/navigation';
import { courses } from '@/types';
import BackButton from '@/app/components/BackBtn';
import { lecture } from '@/types';
import { useCourses } from '@/app/hooks/queries/useCourses';
import { useLectures } from '@/app/hooks/queries/useLectures';
import LoadingComp from '@/app/components/LoadingComp';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function CoursePage() {
  const params = useParams();
  const router = useRouter();
  const courseId = Array.isArray(params.id) ? params.id[0] : params.id;

  const {
    data: courses,
    isLoading: coursesLoading,
    isError: coursesError,
  } = useCourses();
  const {
    data: assets = [],
    isLoading: assetsLoading,
    isError: assetsError,
    refetch,
  } = useLectures(courseId ?? '');

  if (!courseId) return null;

  if (coursesLoading || assetsLoading) return <LoadingComp />;

  if (coursesError || assetsError)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-red-500">حدث خطأ أثناء تحميل البيانات</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          إعادة المحاولة
        </button>
      </div>
    );

  const course = courses?.find((c: courses) => c.id === courseId);
  if (!course) return null;

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25 shadow-inner shadow-[#0D0D0D]/90 "
        style={{
          backgroundImage: `url(${course.image_url})`,
        }}
      />

      <div className="absolute inset-0 bg-linear-to-t from-[#0D0D0D] via-55% via-[#0D0D0D]/90 to-transparent" />
      <div className="max-w-4xl mx-auto mt-20 z-100 relative">
        <div className="mb-12">
          <BackButton route="/" />
          <h1 className="text-4xl md:text-5xl font-bold text-[#e6d3a3] text-right leading-tight">
            {course.title}
          </h1>
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#E5E5E5] text-right mb-8">
            محتوى الكورس
          </h2>
          <div>
            {assets.length === 0 ? (
              <p className="text-gray-400 text-center py-10">
                لا توجد مواد متاحة
              </p>
            ) : (
              assets.map((asset: lecture) => (
                <div key={asset.id} className="flex flex-col gap-3">
                  <Accordion
                    type="single"
                    collapsible
                    className="max-w-lg bg-[#38342B] rounded-md"
                  >
                    <AccordionItem value={`item-${asset.id}`}>
                      <AccordionTrigger className="text-right   gap-2 bg-[#141412] rounded-t rounded-b-none">
                        <span className="text-xl font-semibold px-4 text-[#e6d3a3]">
                          {asset.title}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="flex flex-col gap-3 p-3 my-2">
                          {asset.videos.length + asset.exams.length === 0 && (
                            <p className="text-gray-400 text-center py-10">
                              لا توجد مواد متاحة
                            </p>
                          )}
                          {asset.videos.map((video) => (
                            <button
                              key={video.video_id}
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

                          {asset.exams.map((exam) => (
                            <button
                              key={exam.id}
                              onClick={() =>
                                router.push(
                                  `/home/courses/${courseId}/lectures/${asset.id}/exams/${exam.id}`,
                                )
                              }
                              className="flex items-center justify-between rounded-xl border border-zinc-700 bg-zinc-900/60 p-4 transition-all hover:border-emerald-500 hover:bg-zinc-800"
                            >
                              <div className="flex items-center gap-3">
                                <span className="font-medium text-zinc-100">
                                  {exam.title}
                                </span>
                              </div>

                              <span className="text-sm text-zinc-400">
                                اختبار
                              </span>
                            </button>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
