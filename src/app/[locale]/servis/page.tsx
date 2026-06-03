import type { Metadata } from "next";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { localePath, routes } from "@/lib/routes";
import { Container, ButtonLink } from "@/components/ui";
import { PageHero } from "@/components/sections";
import {
  CommissionIcon,
  ShieldIcon,
  DocIcon,
  ConsultIcon,
  PrecisionIcon,
  CheckIcon,
} from "@/components/icons";

const ICONS = [CommissionIcon, ShieldIcon, DocIcon, ConsultIcon, PrecisionIcon, CheckIcon];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : "tr");
  return { title: dict.service.title };
}

export default async function ServicePage({
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
        eyebrow={dict.service.eyebrow}
        title={dict.service.title}
        subtitle={dict.service.intro}
        breadcrumb={[
          { label: dict.common.home, href: localePath(locale) },
          { label: dict.service.eyebrow },
        ]}
      />

      <section className="bg-white">
        <Container className="py-16 lg:py-24">
          {/* Important note */}
          <div className="flex items-start gap-4 rounded-md border-l-4 border-brand-600 bg-brand-50 p-6">
            <ShieldIcon className="h-7 w-7 shrink-0 text-brand-600" />
            <p className="text-sm font-medium leading-relaxed text-brand-900 sm:text-base">
              {dict.service.note}
            </p>
          </div>

          {/* Service grid */}
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {dict.service.items.map((item, i) => {
              const Icon = ICONS[i % ICONS.length];
              return (
                <div
                  key={item.title}
                  className="group rounded-md border border-ink-100 bg-white p-7 transition-colors hover:border-brand-200"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-sm bg-brand-600/10 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                    <Icon className="h-8 w-8" />
                  </span>
                  <h3 className="font-display mt-6 text-lg text-ink-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-500">{item.text}</p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Service CTA */}
      <section className="relative overflow-hidden bg-ink-950 text-white">
        <div className="absolute inset-0 bg-grid opacity-60" aria-hidden />
        <Container className="relative py-16 lg:py-20">
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <h2 className="font-display text-3xl leading-tight sm:text-4xl">{dict.service.ctaTitle}</h2>
              <p className="mt-4 text-base leading-relaxed text-steel-300">{dict.service.ctaText}</p>
            </div>
            <ButtonLink
              href={localePath(locale, routes.contact)}
              variant="primary"
              size="lg"
              withArrow
              className="shrink-0"
            >
              {dict.common.callUs}
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
