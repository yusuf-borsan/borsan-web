"use client";

import { useEffect, useRef } from "react";

/** px per millisecond */
const NORMAL_SPEED = 0.05; // ~50 px/s
const SLOW_SPEED = 0.009; // ~9 px/s — slow but still flowing
/** ms time-constant for easing speed toward its target (smaller = snappier) */
const EASE_TAU = 260;

export function ReferenceMarquee({
  items,
  placeholder,
}: {
  items: string[];
  placeholder: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const offset = useRef(0);
  const speed = useRef(NORMAL_SPEED);
  const target = useRef(NORMAL_SPEED);

  // Two copies make the loop seamless: we reset once we've scrolled one copy.
  const loop = [...items, ...items];

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let last = performance.now();

    const step = (now: number) => {
      const dt = Math.min(now - last, 64); // clamp after tab-switch stalls
      last = now;

      // Smoothly ease the current speed toward the target (no jumps).
      speed.current += (target.current - speed.current) * Math.min(1, dt / EASE_TAU);

      offset.current += speed.current * dt;
      const half = track.scrollWidth / 2;
      if (half > 0 && offset.current >= half) offset.current -= half;

      track.style.transform = `translate3d(${-offset.current}px, 0, 0)`;
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      className="relative mt-4 overflow-hidden py-6"
      onMouseEnter={() => {
        target.current = SLOW_SPEED;
      }}
      onMouseLeave={() => {
        target.current = NORMAL_SPEED;
      }}
    >
      {/* Soft fade at both edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent sm:w-28" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent sm:w-28" />

      <div ref={trackRef} className="flex w-max items-center" style={{ willChange: "transform" }}>
        {loop.map((name, i) => (
          <div key={i} className="flex items-center" title={placeholder}>
            <span className="whitespace-nowrap px-8 font-display text-lg tracking-[0.18em] text-ink-400 transition-colors hover:text-brand-600 sm:px-12 sm:text-xl">
              {name}
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-steel-400/50" aria-hidden />
          </div>
        ))}
      </div>
    </div>
  );
}
