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
import { ProductDetailTabs } from "@/components/ProductTabs";
import { VideoCard } from "@/components/VideoCard";
import { ProductQuoteSection } from "@/components/ProductQuoteSection";
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
  const highlights = p.highlights.slice(0, 4);
  const videoLabel = locale === "tr" ? "Ürün Videosu" : "Product Video";

  return (
    <>
      {/* ── Product hero (white) ── */}
      <section className="bg-white">

        {/* Compact breadcrumb bar */}
        <div className="border-b border-ink-100">
          <Container className="py-3">
            <Breadcrumb
              variant="light"
              items={[
                { label: dict.common.home, href: localePath(locale) },
                { label: dict.common.products, href: localePath(locale, routes.products) },
                { label: cat.name[locale], href: localePath(locale, routes.category(cat.slug)) },
                { label: p.model },
              ]}
            />
          </Container>
        </div>

        {/* 2-column product intro */}
        <Container className="py-10 lg:py-14">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">

            {/* Left: Gallery */}
            <div className="lg:col-span-7">
              <Gallery images={p.gallery} alt={p.name[locale]} />
            </div>

            {/* Right: product info */}
            <div className="lg:col-span-5">
              <div className="flex flex-col gap-4 lg:sticky lg:top-24">

                {/* Category + model badge */}
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={localePath(locale, routes.category(cat.slug))}
                    className="text-xs font-medium text-ink-500 transition-colors hover:text-brand-600"
                  >
                    {cat.name[locale]}
                  </Link>
                  <span className="text-ink-300">/</span>
                  <span className="inline-flex items-center rounded-sm bg-brand-600 px-2.5 py-0.5 text-xs font-bold tracking-wide text-white">
                    {p.model}
                  </span>
                </div>

                {/* Product title — brand navy, medium weight */}
                <h1 className="font-display text-2xl font-medium leading-tight text-brand-700 sm:text-[1.75rem]">
                  {p.name[locale]}
                </h1>

                {/* Summary */}
                <p className="text-sm leading-relaxed text-ink-500">{p.summary[locale]}</p>

                {/* Top 4 highlights */}
                {highlights.length > 0 && (
                  <ul className="mt-1 flex flex-col gap-2">
                    {highlights.map((h) => (
                      <li key={h[locale]} className="flex items-start gap-2.5">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white">
                          <CheckIcon className="h-3.5 w-3.5" />
                        </span>
                        <span className="text-sm leading-relaxed text-ink-700">{h[locale]}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-1 h-px bg-ink-100" />

                {/* Catalog download */}
                <div className="flex items-center gap-4 rounded-md border border-ink-100 bg-white p-4 shadow-sm">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-brand-600/10 text-brand-600">
                    <DocIcon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-ink-900">{dict.productPage.catalogTitle}</h3>
                    <p className="text-xs text-ink-500">{dict.productPage.catalogText}</p>
                  </div>
                  <ButtonLink href={p.catalog ?? "#"} variant="ghost" size="md" className="shrink-0">
                    PDF
                  </ButtonLink>
                </div>

                {/* Video card */}
                <VideoCard
                  url={p.videoUrl}
                  title={videoLabel}
                  subtitle={locale === "tr" ? "İzlemek için tıklayın" : "Click to watch"}
                />

                {/* Quote CTA */}
                <ButtonLink href="#teklif" variant="primary" size="lg" withArrow className="w-full">
                  {dict.common.requestQuote}
                </ButtonLink>

              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Tabbed specs section ── */}
      <section id="teknik-ozellikler" className="bg-[#f5f7fa]">
        <Container className="py-12 lg:py-16">
          <ProductDetailTabs
            specs={p.specs}
            features={p.features ?? p.highlights}
            locale={locale}
            labels={{
              specs: dict.common.technicalSpecs,
              features: dict.common.productFeatures,
              specsNote: dict.productPage.specsNote,
            }}
          />
        </Container>
      </section>

      {/* ── Full-width dark quote section ── */}
      <section
        id="teklif"
        className="scroll-mt-24 bg-ink-950"
        style={{ background: "linear-gradient(135deg, #0b1a2e 0%, #1F4488 100%)" }}
      >
        <Container className="py-16 lg:py-20">
          <ProductQuoteSection
            optionalEquipment={dict.productPage.optionalEquipment}
            dict={dict}
            defaultProduct={p.name[locale]}
            productOptions={cat.products.map((x) => x.name[locale])}
            locale={locale}
          />
        </Container>
      </section>

      {/* ── Related products ── */}
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
