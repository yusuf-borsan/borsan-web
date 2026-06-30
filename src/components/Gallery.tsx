"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

/* Inline SVGs — avoids touching icons.tsx */
function ZoomIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.35-4.35M11 8v6M8 11h6" />
    </svg>
  );
}
function ChevLeft({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}
function ChevRight({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
function CloseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

export function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const unique = images.length ? images : ["/machines/cnc-torna.svg"];
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const total = unique.length;

  const prev = useCallback(() => setActive((i) => (i - 1 + total) % total), [total]);
  const next = useCallback(() => setActive((i) => (i + 1) % total), [total]);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, prev, next]);

  return (
    <>
      <div className="flex flex-col gap-3">
        {/* Main image */}
        <div
          className="group relative aspect-[4/3] cursor-zoom-in overflow-hidden rounded-md border border-ink-100 bg-white"
          onClick={() => setLightbox(true)}
        >
          <Image
            src={unique[active]}
            alt={alt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-contain transition-transform duration-300 group-hover:scale-[1.02]"
          />

          {/* Zoom icon */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <div className="rounded-full bg-brand-600/80 p-3 shadow-lg backdrop-blur-sm">
              <ZoomIcon className="h-5 w-5 text-white" />
            </div>
          </div>

          {/* Prev/Next arrows */}
          {total > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-brand-600 text-white shadow-md opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-brand-700"
                aria-label="Önceki görsel"
              >
                <ChevLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-brand-600 text-white shadow-md opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-brand-700"
                aria-label="Sonraki görsel"
              >
                <ChevRight className="h-4 w-4" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {total > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {unique.map((src, i) => (
              <button
                key={src + i}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`${alt} görsel ${i + 1}`}
                aria-current={i === active}
                className={`relative aspect-[4/3] overflow-hidden rounded-sm border-2 bg-white transition-all duration-150 ${
                  i === active
                    ? "border-brand-600 shadow-sm"
                    : "border-ink-100 hover:border-brand-300"
                }`}
              >
                <Image src={src} alt="" fill sizes="15vw" className="object-contain" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/92 p-4 backdrop-blur-sm"
          onClick={() => setLightbox(false)}
        >
          <div
            className="relative w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              type="button"
              onClick={() => setLightbox(false)}
              className="absolute -right-2 -top-12 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
              aria-label="Kapat"
            >
              <CloseIcon className="h-5 w-5" />
            </button>

            {/* Image */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-white">
              <Image
                src={unique[active]}
                alt={alt}
                fill
                sizes="90vw"
                className="object-contain"
                priority
              />
            </div>

            {/* Lightbox arrows */}
            {total > 1 && (
              <>
                <button
                  type="button"
                  onClick={prev}
                  className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-brand-600 text-white shadow-xl transition-colors hover:bg-brand-700"
                  aria-label="Önceki"
                >
                  <ChevLeft className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={next}
                  className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-brand-600 text-white shadow-xl transition-colors hover:bg-brand-700"
                  aria-label="Sonraki"
                >
                  <ChevRight className="h-6 w-6" />
                </button>
              </>
            )}

            {/* Counter */}
            {total > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-ink-950/60 px-3 py-1 text-xs tabular-nums text-white">
                {active + 1} / {total}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
