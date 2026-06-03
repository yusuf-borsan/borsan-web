"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { localePath, routes } from "@/lib/routes";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { ButtonLink } from "./ui";

export function Header({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname() || "";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close the drawer with the Escape key.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const links = [
    { href: localePath(locale, routes.products), label: dict.nav.products },
    { href: localePath(locale, routes.about), label: dict.nav.about },
    { href: localePath(locale, routes.service), label: dict.nav.service },
    { href: localePath(locale, routes.contact), label: dict.nav.contact },
  ];

  const isActive = (href: string) =>
    pathname === href || (href !== localePath(locale) && pathname.startsWith(href));

  return (
    <>
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-ink-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80"
          : "border-transparent bg-white"
      }`}
    >
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
        <Link href={localePath(locale)} className="flex items-center" aria-label={dict.meta.siteName}>
          <Image
            src="/branding/logo.png"
            alt={dict.meta.siteName}
            width={1939}
            height={423}
            priority
            className="h-9 w-auto sm:h-10"
          />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-[0.95rem] font-medium transition-colors ${
                isActive(link.href) ? "text-brand-600" : "text-ink-700 hover:text-brand-600"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden sm:block">
            <LocaleSwitcher locale={locale} />
          </div>
          <div className="hidden sm:block">
            <ButtonLink
              href={localePath(locale, routes.contact)}
              variant="primary"
              size="md"
              withArrow
            >
              {dict.nav.getQuote}
            </ButtonLink>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            aria-expanded={open}
            className="flex h-10 w-10 items-center justify-center rounded-sm text-ink-900 lg:hidden"
          >
            <span className="relative flex h-4 w-6 flex-col justify-between">
              <span className={`h-0.5 w-full bg-current transition-transform ${open ? "translate-y-[7px] rotate-45" : ""}`} />
              <span className={`h-0.5 w-full bg-current transition-opacity ${open ? "opacity-0" : ""}`} />
              <span className={`h-0.5 w-full bg-current transition-transform ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
      </div>
      </header>

      {/* ---- Mobile slide-in drawer (flyout from the right) ---- */}
      {/* Rendered OUTSIDE <header> so the header's backdrop-blur (when scrolled)
          can't become the containing block for these fixed elements. */}
      {/* Dimmed overlay — click to close */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-[60] bg-ink-950/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden
      />

      {/* Side panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={dict.meta.siteName}
        className={`fixed right-0 top-0 z-[70] flex h-full w-[86%] max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 ease-out lg:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-20 shrink-0 items-center justify-between border-b border-ink-100 px-6">
          <Image
            src="/branding/logo.png"
            alt={dict.meta.siteName}
            width={1939}
            height={423}
            className="h-8 w-auto"
          />
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Kapat / Close"
            className="flex h-11 w-11 items-center justify-center rounded-sm text-ink-700 transition-colors hover:bg-ink-50 hover:text-brand-600"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-6 py-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-display border-b border-ink-100/70 py-4 text-2xl tracking-tight transition-colors sm:text-3xl ${
                isActive(link.href) ? "text-brand-600" : "text-ink-900 hover:text-brand-600"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center justify-between gap-4 border-t border-ink-100 px-6 py-6">
          <LocaleSwitcher locale={locale} />
          <ButtonLink href={localePath(locale, routes.contact)} variant="primary" size="lg" withArrow>
            {dict.nav.getQuote}
          </ButtonLink>
        </div>
      </aside>
    </>
  );
}
