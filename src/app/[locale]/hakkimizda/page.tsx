import type { Metadata } from "next";
import Image from "next/image";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { localePath } from "@/lib/routes";
import { Container, Eyebrow } from "@/components/ui";
import { PageHero, CtaSection } from "@/components/sections";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : "tr");
  return { title: dict.about.title };
}

export default async function AboutPage({
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
        eyebrow={dict.about.eyebrow}
        title={dict.about.title}
        subtitle={dict.about.intro}
        breadcrumb={[
          { label: dict.common.home, href: localePath(locale) },
          { label: dict.about.eyebrow },
        ]}
      />

      {/* Mission / Vision */}
      <section className="bg-white">
        <Container className="py-16 lg:py-24">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {[
              { title: dict.about.missionTitle, text: dict.about.missionText },
              { title: dict.about.visionTitle, text: dict.about.visionText },
            ].map((b) => (
              <div key={b.title} className="rounded-md border border-ink-100 bg-steel-300/5 p-8 lg:p-10">
                <span className="font-display text-5xl text-brand-200">”</span>
                <h2 className="font-display mt-2 text-2xl text-ink-900">{b.title}</h2>
                <p className="mt-4 text-base leading-relaxed text-ink-600">{b.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Values */}
      <section className="relative overflow-hidden bg-ink-900 text-white">
        <div className="absolute inset-0 bg-grid opacity-70" aria-hidden />
        <Container className="relative py-16 lg:py-24">
          <Eyebrow tone="light">{dict.about.valuesTitle}</Eyebrow>
          <div className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-md border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {dict.about.values.map((v, i) => (
              <div key={v.title} className="bg-ink-900 p-8">
                <div className="font-display text-3xl text-brand-400">0{i + 1}</div>
                <h3 className="font-display mt-4 text-lg text-white">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-steel-400">{v.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Stats */}
      <section className="bg-white">
        <Container className="py-16 lg:py-20">
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-ink-100 bg-ink-100 lg:grid-cols-4">
            {dict.about.stats.map((s) => (
              <div key={s.label} className="bg-white p-8 text-center">
                <div className="font-display text-4xl text-brand-600 sm:text-5xl">{s.value}</div>
                <div className="mt-2 text-sm text-ink-500">{s.label}</div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <CtaSection locale={locale} dict={dict} />
    </>
  );
}
