'use client';

import { useEffect, useState } from 'react';

function LoadingComp() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-background text-foreground transition-colors duration-300"
      style={{
        backgroundImage: 'radial-gradient(circle at center, var(--secondary) 0%, var(--background) 100%)',
      }}
    >
      {/* Ambient glow orb */}
      <div
        className="absolute top-[30%] left-1/2 -translate-x-1/2 w-96 h-96 rounded-full opacity-30 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)',
          animation: 'pulse 4s ease-in-out infinite',
        }}
      />

      {/* Decorative top rule */}
      <div
        className="flex items-center gap-3 mb-8 transition-all duration-700"
        style={{
          opacity: visible ? 0.8 : 0,
          transform: visible ? 'scaleX(1)' : 'scaleX(0.7)',
        }}
      >
        <div className="h-[1px] w-20" style={{ background: 'linear-gradient(to right, transparent, var(--primary))' }} />
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <rect x="6" y="0" width="2" height="14" rx="1" fill="var(--primary)" opacity="0.8" />
          <rect x="0" y="6" width="14" height="2" rx="1" fill="var(--primary)" opacity="0.8" />
          <rect x="3.5" y="3.5" width="7" height="7" rx="1" transform="rotate(45 7 7)" fill="none" stroke="var(--primary)" strokeWidth="1" opacity="0.5" />
        </svg>
        <div className="h-[1px] w-20" style={{ background: 'linear-gradient(to left, transparent, var(--primary))' }} />
      </div>

      {/* Main title */}
      <div
        className="text-center mb-10 transition-all duration-700 delay-75"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(15px)',
        }}
      >
        <p className="text-[10px] tracking-[0.3em] text-primary uppercase font-medium mb-3">
          Est. Since Ancient Times
        </p>
        <h1 className="text-3xl md:text-5xl font-bold font-sans tracking-tight text-foreground leading-tight">
          السلطان للتاريخ
        </h1>
        <p className="text-[10px] md:text-xs tracking-[0.2em] text-muted-foreground uppercase mt-2">
          AlSultan for History
        </p>
      </div>

      {/* Spinner area */}
      <div
        className="flex flex-col items-center gap-5 transition-all duration-700 delay-150"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(15px)',
        }}
      >
        {/* Modern clean CSS loader */}
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
          <div 
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary" 
            style={{ animation: 'spin 0.8s linear infinite' }}
          />
        </div>

        {/* Loading dots */}
        <div className="flex gap-2 items-center">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-primary opacity-70"
              style={{
                animation: `dotBounce 1.4s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Bottom rule */}
      <div
        className="absolute bottom-10 transition-all duration-1000 delay-300 text-[10px] tracking-[0.2em] text-muted-foreground/60 uppercase font-sans"
        style={{
          opacity: visible ? 0.7 : 0,
        }}
      >
        Unveiling the past
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.15); opacity: 0.15; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes dotBounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.3; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default LoadingComp;