'use client';

import Image from 'next/image';
import Link from 'next/link';

type Props = {
  id: string;
  index: number;
  title: string;
  description: string | null;
  price?: number;
  imageUrl: string;
  instructor?: string;
  progress?: number;
  discount?: number;
  userData?: unknown;
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
  progress = 0,
  userData,
  isPriority = false,
  enrolledCourseIds,
  isMyCoursesPage = false,
}: Props) {
  const isPurchased = enrolledCourseIds?.has(Number(id));




  const isOwned = isPurchased || isMyCoursesPage;


  console.log({
    title,
    isOwned,
    progress,
  });
  return (
    <Link
      href={
        userData
          ? `/home/courses/${id}`
          : `/login?redirect=/home/courses/${id}`
      }
    >
      <div
        className={`group relative rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer h-full flex flex-col
        ${isOwned
            ? 'bg-[#1b1b17] border border-[#e6d3a3]/30'
            : 'bg-white/5 border border-white/10 hover:bg-white/10'
          }`}
      >
        {/* Purchased Badge */}
        {isOwned && (
          <div className="absolute top-3 left-3 z-20 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
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
          {isOwned && progress >= 0 && (
            <div className="absolute top-3 right-3 z-20 bg-black/70 backdrop-blur-sm text-[#e6d3a3] text-xs font-bold px-2.5 py-1 rounded-full">
              {progress}%
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col gap-3 flex-1">
          {/* Title */}
          <h3 className="text-xl font-bold text-white line-clamp-2">
            {title}
          </h3>

          {!userData ? (
            <>
              {/* Marketing Version */}
              <p className="text-sm text-gray-400 line-clamp-2">
                {description}
              </p>

              <div className="flex flex-col gap-3 mt-auto">
                <div className="flex gap-2 items-center">
                  <span className="text-[#e6d3a3] font-semibold text-lg">
                    {price} جنيه
                  </span>
                </div>

                <div className="w-full py-3 rounded-lg bg-[#e6d3a3] text-[#1C1C18] font-semibold hover:bg-[#d4c38c] transition-all duration-300 shadow-md hover:shadow-lg text-center">
                  ابدأ الآن
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Dashboard Version */}
              <p className="text-sm text-gray-400">
                بواسطة{' '}
                <span className="text-[#e6d3a3]">
                  {instructor || 'غير معروف'}
                </span>
              </p>

              <p className="text-sm text-gray-400 line-clamp-2">
                {description}
              </p>


              <div className="flex items-center justify-between mt-auto pt-3">
                {isOwned ? (
                  <span className="text-[#e6d3a3] font-semibold">
                    متابعة الدراسة
                  </span>
                ) : (
                  <>
                    <span className="text-[#e6d3a3] font-semibold text-lg">
                      {price} جنيه
                    </span>

                    <span className="text-sm text-[#e6d3a3] opacity-0 group-hover:opacity-100 transition">
                      عرض التفاصيل →
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