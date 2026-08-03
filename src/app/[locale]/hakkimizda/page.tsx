import type { Metadata } from "next";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { Container, Eyebrow } from "@/components/ui";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { AboutVideoBg } from "./AboutVideoBg";

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
      {/* ── Hero — video plays ONLY here, behind the logo ── */}
      <section className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-ink-950 text-white">
        {/* Layer 1 — background video (hero only; desktop + motion; contained) */}
        <AboutVideoBg />

        {/* Layer 2 — dark overlay for title readability; fades to solid ink-950
            at the bottom so the hero meets the copy section seamlessly. Keeps
            the footage visible without drowning it. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink-950/60 via-ink-950/55 to-ink-950"
        />
        {/* Soft central darkening so the white logo keeps contrast over brighter
            frames — a gentle vignette, not a panel. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(46rem 34rem at 50% 44%, rgba(4,7,12,0.45) 0%, rgba(4,7,12,0.18) 48%, transparent 72%)",
          }}
        />

        {/* Layer 3 — soft blue glow (premium light, not neon) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(60rem 42rem at 50% 42%, rgba(31,68,136,0.24) 0%, rgba(31,68,136,0.08) 44%, transparent 68%)",
          }}
        />

        {/* No z-index here: the content still paints above the video (it comes
            later in the DOM), but staying in the same stacking context lets the
            logo's mix-blend-mode composite against the video/overlay behind it. */}
        <Container className="relative">
          {/* Logo (transparent white PNG, used as-is) + welcome, tightly stacked
              and centered. */}
          <div className="flex flex-col items-center text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/borsan-logo.png"
              alt="Borsan Teknoloji"
              className="h-auto"
              style={{ width: "clamp(230px, 34vw, 500px)" }}
            />
            <p className="mt-3 text-base font-normal tracking-[0.15em] text-white/85 sm:mt-4 sm:text-lg">
              {dict.about.welcome}
            </p>
          </div>
        </Container>
      </section>

      {/* ── About copy — plain navy, NO video; flows into the ink-950 footer ── */}
      <section className="relative overflow-hidden bg-ink-950 text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(52rem 40rem at 100% 0%, rgba(31,68,136,0.12) 0%, transparent 60%)",
          }}
        />
        <Container className="relative py-20 sm:py-24 lg:py-28">
          <div className="mx-auto max-w-[52rem]">
            <RevealOnScroll>
              <Eyebrow tone="light">{dict.about.eyebrow}</Eyebrow>
            </RevealOnScroll>
            <div className="mt-8 space-y-6 sm:space-y-7">
              {dict.about.body.map((paragraph, i) => (
                <RevealOnScroll key={i} delay={i * 80}>
                  <p className="text-pretty text-[15px] leading-[1.85] text-steel-200 sm:text-base">
                    {paragraph}
                  </p>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
