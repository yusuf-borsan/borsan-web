"use client";

import { useState } from "react";

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M8 5v14l11-7z" />
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

export function VideoCard({
  url,
  title = "Ürün Videosu",
  subtitle,
}: {
  url?: string;
  title?: string;
  subtitle?: string;
}) {
  const [open, setOpen] = useState(false);

  if (!url) {
    return (
      <div className="flex items-center gap-4 rounded-md border border-dashed border-ink-200 bg-ink-50/60 p-4 opacity-60">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-ink-100 text-ink-400">
          <PlayIcon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-medium text-ink-500">{title}</h3>
          <p className="text-xs text-ink-400">{subtitle ?? "Yakında eklenecek"}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-4 rounded-md border border-ink-100 bg-white p-4 shadow-sm transition-colors hover:border-brand-300"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-brand-600/10 text-brand-600">
          <PlayIcon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1 text-left">
          <h3 className="text-sm font-semibold text-ink-900">{title}</h3>
          <p className="text-xs text-ink-500">{subtitle ?? "İzlemek için tıklayın"}</p>
        </div>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/92 p-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div className="relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute -right-2 -top-12 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
              aria-label="Kapat"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
            <div className="aspect-video overflow-hidden rounded-lg bg-ink-950">
              <iframe
                src={url}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={title}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
