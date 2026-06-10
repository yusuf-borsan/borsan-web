"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import type { Locale } from "@/i18n/config";
import { localePath } from "@/lib/routes";
import { Container, Eyebrow, ButtonLink } from "./ui";

export type HeroSlide = {
  image: string;
  /** Locale-neutral path the slide's primary CTA links to (e.g. "/urunler"). */
  href: string;
  eyebrow: string;
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
};

type Props = {
  slides: HeroSlide[];
  locale: Locale;
  ctaPrimary: string;
  ctaSecondary: string;
  contactHref: string;
};

const AUTOPLAY_MS = 6500;

export function HeroCarousel({
  slides,
  locale,
  ctaPrimary,
  ctaSecondary,
  contactHref,
}: Props) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;

  const goTo = useCallback((i: number) => setActive(((i % count) + count) % count), [count]);
  const next = useCallback(() => setActive((a) => (a + 1) % count), [count]);
  const prev = useCallback(() => setActive((a) => (a - 1 + count) % count), [count]);

  useEffect(() => {
    if (paused || count <= 1) return;
    const id = setInterval(next, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused, count, next, active]);

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      {/* Background slides (cross-fade) */}
      <div className="absolute inset-0" aria-hidden>
        {slides.map((slide, i) => {
          const isPhoto = /\.(jpe?g|png|webp)$/i.test(slide.image);
          const isActive = i === active;

          // hero-main.png: rendered at natural height-fit (no zoom), right-aligned,
          // then mirrored. Because the image is ~978px wide on a ~1456px screen,
          // the left ~33% stays dark (text area) and the drill action lands at ~68%.
          if (slide.image === "/hero/hero-main.png") {
            return (
              <div
                key={slide.image + i}
                className={`absolute inset-0 overflow-hidden transition-opacity duration-700 ease-out ${
                  isActive ? "opacity-100" : "opacity-0"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={slide.image}
                  alt=""
                  className="absolute right-0 top-0 h-full w-auto"
                  style={{ transform: "scaleX(-1)" }}
                />
              </div>
            );
          }

          // All other slides (SVGs + swiss-type photo)
          return (
            <Image
              key={slide.image + i}
              src={slide.image}
              alt=""
              fill
              priority={i === 0}
              sizes="100vw"
              className={`object-cover transition-opacity duration-700 ease-out ${
                isPhoto ? "" : "mix-blend-luminosity"
              } ${isActive ? (isPhoto ? "opacity-100" : "opacity-40") : "opacity-0"}`}
              style={
                isPhoto
                  ? { objectPosition: "54% 50%", transform: "scale(1.08)" }
                  : undefined
              }
            />
          );
        })}
      </div>

      {/* Engineered grid + directional gradient (same tones as before) */}
      <div className="absolute inset-0 bg-grid opacity-60" aria-hidden />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, #0c0e13 0%, rgba(12,14,19,0.88) 42%, rgba(12,14,19,0.25) 100%)",
        }}
        aria-hidden
      />

      {/* Slide content */}
      <Container className="relative">
        <div className="grid min-h-[78vh] grid-cols-1 items-center py-20 lg:grid-cols-12 lg:py-28">
          <div className="lg:col-span-12">
            {/* key forces the fade-up animation to replay on slide change */}
            <div key={active} className="animate-fade-up">
              <Eyebrow tone="light">{slides[active].eyebrow}</Eyebrow>
              <h1 className="font-display mt-6 text-balance text-5xl leading-[0.98] sm:text-6xl lg:text-7xl xl:text-[5.5rem]">
                {slides[active].titleLine1}
                <br />
                <span className="text-brand-400">{slides[active].titleLine2}</span>
              </h1>
              <p className="mt-7 max-w-xl text-pretty text-lg leading-relaxed text-steel-300">
                {slides[active].subtitle}
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href={localePath(locale, slides[active].href)} variant="primary" size="lg" withArrow>
                  {ctaPrimary}
                </ButtonLink>
                <ButtonLink
                  href={contactHref}
                  size="lg"
                  className="bg-white/5 text-white ring-1 ring-inset ring-white/20 backdrop-blur hover:bg-white/10"
                >
                  {ctaSecondary}
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Arrows */}
      {count > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Önceki / Previous"
            className="group absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/5 text-white ring-1 ring-inset ring-white/20 backdrop-blur transition-colors hover:bg-white/15 sm:left-6 lg:h-14 lg:w-14"
          >
            <Chevron className="h-6 w-6 rotate-180" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Sonraki / Next"
            className="group absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/5 text-white ring-1 ring-inset ring-white/20 backdrop-blur transition-colors hover:bg-white/15 sm:right-6 lg:h-14 lg:w-14"
          >
            <Chevron className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Dots */}
      {count > 1 && (
        <div className="absolute bottom-8 left-0 right-0 z-10">
          <Container>
            <div className="flex items-center gap-2.5">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`${i + 1}`}
                  aria-current={i === active}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    i === active ? "w-8 bg-brand-400" : "w-2.5 bg-white/30 hover:bg-white/50"
                  }`}
                />
              ))}
            </div>
          </Container>
        </div>
      )}
    </div>
  );
}

function Chevron({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M9 5l7 7-7 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
