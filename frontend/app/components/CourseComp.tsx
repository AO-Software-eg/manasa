'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLectureProgress } from '@/app/hooks/queries/useLectures';
import { userData } from '@/types';

type Props = {
  id: number;
  index: number;
  title: string;
  description: string | null;
  price?: number;
  imageUrl: string;
  instructor?: string;
  discount?: number;
  userData?: userData;
  isPriority?: boolean;
  enrolledCourseIds?: Set<number>;
  isMyCoursesPage?: boolean;
};

export default function CourseComp({
  id,
  title,
  description,
  price,
  imageUrl,
  instructor,
  userData,
  isPriority = false,
  enrolledCourseIds,
  isMyCoursesPage = false,
}: Props) {
  const isPurchased = enrolledCourseIds?.has(Number(id));
  const isOwned = isPurchased || isMyCoursesPage;
  const shouldFetchProgress = !!userData && (isPurchased || isMyCoursesPage);

  const { data } = useLectureProgress(
    userData?.id,
    id,
    shouldFetchProgress,
  ) ;

  return (
    <Link
      href={
        userData ? `/home/courses/${id}` : `/login?redirect=/home/courses/${id}`
      }
    >
      <div
        className={`group relative rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer h-full flex flex-col
        ${
          isOwned
            ? 'bg-card border border-primary/30'
            : 'bg-card/45 border border-border/80 hover:bg-card/75 hover:border-border'
        }`}
      >
        {/* Purchased Badge */}
        {isOwned && (
          <div className="absolute top-3 left-3 z-20 bg-emerald-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
            تم الشراء
          </div>
        )}

        {/* Image */}
        <div className="relative w-full h-60 overflow-hidden">
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={isPriority}
            fetchPriority={isPriority ? 'high' : 'auto'}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Progress Badge */}
          {isOwned && (
            <div className="absolute top-3 right-3 z-20 bg-black/75 backdrop-blur-xs text-primary text-xs font-bold px-2.5 py-1 rounded-full">
              {data?.progressPercentage ?? 0}%
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col gap-3 flex-1">
          {/* Title */}
          <h3 className="text-xl font-bold text-foreground line-clamp-2">{title}</h3>

          {!userData ? (
            <>
              {/* Marketing Version */}
              <p className="text-sm text-muted-foreground line-clamp-2">
                {description}
              </p>

              <div className="flex flex-col gap-3 mt-auto">
                <div className="flex gap-2 items-center">
                  <span className="text-primary font-semibold text-lg">
                    {price} جنيه
                  </span>
                </div>

                <div className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all duration-300 shadow-md hover:shadow-lg text-center">
                  ابدأ الآن
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Dashboard Version */}
              <p className="text-sm text-muted-foreground">
                بواسطة{' '}
                <span className="text-primary">
                  {instructor || 'غير معروف'}
                </span>
              </p>

              <p className="text-sm text-muted-foreground line-clamp-2">
                {description}
              </p>

              <div className="flex items-center justify-between mt-auto pt-3">
                {isOwned ? (
                  <span className="text-primary font-semibold">
                    متابعة الدراسة
                  </span>
                ) : (
                  <>
                    <span className="text-primary font-semibold text-lg">
                      {price} جنيه
                    </span>

                    <span className="text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      عرض التفاصيل ←
                    </span>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
