'use client';
import { Award, BookOpen, TrendingUp } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type JourneyStats = {
  certificatesCount: number;
  certificatesChange: string;
  coursesCount: number;
  progressPercent: number; // 0-100
};

function toArabicDigits(input: number | string) {
  const map = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return String(input).replace(/[0-9]/g, (d) => map[+d]);
}

export default function LearningJourney({
  certificatesCount,
  certificatesChange,
  coursesCount,
  progressPercent,
}: JourneyStats) {
  const [ready, setReady] = useState(false);
  const ringRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    // trigger the draw-in animation once mounted
    const t = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(t);
  }, []);

  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progressPercent / 100) * circumference;

  const stations = [
    {
      id: 'certificates',
      label: 'الشهادات المكتسبة',
      caption: certificatesChange,
      icon: Award,
      value: toArabicDigits(certificatesCount),
    },
    {
      id: 'courses',
      label: 'الكورسات المسجلة',
      caption: 'نشاطك',
      icon: BookOpen,
      value: toArabicDigits(coursesCount),
    },
  ];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-bl from-card to-secondary/30 p-6 md:p-8">
      <style>{`
        @keyframes journey-draw {
          from { stroke-dashoffset: var(--dash-len); }
          to { stroke-dashoffset: 0; }
        }
        @keyframes ring-fill {
          from { stroke-dashoffset: ${circumference}; }
          to { stroke-dashoffset: ${offset}; }
        }
        .journey-line {
          stroke-dasharray: var(--dash-len);
          animation: journey-draw 1.1s ease-out forwards;
        }
        .journey-ring {
          stroke-dasharray: ${circumference};
          animation: ring-fill 1s 0.3s cubic-bezier(.4,0,.2,1) forwards;
          stroke-dashoffset: ${circumference};
        }
      `}</style>

      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1">رحلتك التعليمية</p>
          <h2 className="text-lg font-semibold">من أين بدأت، إلى أين وصلت</h2>
        </div>
      </div>

      {/* Desktop path */}
      <div className="relative hidden md:block" style={{ height: 180 }}>
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 30"
          preserveAspectRatio="none"
        >
          <path
            d="M 16.67 15 Q 33 3, 50 15 T 83.33 15"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            strokeLinecap="round"
            className="text-muted-foreground/30"
          />
          {ready && (
            <path
              d="M 16.67 15 Q 33 3, 50 15 T 83.33 15"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              strokeLinecap="round"
              className="text-primary journey-line"
              style={{ ['--dash-len' as string]: 90 }}
            />
          )}
        </svg>

        <div className="relative grid grid-cols-3 h-full items-center">
          {stations.map((s) => (
            <div key={s.id} className="flex flex-col items-center gap-2 text-center">
              <div className="w-16 h-16 rounded-2xl bg-card border border-border shadow-sm flex items-center justify-center">
                <s.icon className="w-6 h-6 text-primary" />
              </div>
              <span className="text-2xl font-bold">{s.value}</span>
              <span className="text-xs text-muted-foreground">{s.label}</span>
              <span className="text-[11px] text-primary">{s.caption}</span>
            </div>
          ))}

          {/* "You are here" — progress ring station */}
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="relative w-20 h-20">
              <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r={radius}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="6"
                  className="text-secondary"
                />
                <circle
                  cx="40"
                  cy="40"
                  r={radius}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="6"
                  strokeLinecap="round"
                  className="text-primary journey-ring"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
            </div>
            <span className="text-2xl font-bold">{toArabicDigits(progressPercent)}٪</span>
            <span className="text-xs text-muted-foreground">نسبة التقدم</span>
            <span className="text-[11px] font-medium text-primary">أنت هنا</span>
          </div>
        </div>
      </div>

      {/* Mobile fallback: simple stacked stations with a side connector */}
      <div className="md:hidden divide-y divide-border/60">
        {[...stations, {
          id: 'progress',
          label: 'نسبة التقدم',
          caption: 'أنت هنا',
          icon: TrendingUp,
          value: `${toArabicDigits(progressPercent)}٪`,
        }].map((s) => (
          <div key={s.id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-card border border-border flex items-center justify-center">
                <s.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{s.label}</p>
                <p className="text-xs text-primary">{s.caption}</p>
              </div>
            </div>
            <span className="text-xl font-bold">{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}