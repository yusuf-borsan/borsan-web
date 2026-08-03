"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

/** px per millisecond */
const NORMAL_SPEED = 0.045; // ~45 px/s — calm, readable
const SLOW_SPEED = 0.008;   // ~8 px/s — near-pause on hover
/** ms time-constant for easing speed toward its target */
const EASE_TAU = 260;

export type ReferenceItem = {
  name: string;
  /** Public path to logo image, or null for text-only display */
  logo: string | null;
};

export function ReferenceMarquee({ items }: { items: ReferenceItem[] }) {
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
      className="relative mt-4 overflow-hidden py-7"
      onMouseEnter={() => { target.current = SLOW_SPEED; }}
      onMouseLeave={() => { target.current = NORMAL_SPEED; }}
    >
      {/* Soft fade at both edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent sm:w-28" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent sm:w-28" />

      <div ref={trackRef} className="flex w-max items-center" style={{ willChange: "transform" }}>
        {loop.map((item, i) => (
          <div key={i} className="flex items-center">
            {/* Logo card — fixed 168×64 wrapper, logo only */}
            <div className="mx-6 flex h-[80px] w-[200px] flex-shrink-0 items-center justify-center opacity-60 transition-opacity duration-300 hover:opacity-100">
              {item.logo ? (
                <div className="relative h-full w-full">
                  <Image
                    src={item.logo}
                    alt={item.name}
                    fill
                    className="object-contain"
                    sizes="200px"
                  />
                </div>
              ) : (
                <span className="mb-3 text-center text-[14px] font-bold uppercase leading-tight tracking-[0.14em] text-ink-500">
                  {item.name}
                </span>
              )}
            </div>
            {/* Subtle vertical separator */}
            <span className="h-6 w-px flex-shrink-0 bg-ink-200/50" aria-hidden />
          </div>
        ))}
      </div>
    </div>
  );
}
