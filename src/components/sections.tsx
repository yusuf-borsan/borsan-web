import Link from "next/link";
import type { ReactNode } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { localePath, routes } from "@/lib/routes";
import { Container, Eyebrow, ButtonLink, HeroContentBlock } from "./ui";
import { ReferenceMarquee, type ReferenceItem } from "./ReferenceMarquee";
import { RevealOnScroll } from "./RevealOnScroll";

export function Breadcrumb({
  items,
  variant = "dark",
}: {
  items: { label: string; href?: string }[];
  variant?: "dark" | "light";
}) {
  const isDark = variant === "dark";
  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <ol className={`flex flex-wrap items-center gap-1.5 ${isDark ? "text-steel-400" : "text-ink-400"}`}>
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {i > 0 && (
              <span className={isDark ? "text-steel-600" : "text-ink-300"} aria-hidden>
                /
              </span>
            )}
            {item.href ? (
              <Link
                href={item.href}
                className={
                  isDark
                    ? "transition-colors hover:text-white"
                    : "relative font-medium text-ink-500 transition-colors hover:text-brand-700 after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 after:bg-brand-600 after:transition-[width] after:duration-200 hover:after:w-full"
                }
              >
                {item.label}
              </Link>
            ) : (
              <span className={isDark ? "text-steel-300" : "font-medium text-ink-800"}>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/**
 * Canonical dark-hero heading block shared by every corporate page hero
 * (Servis, Yatırım Çözümleri, Hakkımızda, İletişim, PageHero). One source of
 * truth for eyebrow style, title typography (font-display → Manrope +
 * -0.015em tracking + weight 600), responsive sizes, line-height, subtitle
 * width and vertical rhythm, so the headings all read as the same family.
 * Optional `children` render below the subtitle (e.g. a hero CTA button).
 */
export function PageHeroHeading({
  eyebrow,
  title,
  subtitle,
  children,
  className = "",
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`max-w-2xl ${className}`}>
      {eyebrow && <Eyebrow tone="light">{eyebrow}</Eyebrow>}
      <h1 className="font-display mt-4 text-balance text-4xl leading-[1.04] text-white sm:text-5xl lg:text-[3.25rem]">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-steel-300">{subtitle}</p>
      )}
      {children}
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  subtitle,
  breadcrumb,
  heroHeading = false,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  breadcrumb?: { label: string; href?: string }[];
  /** Opt in to the large shared HeroContentBlock (matches the home hero).
      Left false so existing pages (e.g. İletişim) keep their current heading. */
  heroHeading?: boolean;
}) {
  return (
    <section className="relative flex min-h-[58dvh] items-center overflow-hidden bg-ink-950 text-white">
      <div
        className="absolute -right-32 top-0 h-full w-[40rem] opacity-60"
        style={{
          background:
            "radial-gradient(40rem 30rem at 70% 30%, rgba(31,68,136,0.45), transparent 70%)",
        }}
        aria-hidden
      />
      <Container className="relative py-20 lg:py-24">
        {breadcrumb && (
          <div className="mb-6">
            <Breadcrumb items={breadcrumb} />
          </div>
        )}
        {heroHeading ? (
          <HeroContentBlock eyebrow={eyebrow} title={title} subtitle={subtitle} />
        ) : (
          <PageHeroHeading eyebrow={eyebrow} title={title} subtitle={subtitle} />
        )}
      </Container>
    </section>
  );
}

export function CtaSection({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section className="relative overflow-hidden bg-brand-600">
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
            <h2 className="font-display text-balance text-3xl leading-tight text-white sm:text-4xl">
              {dict.cta.title}
            </h2>
            <p className="mt-4 text-pretty text-base leading-relaxed text-brand-100">{dict.cta.subtitle}</p>
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

const REFERENCE_LOGOS: ReferenceItem[] = [
  { name: "Mashprom KMH",      logo: "/references/mashprom-kmh.png" },
  { name: "İztes Testere",     logo: "/references/iztes-testere.png" },
  { name: "Yüksel Makina",     logo: "/references/yuksel-makina.png" },
  { name: "Yücel Makina",      logo: null },
  { name: "THY Teknik",        logo: "/references/thy-teknik.png" },
  { name: "Eti Maden",         logo: "/references/eti-maden.png" },
  { name: "Gölcük Tersanesi",  logo: "/references/golcuk2.png" },
  { name: "Aksaz Tersanesi",   logo: null },
  { name: "Aselsan Mtal",      logo: "/references/aselsan-mtal.png" },
  { name: "Havelsan Mtal",     logo: "/references/havelsan-mtal.png" },
  { name: "Türasaş",           logo: "/references/turasas.png" },
  { name: "Tuzla Tersanesi",   logo: null },
  { name: "Özata Tersanesi",   logo: "/references/ozata-tersanesi.png" },
  { name: "5M Otomotiv",       logo: "/references/5m-otomotiv.png" },
  { name: "Dursunoğlu Makina", logo: null },
  { name: "HBY Otomotiv",      logo: "/references/hby-otomotiv.png" },
  { name: "Volt Motor",        logo: null },
  { name: "Asos Proses",       logo: "/references/asos-proses.png" },
];

export function ReferencesSection({ dict }: { dict: Dictionary }) {
  return (
    <section className="border-y border-ink-100 bg-white">
      <Container className="pt-16 pb-10 lg:pt-20 lg:pb-12">
        <RevealOnScroll>
          <div className="flex flex-col items-center gap-5 text-center">

            {/* Eyebrow with flanking lines */}
            <div className="flex items-center gap-3">
              <div className="h-px w-10 bg-brand-200" />
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand-600">
                {dict.references.eyebrow}
              </span>
              <div className="h-px w-10 bg-brand-200" />
            </div>

            {/* Title — bold, single dark color */}
            <h2 className="font-display max-w-2xl text-balance text-3xl font-bold leading-tight text-ink-900 sm:text-4xl">
              {dict.references.title} {dict.references.titleHighlight}
            </h2>

            {/* Description */}
            <p className="max-w-2xl text-base leading-relaxed text-ink-500">
              {dict.references.subtitle}
            </p>

          </div>
        </RevealOnScroll>
      </Container>

      {/* Infinite flowing reference strip — eases to a slow flow on hover */}
      <ReferenceMarquee items={REFERENCE_LOGOS} />
    </section>
  );
}
