import React from "react";

type ActivityItem = {
  id: number;
  text: string;
  time: string;
};

type Props = {
  title: string;
  items: ActivityItem[];
  onViewAll?: () => void;
};

function RecentActivityCard({ title, items, onViewAll }: Props) {
  return (
    <div className="bg-[#1a1a1a] rounded-3xl lg:col-span-2 p-5 flex flex-col gap-5 w-full shadow-md border border-[#2a2a2a]">

      {/* Title */}
      <h2 className="text-lg font-semibold text-right">
        {title}
      </h2>

      {/* Activity list */}
      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between">

            {/* Dot */}
            <div className="w-2.5 h-2.5 rounded-full bg-[#e6d3a3]" />

            {/* Text */}
            <div className="flex-1 text-right px-3">
              <p className="text-sm">{item.text}</p>
              <span className="text-xs text-gray-400">
                {item.time}
              </span>
            </div>

          </div>
        ))}
      </div>

      {/* Button */}
      <button
        onClick={onViewAll}
        className="mt-2 bg-[#2a2a2a] hover:bg-[#333] transition rounded-full py-2 text-sm text-[#e6d3a3]"
      >
        عرض سجل النشاط الكامل
      </button>
    </div>
  );
}

export default RecentActivityCard;