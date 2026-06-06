import Image from "next/image";
import Link from "next/link";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { categories } from "@/lib/products";
import { localePath, routes } from "@/lib/routes";
import { Container, ButtonLink, SectionHeading, Arrow } from "@/components/ui";
import { CategoryIcon, FeatureIcon } from "@/components/icons";
import { ReferencesSection, CtaSection } from "@/components/sections";
import { HeroCarousel } from "@/components/HeroCarousel";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "tr";
  const dict = getDictionary(locale);

  const featureIconKeys = ["consult", "precision", "commission", "shield"];

  return (
    <>
      {/* ---------------- HERO (carousel) ---------------- */}
      <section className="relative overflow-hidden bg-ink-950 text-white">
        <HeroCarousel
          slides={dict.hero.slides}
          locale={locale}
          ctaPrimary={dict.hero.ctaPrimary}
          ctaSecondary={dict.hero.ctaSecondary}
          contactHref={localePath(locale, routes.contact)}
        />

        {/* Stats bar */}
        <Container className="relative">
          <div className="relative grid grid-cols-1 gap-px overflow-hidden border-t border-white/10 sm:grid-cols-3">
            {[
              [dict.hero.stat1Value, dict.hero.stat1Label],
              [dict.hero.stat2Value, dict.hero.stat2Label],
              [dict.hero.stat3Value, dict.hero.stat3Label],
            ].map(([value, label]) => (
              <div key={label} className="py-8 sm:px-6 sm:[&:not(:first-child)]:border-l sm:[&:not(:first-child)]:border-white/10">
                <div className="font-display text-4xl text-white sm:text-5xl">{value}</div>
                <div className="mt-1 text-sm text-steel-400">{label}</div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ---------------- CATEGORIES ---------------- */}
      <section className="bg-white">
        <Container className="py-20 lg:py-28">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              eyebrow={dict.categories.eyebrow}
              title={dict.categories.title}
              subtitle={dict.categories.subtitle}
              className="lg:max-w-3xl"
            />
            <ButtonLink
              href={localePath(locale, routes.products)}
              variant="ghost"
              withArrow
              className="hidden shrink-0 lg:inline-flex"
            >
              {dict.common.viewAllProducts}
            </ButtonLink>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={localePath(locale, routes.category(cat.slug))}
                className="group relative flex flex-col overflow-hidden rounded-md border border-ink-100 bg-ink-950 transition-all duration-300 hover:border-brand-500/60 hover:shadow-[0_24px_50px_-28px_rgba(20,23,29,0.6)]"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={cat.image}
                    alt={cat.name[locale]}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/30 to-transparent" />
                  <span className="absolute left-5 top-5 flex h-12 w-12 items-center justify-center rounded-sm bg-brand-600/90 text-white ring-1 ring-white/10 backdrop-blur">
                    <CategoryIcon name={cat.icon} className="h-7 w-7" />
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-xl leading-tight text-white">{cat.name[locale]}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-steel-400">{cat.tagline[locale]}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-300 transition-colors group-hover:text-brand-200">
                    {dict.common.exploreCategory}
                    <Arrow />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* ---------------- ADVANTAGES ---------------- */}
      <section className="relative overflow-hidden bg-ink-900 text-white">
        <div className="absolute inset-0 bg-grid opacity-70" aria-hidden />
        <Container className="relative py-20 lg:py-28">
          <SectionHeading
            eyebrow={dict.advantages.eyebrow}
            title={dict.advantages.title}
            subtitle={dict.advantages.subtitle}
            tone="light"
          />
          <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-md border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {dict.advantages.items.map((item, i) => (
              <div key={item.title} className="flex flex-col gap-5 bg-ink-900 p-8">
                <span className="flex h-14 w-14 items-center justify-center rounded-sm bg-brand-600/15 text-brand-300 ring-1 ring-inset ring-brand-500/30">
                  <FeatureIcon name={featureIconKeys[i]} className="h-8 w-8" />
                </span>
                <h3 className="font-display text-lg leading-tight text-white">{item.title}</h3>
                <p className="text-sm leading-relaxed text-steel-400">{item.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ---------------- REFERENCES ---------------- */}
      <ReferencesSection dict={dict} />

      {/* ---------------- CTA ---------------- */}
      <CtaSection locale={locale} dict={dict} />
    </>
  );
}
