"use client";

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

  function swap(target: Locale): string {
    const segments = pathname.split("/");
    // segments[0] === "" , segments[1] === current locale
    segments[1] = target;
    return segments.join("/") || `/${target}`;
  }

  const idle = tone === "light" ? "text-steel-400 hover:text-white" : "text-ink-500 hover:text-ink-900";
  const active = tone === "light" ? "text-white" : "text-brand-600";

  return (
    <div className="flex items-center gap-1 text-sm font-semibold">
      {locales.map((loc, i) => (
        <span key={loc} className="flex items-center">
          {i > 0 && <span className="px-1 text-ink-300/60" aria-hidden>/</span>}
          <Link
            href={swap(loc)}
            aria-current={loc === locale ? "true" : undefined}
            className={`transition-colors ${loc === locale ? active : idle}`}
          >
            {localeShort[loc]}
          </Link>
        </span>
      ))}
    </div>
  );
}
