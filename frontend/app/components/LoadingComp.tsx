"use client";
import { lazy, Suspense, useEffect, useState } from "react";
import spinnerAnimation from "@/public/Spinner.json";

const Lottie = lazy(() => import("lottie-react"));

function LoadingComp() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: "radial-gradient(ellipse at 60% 40%, #2a1f0e 0%, #111008 60%, #0a0905 100%)",
      }}
    >
      {/* Grain texture overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
          opacity: 0.6,
          pointerEvents: "none",
        }}
      />

      {/* Ambient glow orb */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          height: 500,
          background: "radial-gradient(circle, rgba(180,130,60,0.08) 0%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
          animation: "pulse 4s ease-in-out infinite",
        }}
      />

      {/* Decorative top rule */}
      <div
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "scaleX(1)" : "scaleX(0)",
          transition: "opacity 0.8s ease, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 40,
        }}
      >
        <div style={{ height: 1, width: 80, background: "linear-gradient(to right, transparent, #c9a84c)" }} />
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <rect x="6" y="0" width="2" height="14" rx="1" fill="#c9a84c" opacity="0.7" />
          <rect x="0" y="6" width="14" height="2" rx="1" fill="#c9a84c" opacity="0.7" />
          <rect x="3.5" y="3.5" width="7" height="7" rx="1" transform="rotate(45 7 7)" fill="none" stroke="#c9a84c" strokeWidth="1" opacity="0.4" />
        </svg>
        <div style={{ height: 1, width: 80, background: "linear-gradient(to left, transparent, #c9a84c)" }} />
      </div>

      {/* Main title */}
      <div
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.9s ease 0.15s, transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.15s",
          textAlign: "center",
          marginBottom: 8,
        }}
      >
        <p
          style={{
            fontFamily: "'Cinzel', 'Trajan Pro', serif",
            fontSize: 11,
            letterSpacing: "0.35em",
            color: "#c9a84c",
            textTransform: "uppercase",
            margin: 0,
            marginBottom: 12,
          }}
        >
          Est. Since Ancient Times
        </p>
        <h1
          style={{
            fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif",
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: 700,
            fontStyle: "italic",
            color: "#f0e6cc",
            margin: 0,
            lineHeight: 1.1,
            letterSpacing: "-0.01em",
            textShadow: "0 2px 40px rgba(201,168,76,0.2)",
          }}
        >
          السلطان للتاريخ
        </h1>
        <p
          style={{
            fontFamily: "'Cinzel', Georgia, serif",
            fontSize: "clamp(0.7rem, 1.5vw, 0.85rem)",
            letterSpacing: "0.25em",
            color: "#8a7455",
            textTransform: "uppercase",
            margin: "10px 0 0",
          }}
        >
          AlSultan for History
        </p>
      </div>

      {/* Spinner area */}
      <div
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(16px)",
          transition: "opacity 0.9s ease 0.3s, transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.3s",
          marginTop: 48,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
        }}
      >
        <Suspense
          fallback={
            <div style={{ width: 40, height: 40, border: "2px solid #c9a84c33", borderTop: "2px solid #c9a84c", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
          }
        >
          <Lottie
            animationData={spinnerAnimation}
            loop
            autoplay
            style={{ width: 80, height: 80, filter: "sepia(1) saturate(1.5) hue-rotate(5deg) brightness(1.1)" }}
          />
        </Suspense>

        {/* Loading dots */}
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 4,
                height: 4,
                borderRadius: "50%",
                background: "#c9a84c",
                animation: `dotBounce 1.4s ease-in-out ${i * 0.2}s infinite`,
                opacity: 0.7,
              }}
            />
          ))}
        </div>
      </div>

      {/* Bottom rule */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          opacity: visible ? 0.4 : 0,
          transition: "opacity 1s ease 0.5s",
          fontFamily: "Georgia, serif",
          fontSize: 11,
          letterSpacing: "0.2em",
          color: "#5a4a30",
          textTransform: "uppercase",
        }}
      >
        Unveiling the past
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Cinzel:wght@400;500&display=swap');

        @keyframes pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          50% { transform: translate(-50%, -50%) scale(1.15); opacity: 0.7; }
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