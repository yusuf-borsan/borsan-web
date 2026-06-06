import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { categories } from "@/lib/products";
import { localePath, routes } from "@/lib/routes";
import { Container, Arrow } from "@/components/ui";
import { CategoryIcon } from "@/components/icons";
import { PageHero, CtaSection } from "@/components/sections";

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

  return (
    <>
      <PageHero
        eyebrow={dict.productsPage.eyebrow}
        title={dict.productsPage.title}
        subtitle={dict.productsPage.subtitle}
        breadcrumb={[
          { label: dict.common.home, href: localePath(locale) },
          { label: dict.common.products },
        ]}
      />

      <section className="bg-white">
        <Container className="py-16 lg:py-24">
          <div className="flex flex-col gap-10">
            {categories.map((cat, i) => (
              <Link
                key={cat.slug}
                id={cat.slug}
                href={localePath(locale, routes.category(cat.slug))}
                className="group grid scroll-mt-28 grid-cols-1 overflow-hidden rounded-md border border-ink-100 bg-white transition-all duration-300 hover:border-brand-200 hover:shadow-[0_24px_50px_-30px_rgba(20,23,29,0.45)] lg:grid-cols-12"
              >
                <div className={`relative aspect-[16/10] overflow-hidden bg-ink-950 lg:col-span-5 lg:aspect-auto ${i % 2 === 1 ? "lg:order-2" : ""}`}>
                  <Image
                    src={cat.image}
                    alt={cat.name[locale]}
                    fill
                    sizes="(max-width: 1024px) 100vw, 42vw"
                    className="object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-5 top-5 flex h-12 w-12 items-center justify-center rounded-sm bg-brand-600/90 text-white ring-1 ring-white/10 backdrop-blur">
                    <CategoryIcon name={cat.icon} className="h-7 w-7" />
                  </span>
                </div>
                <div className="flex flex-col justify-center gap-4 p-8 lg:col-span-7 lg:p-12">
                  <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
                    <span>
                      {cat.products.length} {dict.common.machineCount}
                    </span>
                  </div>
                  <h2 className="font-display text-2xl leading-tight text-ink-900 sm:text-3xl">
                    {cat.name[locale]}
                  </h2>
                  <p className="max-w-xl text-base leading-relaxed text-ink-500">
                    {cat.description[locale]}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {cat.products.map((p) => (
                      <span
                        key={p.slug}
                        className="rounded-sm bg-steel-300/20 px-3 py-1 text-xs font-semibold text-ink-600"
                      >
                        {p.model}
                      </span>
                    ))}
                  </div>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-600">
                    {dict.common.exploreCategory}
                    <Arrow />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <CtaSection locale={locale} dict={dict} />
    </>
  );
}
