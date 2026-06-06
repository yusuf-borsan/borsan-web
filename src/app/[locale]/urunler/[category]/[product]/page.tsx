import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { categories, getCategory, getProduct } from "@/lib/products";
import { localePath, routes } from "@/lib/routes";
import { Container, ButtonLink } from "@/components/ui";
import { Breadcrumb } from "@/components/sections";
import { Gallery } from "@/components/Gallery";
import { ProductTabs } from "@/components/ProductTabs";
import { QuoteForm } from "@/components/QuoteForm";
import { ProductCard } from "@/components/ProductCard";
import { CheckIcon, DocIcon } from "@/components/icons";

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    categories.flatMap((cat) =>
      cat.products.map((p) => ({ locale, category: cat.slug, product: p.slug })),
    ),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string; product: string }>;
}): Promise<Metadata> {
  const { locale, category, product } = await params;
  const loc: Locale = isLocale(locale) ? locale : "tr";
  const p = getProduct(category, product);
  if (!p) return {};
  return { title: `${p.model} — ${p.name[loc]}`, description: p.summary[loc] };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; category: string; product: string }>;
}) {
  const { locale: raw, category, product } = await params;
  const locale: Locale = isLocale(raw) ? raw : "tr";
  const dict = getDictionary(locale);
  const cat = getCategory(category);
  const p = getProduct(category, product);
  if (!cat || !p) notFound();

  const related = cat.products.filter((x) => x.slug !== p.slug).slice(0, 3);

  return (
    <>
      {/* Header band */}
      <section className="relative overflow-hidden bg-ink-950 text-white">
        <div className="absolute inset-0 bg-grid opacity-60" aria-hidden />
        <Container className="relative py-10 lg:py-14">
          <Breadcrumb
            items={[
              { label: dict.common.home, href: localePath(locale) },
              { label: dict.common.products, href: localePath(locale, routes.products) },
              { label: cat.name[locale], href: localePath(locale, routes.category(cat.slug)) },
              { label: p.model },
            ]}
          />
          <div className="mt-6 flex flex-col gap-3">
            <span className="inline-flex w-fit items-center rounded-sm bg-brand-600 px-3 py-1 text-sm font-bold tracking-wide">
              {p.model}
            </span>
            <h1 className="font-display text-balance text-3xl leading-tight sm:text-4xl lg:text-5xl">{p.name[locale]}</h1>
            <p className="max-w-2xl text-lg text-steel-300">{p.summary[locale]}</p>
          </div>
        </Container>
      </section>

      {/* Main */}
      <section className="bg-white">
        <Container className="py-14 lg:py-20">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            {/* Left: gallery + highlights */}
            <div className="lg:col-span-6">
              <Gallery images={p.gallery} alt={p.name[locale]} />

              <div className="mt-10">
                <h2 className="font-display text-xl text-ink-900">{dict.common.highlights}</h2>
                <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {p.highlights.map((h) => (
                    <li key={h[locale]} className="flex items-start gap-3 rounded-md border border-ink-100 bg-steel-300/5 p-4">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white">
                        <CheckIcon className="h-4 w-4" />
                      </span>
                      <span className="text-sm leading-relaxed text-ink-700">{h[locale]}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right: specs + catalog + quote CTA */}
            <div className="lg:col-span-6">
              <div className="lg:sticky lg:top-24">
                <ProductTabs
                  specs={p.specs}
                  features={p.features ?? p.highlights}
                  locale={locale}
                  labels={{
                    specs: dict.common.technicalSpecs,
                    features: dict.common.productFeatures,
                    specsNote: dict.productPage.specsNote,
                  }}
                />

                {/* Catalog */}
                <div className="mt-6 flex items-center gap-4 rounded-md border border-ink-100 bg-steel-300/5 p-5">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm bg-brand-600/10 text-brand-600">
                    <DocIcon className="h-7 w-7" />
                  </span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-ink-900">{dict.productPage.catalogTitle}</h3>
                    <p className="text-xs text-ink-500">{dict.productPage.catalogText}</p>
                  </div>
                  <ButtonLink href={p.catalog ?? "#"} variant="ghost" size="md" className="shrink-0">
                    PDF
                  </ButtonLink>
                </div>

                <ButtonLink
                  href="#teklif"
                  variant="primary"
                  size="lg"
                  withArrow
                  className="mt-6 w-full"
                >
                  {dict.common.requestQuote}
                </ButtonLink>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Quote form */}
      <section id="teklif" className="scroll-mt-24 border-t border-ink-100 bg-steel-300/10">
        <Container className="py-16 lg:py-20">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <h2 className="font-display text-2xl text-ink-900 sm:text-3xl">
                {dict.productPage.requestQuoteTitle}
              </h2>
              <p className="mt-4 max-w-md text-base leading-relaxed text-ink-500">
                {dict.productPage.requestQuoteText}
              </p>
            </div>
            <div className="lg:col-span-7">
              <div className="rounded-md border border-ink-100 bg-white p-6 sm:p-8">
                <QuoteForm
                  dict={dict}
                  defaultProduct={p.name[locale]}
                  productOptions={cat.products.map((x) => x.name[locale])}
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="bg-white">
          <Container className="py-16 lg:py-20">
            <div className="flex items-end justify-between">
              <h2 className="font-display text-2xl text-ink-900">{dict.common.relatedProducts}</h2>
              <Link
                href={localePath(locale, routes.category(cat.slug))}
                className="text-sm font-semibold text-brand-600 hover:text-brand-700"
              >
                {cat.name[locale]}
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((rp) => (
                <ProductCard key={rp.slug} product={rp} locale={locale} dict={dict} />
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
