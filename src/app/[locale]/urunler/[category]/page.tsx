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

      <section className="bg-white">
        <Container className="py-16 lg:py-24">
          <h2 className="font-display text-2xl text-ink-900">{dict.categoryPage.modelsTitle}</h2>
          {cat.products.length > 0 ? (
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
