"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, localeShort, type Locale } from "@/i18n/config";

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

  // Close dropdown on outside click
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
        className={`flex items-center gap-1 text-sm font-semibold transition-colors duration-200 ${triggerCls}`}
      >
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

      <div
        role="listbox"
        className={`absolute right-0 top-full mt-2 min-w-[72px] overflow-hidden rounded-lg border border-ink-100 bg-white shadow-lg transition-all duration-200 ${
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-1 opacity-0"
        }`}
      >
        {otherLocales.map((loc) => (
          <Link
            key={loc}
            href={swap(loc)}
            role="option"
            aria-selected={loc === locale}
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-sm font-semibold text-ink-600 transition-colors duration-150 hover:bg-brand-50 hover:text-brand-600"
          >
            {localeShort[loc]}
          </Link>
        ))}
      </div>
    </div>
  );
}
