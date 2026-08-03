"use client";

import { useState } from "react";
import { Container } from "@/components/ui";

interface ServiceItem {
  title: string;
  summary: string;
  text: string;
}

const ICONS = [
  /* 0 — Kurulum ve Devreye Alma */
  <svg key="0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="h-5 w-5">
    <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
  </svg>,
  /* 1 — Periyodik Bakım */
  <svg key="1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="h-5 w-5">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <path d="M9 16l2 2 4-4" />
  </svg>,
  /* 2 — Yedek Parça Tedariği */
  <svg key="2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="h-5 w-5">
    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>,
  /* 3 — Operatör Eğitimi */
  <svg key="3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="h-5 w-5">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <polyline points="17 11 19 13 23 9" />
  </svg>,
  /* 4 — Arıza Müdahalesi */
  <svg key="4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="h-5 w-5">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>,
  /* 5 — Uzaktan Destek */
  <svg key="5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="h-5 w-5">
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
    <path d="M6 11.5l2 2 4-4" />
  </svg>,
];

export function ServiceModules({ items }: { items: ServiceItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <Container className="py-10 lg:py-14">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {items.map((item, i) => {
          const open = openIndex === i;

          return (
            <div
              key={item.title}
              role="button"
              tabIndex={0}
              aria-expanded={open}
              aria-label={item.title}
              className="relative h-[268px] cursor-pointer overflow-hidden rounded-2xl bg-[#0d0f14] ring-1 ring-white/10 outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              onMouseEnter={() => setOpenIndex(i)}
              onMouseLeave={() => setOpenIndex(null)}
              onClick={() => setOpenIndex(open ? null : i)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setOpenIndex(open ? null : i);
                }
              }}
            >
              {/* Back layer: white detail view */}
              <div className="absolute inset-0 flex flex-col bg-white p-6">
                <div className="mb-3 flex items-center gap-2.5">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-brand-600/10 text-brand-600">
                    {ICONS[i]}
                  </div>
                  <h3 className="text-[0.875rem] font-bold leading-snug text-ink-900">
                    {item.title}
                  </h3>
                </div>
                <p className="flex-1 overflow-y-auto pr-1 text-[12.5px] leading-[1.78] text-ink-600">
                  {item.text}
                </p>
              </div>

              {/* Dark cover: slides right on hover/click */}
              <div
                aria-hidden="true"
                className="absolute inset-0 flex flex-col px-6 pb-6 pt-8"
                style={{
                  background: "#0d0f14",
                  transform: open ? "translateX(100%)" : "translateX(0%)",
                  transition: open
                    ? "transform 0.65s cubic-bezier(0.4, 0, 0.2, 1)"
                    : "transform 0.45s cubic-bezier(0.4, 0, 1, 1)",
                }}
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-white">
                  {ICONS[i]}
                </div>
                <h3 className="text-[0.9375rem] font-bold leading-snug text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed" style={{ color: "rgba(148,185,234,0.75)" }}>
                  {item.summary}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Container>
  );
}
