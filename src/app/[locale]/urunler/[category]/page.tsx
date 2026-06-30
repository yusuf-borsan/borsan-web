import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { categories, getCategory } from "@/lib/products";
import { localePath, routes } from "@/lib/routes";
import { Container } from "@/components/ui";
import { Breadcrumb, CtaSection } from "@/components/sections";
import { FilterableProductGrid } from "@/components/FilterableProductGrid";

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
            <h1 className="text-[1.875rem] font-semibold leading-[1.15] tracking-[-0.01em] text-[#1F4488] sm:text-[2.25rem] lg:text-[2.625rem]">
              {cat.name[locale]}
            </h1>

            {/* Description */}
            <p className="mt-4 max-w-2xl text-[15px] leading-[1.75] text-ink-600">
              {cat.description[locale]}
            </p>

            {/* Accent line */}
            <div className="mt-6 h-[1.5px] w-32 bg-gradient-to-r from-[#1F4488]/65 to-transparent" />
          </div>

          <FilterableProductGrid
            products={cat.products}
            locale={locale}
            dict={dict}
            noProductsLabel={dict.categoryPage.noProducts}
          />
        </Container>
      </section>

      <CtaSection locale={locale} dict={dict} />
    </>
  );
}
