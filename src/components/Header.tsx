"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { localePath, routes } from "@/lib/routes";
import { categories } from "@/lib/products";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { ButtonLink } from "./ui";
import { CategoryIcon } from "./icons";

export function Header({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const megaTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname() || "";

  /* ── Scroll detection ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Close drawer on navigation ── */
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  /* ── Lock body scroll while drawer is open ── */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  /* ── Close on Escape ── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setMegaOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* ── Mega menu timer cleanup ── */
  useEffect(() => {
    return () => {
      if (megaTimerRef.current) clearTimeout(megaTimerRef.current);
    };
  }, []);

  /* ── Mega menu hover handlers (with delay to allow mouse travel) ── */
  const openMega = () => {
    if (megaTimerRef.current) clearTimeout(megaTimerRef.current);
    setMegaOpen(true);
  };
  const closeMega = () => {
    megaTimerRef.current = setTimeout(() => setMegaOpen(false), 200);
  };

  const isActive = (href: string) =>
    pathname === href || (href !== localePath(locale) && pathname.startsWith(href));

  /* ── Nav link class helper ── */
  const navLinkCls = (href: string, primary: boolean) => {
    const base =
      "relative pb-0.5 text-[0.875rem] tracking-wide transition-colors duration-200 after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-brand-600 after:transition-[width] after:duration-200";
    const weight = primary
      ? "font-semibold"
      : "font-medium";
    if (isActive(href)) {
      return `${base} ${weight} text-brand-600 after:w-full`;
    }
    return `${base} ${weight} ${
      primary ? "text-ink-800 hover:text-ink-900" : "text-ink-800 hover:text-ink-900"
    } after:w-0 hover:after:w-full`;
  };

  const productsHref = localePath(locale, routes.products);

  /* Mobile nav links — spread primary + secondary in order */
  const allLinks = [
    { href: productsHref, label: dict.nav.products },
    { href: localePath(locale, routes.service), label: dict.nav.service },
    { href: localePath(locale, routes.about), label: dict.nav.about },
    { href: localePath(locale, routes.contact), label: dict.nav.contact },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b bg-white/90 backdrop-blur-md transition-all duration-300 ${
          scrolled ? "border-ink-200/60 shadow-sm" : "border-transparent"
        }`}
      >
        <div className="mx-auto flex h-[70px] w-full max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">

          {/* ── Logo ── */}
          <Link
            href={localePath(locale)}
            className="flex shrink-0 items-center"
            aria-label={dict.meta.siteName}
          >
            <Image
              src="/branding/logo.png"
              alt={dict.meta.siteName}
              width={1939}
              height={423}
              priority
              className="h-8 w-auto sm:h-9"
            />
          </Link>

          {/* ── Desktop nav ── */}
          <nav className="hidden items-center lg:flex" aria-label="Main navigation">

            {/* Primary: Ürünler (with mega menu) */}
            <div
              onMouseEnter={openMega}
              onMouseLeave={closeMega}
              className="flex h-[70px] items-center px-3"
            >
              <Link href={productsHref} className={navLinkCls(productsHref, true)}>
                {dict.nav.products}
              </Link>
            </div>

            {/* Primary: Servis */}
            <div className="flex items-center px-3">
              <Link
                href={localePath(locale, routes.service)}
                className={navLinkCls(localePath(locale, routes.service), true)}
              >
                {dict.nav.service}
              </Link>
            </div>

            {/* Visual separator */}
            <span className="mx-2 h-4 w-px bg-ink-200" aria-hidden />

            {/* Secondary: Hakkımızda */}
            <div className="flex items-center px-3">
              <Link
                href={localePath(locale, routes.about)}
                className={navLinkCls(localePath(locale, routes.about), false)}
              >
                {dict.nav.about}
              </Link>
            </div>

            {/* Secondary: İletişim */}
            <div className="flex items-center px-3">
              <Link
                href={localePath(locale, routes.contact)}
                className={navLinkCls(localePath(locale, routes.contact), false)}
              >
                {dict.nav.contact}
              </Link>
            </div>

          </nav>

          {/* ── Right side actions ── */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <LocaleSwitcher locale={locale} />
            </div>
            <div className="hidden sm:block">
              <ButtonLink
                href={localePath(locale, routes.contact)}
                variant="primary"
                size="md"
                withArrow
                className="px-6 shadow-md shadow-brand-600/25 transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0"
              >
                {dict.nav.getQuote}
              </ButtonLink>
            </div>

            {/* Hamburger — mobile/tablet only */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label="Menu"
              aria-expanded={open}
              className="flex h-10 w-10 items-center justify-center rounded-sm text-ink-900 transition-colors hover:bg-ink-50 lg:hidden"
            >
              <span className="relative flex h-3.5 w-5 flex-col justify-between">
                <span
                  className={`h-px w-full bg-current transition-all duration-300 ease-in-out ${
                    open ? "translate-y-[6px] rotate-45" : ""
                  }`}
                />
                <span
                  className={`h-px w-full bg-current transition-all duration-300 ease-in-out ${
                    open ? "scale-x-0 opacity-0" : ""
                  }`}
                />
                <span
                  className={`h-px w-full bg-current transition-all duration-300 ease-in-out ${
                    open ? "-translate-y-[6px] -rotate-45" : ""
                  }`}
                />
              </span>
            </button>
          </div>
        </div>

        {/* ── Mega Menu (Ürünler) ── */}
        <div
          onMouseEnter={openMega}
          onMouseLeave={closeMega}
          className={`absolute left-0 right-0 top-full z-40 border-b border-ink-100/80 bg-white/95 shadow-xl backdrop-blur-sm transition-all duration-200 ${
            megaOpen
              ? "pointer-events-auto translate-y-0 opacity-100"
              : "pointer-events-none -translate-y-2 opacity-0"
          }`}
        >
          <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8 lg:px-10">

            {/* Header row */}
            <div className="mb-5 flex items-center justify-between border-b border-ink-100 pb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-400">
                {locale === "tr" ? "Ürün Kategorileri" : "Product Categories"}
              </span>
              <Link
                href={productsHref}
                onClick={() => setMegaOpen(false)}
                className="group flex items-center gap-1.5 text-xs font-semibold text-brand-600 transition-colors duration-200 hover:text-brand-700"
              >
                {dict.common.viewAllProducts}
                <svg
                  viewBox="0 0 16 16"
                  fill="none"
                  className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                  aria-hidden
                >
                  <path
                    d="M3 8h10M9 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>

            {/* Category grid — 4 columns */}
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={localePath(locale, routes.category(cat.slug))}
                  onClick={() => setMegaOpen(false)}
                  className="group flex items-center gap-3 rounded-xl p-3 transition-colors duration-200 hover:bg-brand-50"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-600/10 text-brand-600 transition-all duration-200 group-hover:bg-brand-600 group-hover:text-white">
                    <CategoryIcon name={cat.icon} className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold leading-tight text-ink-900 transition-colors duration-200 group-hover:text-brand-700">
                      {cat.name[locale]}
                    </div>
                    <div className="mt-0.5 line-clamp-2 text-xs leading-snug text-ink-400">
                      {cat.tagline[locale]}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

          </div>
        </div>
      </header>

      {/* ── Mobile: dimmed overlay ── */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-[60] bg-ink-950/60 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden
      />

      {/* ── Mobile: slide-in drawer ── */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={dict.meta.siteName}
        className={`fixed right-0 top-0 z-[70] flex h-full w-[86%] max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="flex h-[70px] shrink-0 items-center justify-between border-b border-ink-100 px-6">
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
            className="flex h-10 w-10 items-center justify-center rounded-sm text-ink-700 transition-colors hover:bg-ink-50 hover:text-brand-600"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Drawer nav links */}
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-6 py-8">
          {allLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-display border-b border-ink-100/70 py-4 text-2xl tracking-tight transition-colors duration-200 sm:text-3xl ${
                isActive(link.href)
                  ? "text-brand-600"
                  : "text-ink-900 hover:text-brand-600"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Drawer footer */}
        <div className="flex shrink-0 items-center justify-between gap-4 border-t border-ink-100 px-6 py-6">
          <LocaleSwitcher locale={locale} />
          <ButtonLink
            href={localePath(locale, routes.contact)}
            variant="primary"
            size="lg"
            withArrow
          >
            {dict.nav.getQuote}
          </ButtonLink>
        </div>
      </aside>
    </>
  );
}
