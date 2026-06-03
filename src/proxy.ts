import { NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale } from "@/i18n/config";

function detectLocale(request: NextRequest): string {
  const header = request.headers.get("accept-language");
  if (header) {
    const preferred = header.split(",").map((p) => p.split(";")[0].trim().toLowerCase());
    for (const lang of preferred) {
      const base = lang.split("-")[0];
      if ((locales as readonly string[]).includes(base)) return base;
    }
  }
  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = locales.some(
    (loc) => pathname === `/${loc}` || pathname.startsWith(`/${loc}/`),
  );
  if (hasLocale) return NextResponse.next();

  const locale = detectLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip Next internals, API and any path with a file extension (static assets).
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
