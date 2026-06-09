import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { categories, getCategory } from "@/lib/products";
import { localePath, routes } from "@/lib/routes";
import { Container } from "@/components/ui";
import { PageHero, CtaSection } from "@/components/sections";
import { ProductCard } from "@/components/ProductCard";

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
      <PageHero
        eyebrow={cat.tagline[locale]}
        title={cat.name[locale]}
        subtitle={cat.description[locale]}
        breadcrumb={[
          { label: dict.common.home, href: localePath(locale) },
          { label: dict.common.products, href: localePath(locale, routes.products) },
          { label: cat.name[locale] },
        ]}
      />

      <section className="bg-[#f5f7fa]">
        <Container className="py-16 lg:py-24">

          {/* Premium section heading */}
          <div className="mb-10 lg:mb-14">
            <span className="eyebrow mb-3 block text-brand-600">
              {dict.categoryPage.modelsEyebrow}
            </span>
            <h2 className="font-display text-balance text-3xl text-ink-900 sm:text-4xl">
              {cat.name[locale]}{dict.categoryPage.modelsTitleSuffix}
            </h2>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-ink-500">
              {dict.categoryPage.modelsSubtitle}
            </p>
            <div className="mt-6 h-0.5 w-12 rounded-full bg-brand-600" />
          </div>

          {cat.products.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {cat.products.map((product) => (
                <ProductCard key={product.slug} product={product} locale={locale} dict={dict} />
              ))}
            </div>
          ) : (
            <p className="mt-6 max-w-xl text-ink-500">{dict.categoryPage.noProducts}</p>
          )}
        </Container>
      </section>

      <CtaSection locale={locale} dict={dict} />
    </>
  );
}
