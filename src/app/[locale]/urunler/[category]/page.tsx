import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { categories, getCategory } from "@/lib/products";
import { localePath, routes } from "@/lib/routes";
import { Container } from "@/components/ui";
import { Breadcrumb, CtaSection } from "@/components/sections";
import { FilterableProductGrid } from "@/components/FilterableProductGrid";

const COMING_SOON_SLUGS = new Set(["taslama-tezgahlari", "cnc-yatay-isleme-merkezleri"]);

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    categories.map((cat) => ({ locale, category: cat.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}): Promise<Metadata> {
  const { locale, category } = await params;
  const loc: Locale = isLocale(locale) ? locale : "tr";
  const cat = getCategory(category);
  if (!cat) return {};
  return { title: cat.name[loc], description: cat.description[loc] };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale: raw, category } = await params;
  const locale: Locale = isLocale(raw) ? raw : "tr";
  const dict = getDictionary(locale);
  const cat = getCategory(category);
  if (!cat) notFound();

  return (
    <>
      <section className="bg-[#f4f6f9]">
        <Container className="pb-14 pt-10 lg:pb-20 lg:pt-14">

          {/* Breadcrumb */}
          <div className="mb-8 lg:mb-10">
            <Breadcrumb
              variant="light"
              items={[
                { label: dict.common.home, href: localePath(locale) },
                { label: dict.common.products, href: localePath(locale, routes.products) },
                { label: cat.name[locale] },
              ]}
            />
          </div>

          {/* Premium category intro */}
          <div className="mb-10 lg:mb-14">

            {/* Eyebrow label */}
            <p className="mb-3 text-[10.5px] font-medium uppercase tracking-[0.18em] text-[#1F4488]/60">
              {dict.categoryPage.modelsEyebrow}
            </p>

            {/* Title */}
            <h1 className="font-display text-[1.875rem] leading-[1.15] text-[#1F4488] sm:text-[2.25rem] lg:text-[2.625rem]">
              {cat.name[locale]}
            </h1>

            {/* Description */}
            <p className="mt-4 max-w-2xl text-[15px] leading-[1.75] text-ink-600">
              {cat.description[locale]}
            </p>

            {/* Accent line */}
            <div className="mt-6 h-[1.5px] w-32 bg-gradient-to-r from-[#1F4488]/65 to-transparent" />
          </div>

          {COMING_SOON_SLUGS.has(cat.slug) ? (
            /* Coming-soon banner for categories without products yet */
            <div className="flex flex-col items-center gap-5 rounded-xl border border-brand-100 bg-brand-50/60 px-8 py-16 text-center">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-12 w-12 text-brand-300"
                aria-hidden="true"
              >
                <path d="M5 3h14M5 21h14M6 3v4a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3M6 21v-4a6 6 0 0 1 6-6 6 6 0 0 1 6 6v4" />
              </svg>
              <div>
                <p className="font-display text-lg font-semibold text-brand-800">
                  {dict.categoryPage.comingSoon}
                </p>
                <p className="mt-2 max-w-md text-[14px] leading-relaxed text-brand-700/70">
                  {dict.categoryPage.comingSoonDetail}
                </p>
              </div>
            </div>
          ) : (
            <FilterableProductGrid
              products={cat.products}
              locale={locale}
              dict={dict}
              noProductsLabel={dict.categoryPage.noProducts}
            />
          )}
        </Container>
      </section>

      <CtaSection locale={locale} dict={dict} />
    </>
  );
}
