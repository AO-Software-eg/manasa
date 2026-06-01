'use client';
import Image from 'next/image';
import Link from 'next/link';

type Props = {
  id: string;
  index: number;
  title: string;
  description: string | null;
  price: number;
  imageUrl: string;
  instructor?: string;
  progress?: number;
  discount?: number; // %
  userData?: [];
  isPriority?: boolean;
};

export default function CourseComp({
  id,
  title,
  description,
  price,
  imageUrl,
  instructor,
  progress = 50,
  userData,
  isPriority = false,
}: Props) {
  return (
    <Link
      href={
        userData ? `/user/courses/${id}` : `/login?redirect=/user/courses/${id}`
      }
    >
      <div className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer h-full flex flex-col">
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
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col gap-3 flex-1">
          {/* Title */}
          <h3 className="text-xl font-bold text-white line-clamp-2">{title}</h3>

          {!userData ? (
            <>
              {/* MARKETING VERSION */}
              <p className="text-sm text-gray-400 line-clamp-2">
                {description}
              </p>

              <div className="flex flex-col gap-3 mt-auto">
                {/* Price */}
                <div className="flex gap-2 items-center">
                  <span className="text-[#e6d3a3] font-semibold text-lg">
                    {price} جنيه
                  </span>
                </div>
                <Link
                  href={`/login?redirect=/user/courses/${id}`}
                  className="w-full py-3 rounded-lg bg-[#e6d3a3] text-[#1C1C18] font-semibold 
        hover:bg-[#d4c38c] transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  ابدأ الآن
                </Link>
              </div>
            </>
          ) : (
            <>
              {/* DASHBOARD VERSION */}
              <p className="text-sm text-gray-400">
                بواسطة{' '}
                <span className="text-[#e6d3a3]">
                  {instructor || 'غير معروف'}
                </span>
              </p>

              <p className="text-sm text-gray-400 line-clamp-2">
                {description}
              </p>

              {/* Progress */}
              {progress > 0 && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>تقدمك</span>
                    <span>{progress}%</span>
                  </div>

                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#e6d3a3] transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between mt-auto pt-3">
                <span className="text-[#e6d3a3] font-semibold text-lg">
                  {price} جنيه
                </span>

                <span className="text-sm text-[#e6d3a3] opacity-0 group-hover:opacity-100 transition">
                  متابعة →
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
