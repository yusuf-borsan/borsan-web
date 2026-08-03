import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { localePath } from "@/lib/routes";
import { Container, ButtonLink, HeroContentBlock } from "@/components/ui";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { ServiceModules } from "./ServiceModules";
import { ServiceForm } from "./ServiceForm";

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

  // Hero title on three lines (top → bottom): first word (blue, like
  // "Endüstriyel Gücü" on the home hero), second word, then the rest.
  // TR: "Teknik" / "Servis" / "ve Destek".
  const titleWords = dict.service.title.split(" ");
  const serviceTitle = (
    <>
      <span className="text-brand-400">{titleWords[0]}</span>
      {titleWords[1] ? (
        <>
          <br />
          {titleWords[1]}
        </>
      ) : null}
      {titleWords.length > 2 ? (
        <>
          <br />
          {titleWords.slice(2).join(" ")}
        </>
      ) : null}
    </>
  );

  return (
    <>
      {/* ── Split Hero — top-aligned so the title sits at the same height in
           TR and EN and matches the investment hero. ── */}
      <section className="relative min-h-dvh overflow-hidden bg-ink-950 text-white">
        {/* Right-half background image */}
        <div className="absolute inset-y-0 right-0 hidden w-[50%] lg:block">
          <Image
            src="/hero/servis-4k-hd.png"
            alt="Borsan servis ekibi"
            fill
            className="object-cover object-center"
            unoptimized
            style={{ filter: "brightness(1.08) saturate(1.05)" }}
          />
          {/* Blend: ink-950 fades in from the left edge of the image */}
          <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/50 to-ink-950/10" />
          {/* Bottom fade */}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-ink-950 to-transparent" />
        </div>

        <Container className="relative py-16 sm:py-20 lg:py-28">
          <div className="w-full lg:max-w-[52%] lg:pr-6">
            {/* Breadcrumb */}
            <nav
              aria-label="breadcrumb"
              className="mb-6 flex items-center gap-2 text-[11.5px] font-medium text-steel-400"
            >
              <Link
                href={localePath(locale)}
                className="transition-colors hover:text-white"
              >
                {dict.common.home}
              </Link>
              <span aria-hidden="true" className="text-steel-600">/</span>
              <span className="text-steel-300">{dict.service.eyebrow}</span>
            </nav>

            {/* Hero heading — shared HeroContentBlock (same as the home hero) */}
            <HeroContentBlock
              eyebrow={dict.service.eyebrow}
              title={serviceTitle}
              subtitle={dict.service.intro}
            >
              <ButtonLink
                href="#servis-formu"
                variant="primary"
                size="lg"
                withArrow
              >
                {dict.service.ctaCta}
              </ButtonLink>
            </HeroContentBlock>
          </div>
        </Container>
      </section>

      {/* ── Dark unified block: note band + service modules ── */}
      <section className="relative bg-ink-950">
        {/* Right-side glow — z-index above the opaque dark card panels */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            zIndex: 2,
            background:
              "radial-gradient(ellipse 46rem 80rem at 101% 44%, rgba(31,68,136,0.35) 0%, rgba(31,68,136,0.32) 7%, rgba(31,68,136,0.28) 14%, rgba(31,68,136,0.23) 22%, rgba(31,68,136,0.18) 31%, rgba(31,68,136,0.13) 41%, rgba(31,68,136,0.09) 51%, rgba(31,68,136,0.05) 61%, rgba(31,68,136,0.03) 70%, rgba(31,68,136,0.01) 78%, rgba(31,68,136,0.003) 84%, transparent 90%)",
          }}
        />

        {/* Note band — integrated dark info strip */}
        <div className="relative">
          <Container className="py-4">
            <RevealOnScroll>
              <p className="border-l border-brand-500/40 pl-4 text-[13px] leading-relaxed text-steel-400">
                {dict.service.note}
              </p>
            </RevealOnScroll>
          </Container>
        </div>

        {/* Service modules — full viewport width */}
        <RevealOnScroll>
          <ServiceModules items={dict.service.items} />
        </RevealOnScroll>
      </section>

      {/* ── CTA + Form ── */}
      <section id="servis-formu" className="relative scroll-mt-[var(--header-height)] overflow-hidden bg-ink-950">
        <Container className="relative py-16 lg:py-24">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
            <RevealOnScroll>
              <div className="text-white">
                <p className="eyebrow text-brand-400">{dict.service.eyebrow}</p>
                <h2 className="font-display mt-3 text-[1.875rem] leading-tight text-white sm:text-[2.25rem]">
                  {dict.service.ctaTitle}
                </h2>
                <p className="mt-4 text-[0.9375rem] leading-relaxed text-steel-300">
                  {dict.service.ctaText}
                </p>
              </div>
            </RevealOnScroll>
            <RevealOnScroll delay={100}>
              <ServiceForm dict={dict} />
            </RevealOnScroll>
          </div>
        </Container>
      </section>
    </>
  );
}
