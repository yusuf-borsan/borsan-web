import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { categories, type Category } from "@/lib/products";
import { localePath, routes } from "@/lib/routes";
import { Container, Arrow } from "@/components/ui";
import { CtaSection } from "@/components/sections";
import { RevealOnScroll } from "@/components/RevealOnScroll";

/** Categories with no products yet — shown last with a "coming soon" placeholder. */
const COMING_SOON_SLUGS = new Set(["taslama-tezgahlari", "cnc-yatay-isleme-merkezleri"]);

/** Per-category image overrides for broken or unrepresentative images. */
const CATEGORY_IMAGE_OVERRIDES: Record<string, string> = {
  "cnc-dik-isleme-merkezleri": "/machines/cnc-dik-isleme-merkezleri/falco-fv-hd655-1.png",
  "dik-tornalar": "/machines/dik-tornalar/falco-fl-1600-atc-1.png",
  "cnc-aksesuarlari": "/machines/cnc-aksesuarlari/tcvr-255-1.png",
};

function getRepresentativeImage(cat: Category): string {
  if (CATEGORY_IMAGE_OVERRIDES[cat.slug]) return CATEGORY_IMAGE_OVERRIDES[cat.slug]!;
  if (!cat.image.endsWith(".svg")) return cat.image;
  return cat.products.find((p) => !p.image.endsWith(".svg"))?.image ?? cat.image;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : "tr");
  return { title: dict.productsPage.title };
}

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "tr";
  const dict = getDictionary(locale);

  // Coming-soon categories go last
  const sortedCategories = [
    ...categories.filter((c) => !COMING_SOON_SLUGS.has(c.slug)),
    ...categories.filter((c) => COMING_SOON_SLUGS.has(c.slug)),
  ];

  return (
    <>
      {/* ── Compact page header ── */}
      <section className="border-b border-slate-200/70 bg-white">
        <Container className="py-10 lg:py-12">
          <nav
            aria-label="breadcrumb"
            className="mb-5 flex items-center gap-2 text-[11.5px] font-medium text-ink-500"
          >
            <Link
              href={localePath(locale)}
              className="transition-colors hover:text-brand-600"
            >
              {dict.common.home}
            </Link>
            <span aria-hidden="true" className="text-ink-300">/</span>
            <span className="text-ink-800">{dict.common.products}</span>
          </nav>
          <p className="eyebrow text-brand-600">{dict.productsPage.eyebrow}</p>
          {/* Title in brand blue, slightly larger */}
          <h1 className="font-display mt-3 max-w-xl text-balance text-[2rem] leading-tight text-brand-700 lg:text-[2.5rem]">
            {dict.productsPage.title}
          </h1>
          <p className="mt-3 max-w-2xl text-[0.9375rem] leading-relaxed text-ink-500">
            {dict.productsPage.subtitle}
          </p>
        </Container>
      </section>

      {/* ── Category card grid ── */}
      <section className="bg-[#f2f4f8]">
        <Container className="py-12 lg:py-16">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {sortedCategories.map((cat, i) => {
              const isComingSoon = COMING_SOON_SLUGS.has(cat.slug);
              const repImage = isComingSoon ? null : getRepresentativeImage(cat);
              const isSvg = repImage?.endsWith(".svg") ?? false;

              return (
                <RevealOnScroll key={cat.slug} delay={Math.min(i * 55, 275)}>
                  <Link
                    href={localePath(locale, routes.category(cat.slug))}
                    className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-[0_2px_12px_-2px_rgba(20,23,29,0.13),0_1px_4px_rgba(20,23,29,0.07)] transition-all duration-300 hover:border-brand-200 hover:shadow-[0_20px_60px_-10px_rgba(31,68,136,0.26),0_4px_12px_-2px_rgba(20,23,29,0.10)]"
                  >
                    {/* ── Image / Coming-soon area ── */}
                    <div
                      className="relative overflow-hidden bg-white"
                      style={{ aspectRatio: "16/10" }}
                    >
                      {isComingSoon ? (
                        /* Coming-soon placeholder */
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-brand-50/60 px-6">
                          {/* Hourglass icon */}
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-10 w-10 text-brand-300"
                            aria-hidden="true"
                          >
                            <path d="M5 3h14M5 21h14M6 3v4a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3M6 21v-4a6 6 0 0 1 6-6 6 6 0 0 1 6 6v4" />
                          </svg>
                          <p className="text-center text-[13px] font-medium leading-snug text-brand-700">
                            {dict.categoryPage.comingSoon}
                          </p>
                        </div>
                      ) : (
                        <>
                          <Image
                            src={repImage!}
                            alt={cat.name[locale]}
                            fill
                            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                            quality={95}
                            className={isSvg ? "object-contain p-10 opacity-70" : "object-contain p-5"}
                          />
                          {/* Subtle blue gradient wash on hover */}
                          {!isSvg && (
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-600/14 via-brand-600/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                          )}
                        </>
                      )}

                      {/* Product count badge */}
                      <span className="absolute right-3.5 top-3.5 flex items-center rounded-full border border-slate-200 bg-white/90 px-2.5 py-[3px] text-[10px] font-semibold tabular-nums text-ink-600 shadow-sm backdrop-blur-sm">
                        {cat.products.length}&nbsp;{dict.common.machineCount}
                      </span>
                    </div>

                    {/* ── Card body ── */}
                    <div className="flex flex-1 flex-col px-5 py-5 lg:px-6">
                      <h2 className="font-display text-[1.0625rem] font-bold leading-snug text-ink-900 lg:text-[1.125rem]">
                        {cat.name[locale]}
                      </h2>
                      <p className="mt-1.5 flex-1 text-[12.5px] leading-relaxed text-ink-400">
                        {cat.tagline[locale]}
                      </p>

                      {/* CTA row */}
                      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3.5">
                        <span className="text-[11.5px] font-semibold text-brand-600">
                          {dict.common.exploreCategory}
                        </span>
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-50 text-brand-600 transition-all duration-200 group-hover:bg-brand-600 group-hover:text-white">
                          <Arrow />
                        </span>
                      </div>
                    </div>
                  </Link>
                </RevealOnScroll>
              );
            })}
          </div>
        </Container>
      </section>

      <CtaSection locale={locale} dict={dict} />
    </>
  );
}
