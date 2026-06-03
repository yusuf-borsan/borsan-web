import Link from "next/link";
import type { ReactNode } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { localePath, routes } from "@/lib/routes";
import { Container, Eyebrow, ButtonLink } from "./ui";
import { ReferenceMarquee } from "./ReferenceMarquee";

export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <ol className="flex flex-wrap items-center gap-2 text-steel-400">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            {i > 0 && <span className="text-steel-600" aria-hidden>/</span>}
            {item.href ? (
              <Link href={item.href} className="transition-colors hover:text-white">
                {item.label}
              </Link>
            ) : (
              <span className="text-steel-300">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PageHero({
  eyebrow,
  title,
  subtitle,
  breadcrumb,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  breadcrumb?: { label: string; href?: string }[];
}) {
  return (
    <section className="relative overflow-hidden bg-ink-950 text-white">
      <div className="absolute inset-0 bg-grid opacity-70" aria-hidden />
      <div
        className="absolute -right-32 top-0 h-full w-[40rem] opacity-60"
        style={{
          background:
            "radial-gradient(40rem 30rem at 70% 30%, rgba(31,68,136,0.45), transparent 70%)",
        }}
        aria-hidden
      />
      <Container className="relative py-16 sm:py-20 lg:py-24">
        {breadcrumb && (
          <div className="mb-6">
            <Breadcrumb items={breadcrumb} />
          </div>
        )}
        <div className="max-w-3xl">
          {eyebrow && <Eyebrow tone="light">{eyebrow}</Eyebrow>}
          <h1 className="font-display mt-4 text-4xl leading-[1.04] sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-steel-300">{subtitle}</p>
          )}
        </div>
      </Container>
    </section>
  );
}

export function CtaSection({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section className="relative overflow-hidden bg-brand-600">
      <div className="absolute inset-0 bg-grid opacity-40" aria-hidden />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(120deg, rgba(12,24,48,0.55), transparent 55%)",
        }}
        aria-hidden
      />
      <Container className="relative py-16 lg:py-20">
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl leading-tight text-white sm:text-4xl">
              {dict.cta.title}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-brand-100">{dict.cta.subtitle}</p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <ButtonLink href={localePath(locale, routes.contact)} variant="light" size="lg" withArrow>
              {dict.cta.primary}
            </ButtonLink>
            <ButtonLink
              href={localePath(locale, routes.products)}
              size="lg"
              className="bg-brand-700 text-white ring-1 ring-inset ring-white/20 hover:bg-brand-800"
            >
              {dict.common.viewAllProducts}
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}

const REFERENCE_NAMES = [
  "ARÇELİK",
  "BOSCH",
  "FORD OTOSAN",
  "TUSAŞ",
  "ASELSAN",
  " ECZACIBAŞI",
  "ŞİŞECAM",
  "BMC",
];

export function ReferencesSection({ dict }: { dict: Dictionary }) {
  return (
    <section className="border-y border-ink-100 bg-steel-300/10">
      <Container className="py-16 lg:py-20">
        <div className="flex flex-col gap-3">
          <Eyebrow>{dict.references.eyebrow}</Eyebrow>
          <h2 className="font-display max-w-2xl text-2xl leading-tight text-ink-900 sm:text-3xl">
            {dict.references.title}
          </h2>
          <p className="max-w-2xl text-base leading-relaxed text-ink-500">
            {dict.references.subtitle}
          </p>
        </div>
      </Container>

      {/* Infinite flowing reference strip — eases to a slow flow on hover */}
      <ReferenceMarquee items={REFERENCE_NAMES} placeholder={dict.references.placeholder} />
    </section>
  );
}
