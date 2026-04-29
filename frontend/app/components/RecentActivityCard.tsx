'use client';
import { ResponsiveContainer, LineChart, Line, XAxis, Tooltip } from 'recharts';
import { TrendingUp } from 'lucide-react';

const data = [
  { week: '1', grade: 60 },
  { week: '2', grade: 72 },
  { week: '3', grade: 68 },
  { week: '4', grade: 80 },
  { week: '5', grade: 90 },
  { week: '6', grade: 85 },
];

// Analyze weakest point (simple logic)
const weakest = data.reduce((min, curr) =>
  curr.grade < min.grade ? curr : min,
);

function AIInsights() {
  return (
    <div className="bg-[#222] rounded-2xl p-4 flex flex-col gap-3 border border-[#333]">
      <h3 className="text-sm font-semibold text-[#e6d3a3] flex items-center gap-2">
         تحليل الأداء الذكي
      </h3>

      <p className="text-sm text-gray-300">
        أداؤك في تحسن مستمر ، لكن يمكنك تحقيق نتائج أفضل بالتركيز على النقاط
        الأضعف.
      </p>

      <div className="text-sm flex flex-col gap-2">
        <p className='text-white'>
           <span className="text-[#e6d3a3]">أضعف أسبوع:</span> {weakest.week}
        </p>
        <p className='text-white'>
           <span className="text-[#e6d3a3]">التقدير:</span> {weakest.grade}%
        </p>
        <p className='text-white'>
           <span className="text-[#e6d3a3]">نصيحة:</span> راجع الدرس المرتبط
          بهذا الأسبوع + حل تمارين إضافية
        </p>
      </div>

      {/* CTA */}
      <button className="mt-2 bg-[#e6d3a3] hover:bg-[#d4c38c] text-[#1C1C18] py-2 rounded-xl text-sm font-semibold transition">
        كمل أضعف درس
      </button>
    </div>
  );
}

type Props = {
  title: string;
};

function RecentActivityCard({ title }: Props) {
  return (
    <div className="bg-[#1a1a1a] rounded-3xl lg:col-span-2 p-5 flex flex-col gap-6 w-full shadow-md border border-[#2a2a2a]">
      {/* Title */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        <TrendingUp className="text-[#e6d3a3]" size={20} />
      </div>

      {/* Chart */}
      <div className="w-full h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="week" stroke="#888" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="grade"
              stroke="#e6d3a3"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-[#2a2a2a]" />

      {/* AI Insights */}
      <AIInsights />
    </div>
  );
}

export default RecentActivityCard;
