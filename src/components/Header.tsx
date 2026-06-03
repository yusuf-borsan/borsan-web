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

  const links = [
    { href: localePath(locale, routes.products), label: dict.nav.products },
    { href: localePath(locale, routes.about), label: dict.nav.about },
    { href: localePath(locale, routes.service), label: dict.nav.service },
    { href: localePath(locale, routes.contact), label: dict.nav.contact },
  ];

  const isActive = (href: string) =>
    pathname === href || (href !== localePath(locale) && pathname.startsWith(href));

  return (
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

      {/* Mobile drawer */}
      <div
        className={`overflow-hidden border-t border-ink-100 bg-white lg:hidden ${
          open ? "max-h-96" : "max-h-0"
        } transition-[max-height] duration-300 ease-in-out`}
      >
        <nav className="flex flex-col gap-1 px-5 py-4 sm:px-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-sm px-3 py-3 text-base font-medium ${
                isActive(link.href) ? "bg-brand-50 text-brand-600" : "text-ink-800 hover:bg-ink-50"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-3 flex items-center justify-between px-3">
            <LocaleSwitcher locale={locale} />
            <ButtonLink href={localePath(locale, routes.contact)} variant="primary" size="md" withArrow>
              {dict.nav.getQuote}
            </ButtonLink>
          </div>
        </nav>
      </div>
    </header>
  );
}
