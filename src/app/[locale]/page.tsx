import Image from "next/image";
import Link from "next/link";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { localePath, routes } from "@/lib/routes";
import { Container, Arrow } from "@/components/ui";
import { ReferencesSection, CtaSection } from "@/components/sections";
import { ProductPortfolioSection } from "@/components/ProductPortfolioSection";
import { HeroCarousel } from "@/components/HeroCarousel";
import { RevealOnScroll } from "@/components/RevealOnScroll";


export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "tr";
  const dict = getDictionary(locale);

  return (
    <>
      {/* ---------------- HERO (carousel) ----------------
           One system: the section fills exactly one usable viewport
           (100dvh — the fixed transparent header overlaps the top). The
           carousel flexes to fill the space above the natural-height stats
           bar, so there is never a gap/white strip below the stats. */}
      <section className="relative flex min-h-dvh flex-col overflow-hidden bg-ink-950 text-white">
        <HeroCarousel
          className="flex flex-1 flex-col"
          slides={dict.hero.slides}
          locale={locale}
          ctaPrimary={dict.hero.ctaPrimary}
          ctaSecondary={dict.hero.ctaSecondary}
          contactHref={localePath(locale, routes.contact)}
        />

        {/* Stats bar — natural height, pinned to the bottom of the hero */}
        <Container className="relative shrink-0">
          <div className="relative grid grid-cols-1 gap-px overflow-hidden border-t border-white/10 sm:grid-cols-3">
            {[
              [dict.hero.stat1Value, dict.hero.stat1Label],
              [dict.hero.stat2Value, dict.hero.stat2Label],
              [dict.hero.stat3Value, dict.hero.stat3Label],
            ].map(([value, label]) => (
              <div key={label} className="py-6 sm:px-6 lg:py-7 sm:[&:not(:first-child)]:border-l sm:[&:not(:first-child)]:border-white/10">
                <div className="font-display text-4xl text-white sm:text-5xl">{value}</div>
                <div className="mt-1 text-sm text-steel-400">{label}</div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <ProductPortfolioSection locale={locale} dict={dict} />

      {/* ---------------- FEATURED MOSAIC ---------------- */}
      <section className="bg-white">

        {/* Başlık — ortalı, başlığın iki yanında tech çizgisi */}
        <RevealOnScroll>
          <div className="px-6 py-10 lg:px-12 lg:py-12">

            {/* Başlık satırı */}
            <div className="flex items-center">

              {/* Sol tech çizgi — sadece desktop */}
              <div className="hidden lg:flex lg:flex-1 items-center">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#1F4488]/14 to-[#1F4488]/28" />
                <div className="flex items-center gap-[5px] pl-3">
                  <div className="w-px h-[5px] bg-[#1F4488]/38" />
                  <div className="w-px h-[9px] bg-[#1F4488]/50" />
                  <div className="w-px h-[14px] bg-[#1F4488]/62" />
                </div>
              </div>

              {/* Başlık */}
              <h2 className="flex-1 text-center font-display text-[1.75rem] font-bold leading-tight text-brand-700 lg:flex-none lg:shrink-0 lg:whitespace-nowrap lg:px-7 lg:text-[2.25rem]">
                {dict.featured.title}
              </h2>

              {/* Sağ tech çizgi — sadece desktop */}
              <div className="hidden lg:flex lg:flex-1 items-center">
                <div className="flex items-center gap-[5px] pr-3">
                  <div className="w-px h-[14px] bg-[#1F4488]/62" />
                  <div className="w-px h-[9px] bg-[#1F4488]/50" />
                  <div className="w-px h-[5px] bg-[#1F4488]/38" />
                </div>
                <div className="flex-1 h-px bg-gradient-to-l from-transparent via-[#1F4488]/14 to-[#1F4488]/28" />
              </div>

            </div>

            {/* Alt açıklama */}
            <p className="mx-auto mt-5 max-w-lg text-center text-[0.9375rem] leading-relaxed text-ink-500">
              {dict.featured.subtitle}
            </p>
          </div>
        </RevealOnScroll>

        {/* Mozaik grid — edge-to-edge, her kart ayrı animasyonlu */}
        <div className="grid grid-cols-1 gap-[3px] sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2 lg:h-[800px]">

          {/* Kart 0 — Ürünler (büyük: üst sol, 2/3 genişlik) */}
          <RevealOnScroll className="min-h-[360px] sm:col-span-2 lg:col-span-2 lg:row-span-1 lg:min-h-0">
            <Link
              href={localePath(locale, routes.products)}
              className="group relative block h-full overflow-hidden min-h-[360px] lg:min-h-0"
            >
              <Image
                src="/hero/featured-urunler.png"
                alt={dict.featured.cards[0].title}
                fill
                sizes="(min-width: 1280px) 66vw, (min-width: 768px) 100vw, 100vw"
                unoptimized
                className="object-cover"
                style={{ objectPosition: 'center 38%', filter: 'brightness(1.12) contrast(1.06) saturate(1.15)' }}
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#040911]/58 via-[#040911]/10 to-transparent transition-opacity duration-500 group-hover:opacity-75" />
              <div className="absolute inset-0 flex flex-col justify-end p-7 lg:p-10">
                <span className="inline-flex w-fit items-center rounded-[2px] bg-brand-600/85 px-2 py-[3px] text-[9px] font-semibold uppercase tracking-[0.14em] text-white/95">
                  {dict.featured.cards[0].tag}
                </span>
                <h3 className="mt-2 font-display text-[1.5rem] font-bold leading-tight text-white lg:text-[1.875rem]">
                  {dict.featured.cards[0].title}
                </h3>
                <p className="mt-2 max-w-xl text-[13.5px] leading-relaxed text-white/65">
                  {dict.featured.cards[0].text}
                </p>
                <span className="mt-4 inline-flex translate-y-1 items-center gap-1.5 text-[12px] font-semibold text-brand-300 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-hover:text-white">
                  {dict.featured.cards[0].cta}
                  <Arrow />
                </span>
              </div>
            </Link>
          </RevealOnScroll>

          {/* Kart 1 — Yatırım Çözümleri (üst sağ, 1/3 genişlik) */}
          <RevealOnScroll delay={100} className="min-h-[300px] lg:col-span-1 lg:row-span-1 lg:min-h-0">
            <Link
              href={localePath(locale, routes.investment)}
              className="group relative block h-full overflow-hidden min-h-[300px] lg:min-h-0"
            >
              <Image
                src="/hero/investment-hero.png"
                alt={dict.featured.cards[1].title}
                fill
                sizes="(min-width: 1280px) 34vw, (min-width: 768px) 50vw, 100vw"
                unoptimized
                className="object-cover"
                style={{ objectPosition: 'center 45%', filter: 'brightness(1.18) contrast(1.12) saturate(0.90)' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#040911]/78 via-[#040911]/25 to-transparent transition-opacity duration-500 group-hover:opacity-75" />
              <div className="absolute inset-0 flex flex-col justify-end p-6 lg:p-8">
                <span className="inline-flex w-fit items-center rounded-[2px] bg-brand-600/80 px-1.5 py-[2px] text-[8.5px] font-semibold uppercase tracking-[0.13em] text-white/95">
                  {dict.featured.cards[1].tag}
                </span>
                <h3 className="mt-1.5 font-display text-[1.125rem] font-bold leading-snug text-white">
                  {dict.featured.cards[1].title}
                </h3>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-white/60 lg:max-w-[230px]">
                  {dict.featured.cards[1].text}
                </p>
                <span className="mt-3 inline-flex translate-y-1 items-center gap-1 text-[11px] font-semibold text-brand-300 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
                  {dict.featured.cards[1].cta}
                  <Arrow />
                </span>
              </div>
            </Link>
          </RevealOnScroll>

          {/* Kart 2 — Servis (overlay özelleştirilmiş, scale yok) */}
          <RevealOnScroll delay={60} className="min-h-[260px] lg:min-h-0">
            <Link
              href={localePath(locale, routes.service)}
              className="group relative block h-full overflow-hidden min-h-[260px] lg:min-h-0"
            >
              <Image
                src="/hero/servis-4k-hd.png"
                alt={dict.featured.cards[2].title}
                fill
                sizes="(min-width: 1280px) 34vw, (min-width: 768px) 50vw, 100vw"
                quality={100}
                unoptimized
                className="object-cover"
                style={{ objectPosition: 'center 25%' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#040911]/52 via-[#040911]/8 to-transparent transition-opacity duration-500 group-hover:opacity-70" />
              <div className="absolute inset-0 flex flex-col justify-end p-5 lg:p-7">
                <span className="inline-flex w-fit items-center rounded-[2px] bg-brand-600/80 px-1.5 py-[2px] text-[8.5px] font-semibold uppercase tracking-[0.13em] text-white/95">
                  {dict.featured.cards[2].tag}
                </span>
                <h3 className="mt-1.5 font-display text-[1rem] font-bold leading-snug text-white">
                  {dict.featured.cards[2].title}
                </h3>
                <span className="mt-1.5 inline-flex translate-y-1 items-center gap-1 text-[11px] font-semibold text-brand-300 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  {dict.featured.cards[2].cta}
                  <Arrow />
                </span>
              </div>
            </Link>
          </RevealOnScroll>

          {/* Kart 3 — Hakkımızda */}
          <RevealOnScroll delay={160} className="min-h-[260px] lg:min-h-0">
            <Link
              href={localePath(locale, routes.about)}
              className="group relative block h-full overflow-hidden min-h-[260px] lg:min-h-0"
            >
              <Image
                src="/hero/featured-hakkimizda.png"
                alt={dict.featured.cards[3].title}
                fill
                sizes="(min-width: 1280px) 34vw, (min-width: 768px) 50vw, 100vw"
                unoptimized
                className="object-cover"
                style={{ objectPosition: 'center 40%', filter: 'brightness(1.10) contrast(1.05) saturate(1.22)' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#040911]/62 via-[#040911]/12 to-transparent transition-opacity duration-500 group-hover:opacity-75" />
              <div className="absolute inset-0 flex flex-col justify-end p-5 lg:p-7">
                <span className="inline-flex w-fit items-center rounded-[2px] bg-brand-600/80 px-1.5 py-[2px] text-[8.5px] font-semibold uppercase tracking-[0.13em] text-white/95">
                  {dict.featured.cards[3].tag}
                </span>
                <h3 className="mt-1.5 font-display text-[1rem] font-bold leading-snug text-white">
                  {dict.featured.cards[3].title}
                </h3>
                <span className="mt-1.5 inline-flex translate-y-1 items-center gap-1 text-[11px] font-semibold text-brand-300 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  {dict.featured.cards[3].cta}
                  <Arrow />
                </span>
              </div>
            </Link>
          </RevealOnScroll>

          {/* Kart 4 — İletişim */}
          <RevealOnScroll delay={260} className="min-h-[260px] lg:min-h-0">
            <Link
              href={localePath(locale, routes.contact)}
              className="group relative block h-full overflow-hidden min-h-[260px] lg:min-h-0"
            >
              {/* Lacivert zemin */}
              <div className="absolute inset-0 bg-[#050c1a]" />

              {/* Harita + İstanbul noktası: aynı SVG koordinat sistemi.
                  world.svg 2000×857 boyutunda. Turkey path verilerinden İstanbul ≈ (1162, 265).
                  viewBox merkezi (1162,265) → İstanbul kart merkezinde sabit, CSS hesabı yok. */}
              <svg
                viewBox="762 15 800 500"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute inset-0 h-full w-full pointer-events-none"
                preserveAspectRatio="xMidYMid slice"
                aria-hidden="true"
              >
                <defs>
                  <style>{`
                    @keyframes istpulse {
                      0%   { transform: scale(1);   opacity: 0.55; }
                      70%  { transform: scale(6);   opacity: 0;    }
                      100% { transform: scale(6);   opacity: 0;    }
                    }
                    .ist-ring {
                      transform-box: fill-box;
                      transform-origin: center;
                      animation: istpulse 3.2s ease-out infinite;
                    }
                  `}</style>
                </defs>
                <image
                  href="/world.svg"
                  x="0"
                  y="0"
                  width="2000"
                  height="857"
                  style={{ opacity: 0.42, filter: 'brightness(0.28) saturate(1.2) hue-rotate(196deg) contrast(0.55)' }}
                />
                <circle cx="1141" cy="238" r="12" fill="none" stroke="#4278c8" strokeWidth="2.2" className="ist-ring" />
                <circle cx="1141" cy="238" r="6.5" fill="#1F4488" opacity="0.84" />
                <circle cx="1141" cy="238" r="3.2" fill="white"  opacity="0.96" />
              </svg>

              {/* Hover: gradient overlay hafif açılır */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#050c1a]/60 via-transparent to-transparent transition-opacity duration-500 group-hover:opacity-70" />

              <div className="absolute inset-0 bg-gradient-to-t from-[#050c1a]/88 via-[#050c1a]/18 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-5 lg:p-7">
                <span className="inline-flex w-fit items-center rounded-[2px] bg-brand-600/80 px-1.5 py-[2px] text-[8.5px] font-semibold uppercase tracking-[0.13em] text-white/95">
                  {dict.featured.cards[4].tag}
                </span>
                <h3 className="mt-1.5 font-display text-[1rem] font-bold leading-snug text-white">
                  {dict.featured.cards[4].title}
                </h3>
                <span className="mt-1.5 inline-flex translate-y-1 items-center gap-1 text-[11px] font-semibold text-brand-300 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
                  {dict.featured.cards[4].cta}
                  <Arrow />
                </span>
              </div>
            </Link>
          </RevealOnScroll>

        </div>
      </section>

      {/* ---------------- REFERENCES ---------------- */}
      <ReferencesSection dict={dict} />

      {/* ---------------- CTA ---------------- */}
      <CtaSection locale={locale} dict={dict} />
    </>
  );
}
