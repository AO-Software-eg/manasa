'use client';

import { useEffect, useRef, useState } from 'react';
import { useIsFetching, useIsMutating } from '@tanstack/react-query';

export function HeaderProgressBar() {
  const fetching = useIsFetching();
  const mutating = useIsMutating();
  const loading = fetching + mutating > 0;

  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (loading) {
      // Cancel any pending hide from a previous run
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);

      setVisible(true);
      setProgress(8); // small initial jump so it feels instant

      // Ease toward ~90%, slowing down as it approaches the ceiling
      intervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev;
          const remaining = 90 - prev;
          const step = Math.max(remaining * 0.08, 0.5);
          return Math.min(prev + step, 90);
        });
      }, 200);
    } else {
      // Finish the bar, then fade out
      if (intervalRef.current) clearInterval(intervalRef.current);
      setProgress(100);

      hideTimeoutRef.current = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 400);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [loading]);

  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  return (
    <div className="pointer-events-none absolute bottom-0 left-0 w-full h-[3px] overflow-hidden">
      <div
        className="h-full rounded-r-full transition-all ease-out"
        style={{
          width: `${progress}%`,
          opacity: visible ? 1 : 0,
          transitionDuration: loading ? '250ms' : '400ms',
          background: 'linear-gradient(90deg, #a8863f 0%, #c4a95a 60%, #e0c778 100%)',
          boxShadow: visible ? '0 0 8px 1px rgba(196, 169, 90, 0.6)' : 'none',
        }}
      />
    </div>
  );
}