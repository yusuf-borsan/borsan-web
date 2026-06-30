"use client";

import { useEffect, useRef, type ReactNode } from "react";

const BLUE = "#1F4488";

/**
 * Solid filled gear icon — matches the classic settings/cog icon style:
 * thick teeth with flat tops, clean valleys, center hole with inner ring.
 */
function gearD(
  cx: number, cy: number,
  teeth: number, outerR: number, rootR: number,
  rotOffset = 0,
): string {
  const step = (Math.PI * 2) / teeth;
  const topH = step * 0.2;
  const baseH = step * 0.3;
  const d: string[] = [];
  const p = (a: number, r: number) =>
    `${(cx + Math.cos(a) * r).toFixed(2)},${(cy + Math.sin(a) * r).toFixed(2)}`;

  for (let i = 0; i < teeth; i++) {
    const a = step * i + rotOffset;
    if (i === 0) d.push(`M${p(a - baseH, rootR)}`);
    d.push(`L${p(a - topH, outerR)}`);
    d.push(`L${p(a + topH, outerR)}`);
    d.push(`L${p(a + baseH, rootR)}`);
    if (i < teeth - 1) {
      d.push(`L${p(a + step - baseH, rootR)}`);
    }
  }
  d.push("Z");
  return d.join("");
}

function GearIcon({ num, size = 72 }: { num: string; size?: number }) {
  const half = 50;
  const d = gearD(half, half, 10, 47, 36);

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      fill="none"
      aria-hidden
      className="shrink-0"
    >
      <g className="gear-main" style={{ transformOrigin: `${half}px ${half}px` }}>
        {/* Solid gear body */}
        <path d={d} fill={BLUE} />
        {/* Center cutout — white disc for number */}
        <circle cx={half} cy={half} r={19} fill="white" />
        {/* Thin accent ring */}
        <circle cx={half} cy={half} r={19} fill="none" stroke={BLUE} strokeWidth={1.5} opacity={0.2} />
      </g>
      {/* Number — large, centered, readable */}
      <text
        x={half} y={half + 8}
        textAnchor="middle"
        fontSize="24"
        fontWeight="800"
        fill={BLUE}
        style={{ fontFamily: "var(--font-display), system-ui" }}
      >{num}</text>
    </svg>
  );
}

function MechanicalRow({
  num, title, text, outputs, delay,
}: {
  num: string;
  title: string;
  text: string;
  outputs: ReactNode;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("is-visible");
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => el.classList.add("is-visible"), delay);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -5% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className="mechanical-row">
      {/* Desktop */}
      <div className="hidden items-stretch lg:flex">
        <div className="flex shrink-0 items-center">
          <GearIcon num={num} />
          <div className="h-[3px] w-3 rounded-r-sm" style={{ backgroundColor: BLUE, opacity: 0.35 }} aria-hidden />
        </div>

        <div className="mechanical-panel min-w-0 flex-1">
          <div
            className="flex h-full flex-col justify-center bg-white"
            style={{
              borderRadius: "0 8px 8px 0",
              boxShadow: "0 1px 6px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.04)",
              borderLeft: `3px solid ${BLUE}`,
            }}
          >
            <div className="panel-content flex items-start gap-8 px-7 py-5">
              <div className="min-w-0 flex-1">
                <h3
                  className="text-lg font-semibold leading-[1.15] tracking-[-0.01em]"
                  style={{ color: BLUE }}
                >
                  {title}
                </h3>
                <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-ink-500">{text}</p>
              </div>
              {outputs}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="lg:hidden">
        <div className="mechanical-panel">
          <div
            className="overflow-hidden bg-white"
            style={{
              borderRadius: 8,
              boxShadow: "0 1px 6px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.04)",
              borderLeft: `4px solid ${BLUE}`,
            }}
          >
            <div className="panel-content flex flex-col gap-4 p-5">
              <div className="flex items-center gap-3">
                <span className="text-xl font-semibold" style={{ color: BLUE }}>{num}</span>
                <h3
                  className="text-lg font-semibold leading-[1.15] tracking-[-0.01em]"
                  style={{ color: BLUE }}
                >
                  {title}
                </h3>
              </div>
              <p className="text-sm leading-relaxed text-ink-500">{text}</p>
              {outputs}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SolutionLevelsSection({
  packages,
}: {
  packages: { title: string; text: string; outputs: string[] }[];
}) {
  return (
    <div className="flex flex-col gap-5">
      {packages.map((pkg, i) => (
        <MechanicalRow
          key={pkg.title}
          num={`${i + 1}`}
          title={pkg.title}
          text={pkg.text}
          delay={i * 180}
          outputs={
            <ul className="flex shrink-0 flex-col gap-2 sm:w-52 lg:w-60">
              {pkg.outputs.map((out) => (
                <li key={out} className="flex items-center gap-2 text-[13px] text-ink-600">
                  <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0 text-brand-600" fill="none" aria-hidden>
                    <path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {out}
                </li>
              ))}
            </ul>
          }
        />
      ))}
    </div>
  );
}
