"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, localeShort, type Locale } from "@/i18n/config";

/* Inline flag SVGs — no emoji, same approach as phone country-code dropdown */
function LocaleFlagIcon({ locale }: { locale: Locale }) {
  const isTR = locale === "tr";
  return (
    <span
      className="inline-flex shrink-0 overflow-hidden rounded-[2px]"
      style={{ width: 18, height: 13 }}
    >
      {isTR ? (
        <svg viewBox="0 0 20 14" width={18} height={13} aria-hidden>
          <rect width={20} height={14} fill="#E30A17"/>
          <circle cx="7.5" cy="7" r="3.2" fill="white"/>
          <circle cx="8.8" cy="7" r="2.6" fill="#E30A17"/>
          <polygon points="12.5,5 12.97,6.35 14.4,6.38 13.26,7.25 13.68,8.62 12.5,7.8 11.32,8.62 11.74,7.25 10.6,6.38 12.03,6.35" fill="white"/>
        </svg>
      ) : (
        /* en → GB/Union Jack */
        <svg viewBox="0 0 20 14" width={18} height={13} aria-hidden>
          <rect width={20} height={14} fill="#012169"/>
          <polygon points="0,0 2.8,0 20,11.2 20,14 17.2,14 0,2.8" fill="white"/>
          <polygon points="0,14 0,11.2 17.2,0 20,0 20,2.8 2.8,14" fill="white"/>
          <polygon points="0,0 1.4,0 20,12.6 20,14 18.6,14 0,1.4" fill="#C8102E"/>
          <polygon points="0,14 0,12.6 18.6,0 20,0 20,1.4 1.4,14" fill="#C8102E"/>
          <rect y={5.2} width={20} height={3.6} fill="white"/>
          <rect x={8.2} width={3.6} height={14} fill="white"/>
          <rect y={6} width={20} height={2} fill="#C8102E"/>
          <rect x={9.1} width={1.8} height={14} fill="#C8102E"/>
        </svg>
      )}
    </span>
  );
}

export function LocaleSwitcher({
  locale,
  tone = "dark",
}: {
  locale: Locale;
  tone?: "dark" | "light";
}) {
  const pathname = usePathname() || `/${locale}`;
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  function swap(target: Locale): string {
    const segments = pathname.split("/");
    // segments[0] === "", segments[1] === current locale
    segments[1] = target;
    return segments.join("/") || `/${target}`;
  }

  // Close on outside click
  useEffect(() => {
    const onOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  const triggerCls =
    tone === "light"
      ? "text-white/80 hover:text-white"
      : "text-ink-600 hover:text-ink-900";

  const otherLocales = locales.filter((l) => l !== locale);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex items-center gap-1.5 text-sm font-semibold transition-colors duration-200 ${triggerCls}`}
      >
        <LocaleFlagIcon locale={locale} />
        {localeShort[locale]}
        <svg
          viewBox="0 0 12 12"
          fill="none"
          className={`h-3 w-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          aria-hidden
        >
          <path
            d="M2 4l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Slide-down — no bubble, same style as mega menu */}
      <div
        role="listbox"
        className={`absolute right-0 top-full min-w-full bg-white/95 backdrop-blur-sm transition-all duration-200 ${
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        }`}
      >
        {otherLocales.map((loc) => (
          <Link
            key={loc}
            href={swap(loc)}
            role="option"
            aria-selected={loc === locale}
            onClick={() => setOpen(false)}
            className={`flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-semibold transition-colors duration-150 ${
              tone === "light"
                ? "text-white/80 hover:text-white"
                : "text-ink-700 hover:text-brand-600"
            }`}
          >
            <LocaleFlagIcon locale={loc} />
            {localeShort[loc]}
          </Link>
        ))}
      </div>
    </div>
  );
}
