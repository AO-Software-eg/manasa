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
    <div className="bg-secondary/40 rounded-2xl p-4 flex flex-col gap-3 border border-border">
      <h3 className="text-sm font-semibold text-primary flex items-center gap-2">
        تحليل الأداء الذكي
      </h3>

      <p className="text-sm text-muted-foreground">
        أداؤك في تحسن مستمر ، لكن يمكنك تحقيق نتائج أفضل بالتركيز على النقاط
        الأضعف.
      </p>

      <div className="text-sm flex flex-col gap-2">
        <p className='text-foreground'>
          <span className="text-primary">أضعف أسبوع:</span> {weakest.week}
        </p>
        <p className='text-foreground'>
          <span className="text-primary">التقدير:</span> {weakest.grade}%
        </p>
        <p className='text-foreground'>
          <span className="text-primary">نصيحة:</span> راجع الدرس المرتبط
          بهذا الأسبوع + حل تمارين إضافية
        </p>
      </div>

      {/* CTA */}
      <button className="mt-2 bg-primary hover:bg-primary/90 text-primary-foreground py-2 rounded-xl text-sm font-semibold transition cursor-pointer shadow-sm">
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
    <div className="bg-card rounded-3xl lg:col-span-2 p-5 flex flex-col gap-6 w-full shadow-md border border-border">
      {/* Title */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        <TrendingUp className="text-primary" size={20} />
      </div>
      {/* Chart */}
      <div className="w-full h-48 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="week" stroke="var(--muted-foreground)" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="grade"
              stroke="var(--primary)"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {/* Divider */}
      <div className="w-full h-px bg-border" />

      {/* AI Insights */}
      <AIInsights />
    </div>
  );
}

export default RecentActivityCard;
