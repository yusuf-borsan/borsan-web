'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import { localePath, routes } from '@/lib/routes';
import { Container, Arrow } from '@/components/ui';

/* ── Portfolio groups ──────────────────────────────────────────────────── */

const portfolioGroups = [
  {
    categorySlug: 'cnc-dik-isleme-merkezleri',
    name: { tr: 'CNC Dik İşleme Merkezleri', en: 'CNC Vertical Machining Centers' },
    seriesLabel: { tr: 'FV-A / FV-HD Serisi', en: 'FV-A / FV-HD Series' },
    description: {
      tr: 'Hassas kalıp, gövde ve parça işleme için geniş tabla aralığı sunan FALCO dik işleme merkezleri. Kompakt yapıdan ağır hizmet kapasitesine uzanan seçenekler, farklı üretim ölçeği ve iş parçası boyutlarına yanıt verir.',
      en: 'FALCO vertical machining centers offering wide table ranges for precise mold, housing and part machining. Options spanning compact to heavy-duty capacity cover diverse production scales and workpiece sizes.',
    },
    exampleModels: 'FV-A745 · FV-HD855 · FV-HD1470',
    image: '/machines/cnc-dik-isleme-merkezleri/falco-fv-hd1470-1.png',
    imageAlt: { tr: 'FALCO FV-HD1470 CNC Dik İşleme Merkezi', en: 'FALCO FV-HD1470 CNC Vertical Machining Center' },
  },
  {
    categorySlug: 'cnc-tornalar',
    name: { tr: 'CNC Yatay Tornalar', en: 'CNC Horizontal Lathes' },
    seriesLabel: { tr: 'FALCO / DONGS · Standart – Süper Ağır Hizmet', en: 'FALCO / DONGS · Standard to Super Heavy-Duty' },
    description: {
      tr: 'Mil, flanş, boru ve genel talaşlı imalat parçaları için kapsamlı bir CNC yatay tornalama portföyü. Kompakt tezgahtan süper ağır tipe kadar değişen kızak uzunluğu ve iş mili kapasitesi alternatifleri mevcuttur.',
      en: 'A comprehensive CNC horizontal turning portfolio for shafts, flanges, tubes and general machined parts. Alternatives from compact to super heavy-duty with varying guideway lengths and spindle capacities available.',
    },
    exampleModels: 'FALCO CK6152 · FALCO CK61125B · DONGS TCK700',
    image: '/machines/cnc-tornalar/dongs-tck700-1.png',
    imageAlt: { tr: 'DONGS TCK700 CNC Yatay Torna', en: 'DONGS TCK700 CNC Horizontal Lathe' },
  },
  {
    categorySlug: 'dik-tornalar',
    name: { tr: 'Dik Tornalar', en: 'Vertical Turning Lathes' },
    seriesLabel: { tr: 'FALCO FL / HDMT VL · 125 – 1600 mm Planşet', en: 'FALCO FL / HDMT VL · 125–1600 mm Faceplate' },
    description: {
      tr: 'Disk, flanş, ring ve büyük çaplı gövde parçalarının CNC tornalamasına yönelik dik torna (VTL) çözümleri. Yüksek tabla yük kapasitesi ve opsiyonel ATC ile ağır sanayi uygulamalarında verimli ve kararlı işleme sağlar.',
      en: 'Vertical turning lathe (VTL) solutions for CNC turning of disc, flange, ring and large-diameter housing parts. High table load capacity and optional ATC deliver efficient, stable machining in heavy-industry applications.',
    },
    exampleModels: 'FALCO CK518 · FALCO FL-125M · HDMT VL-125M',
    image: '/machines/dik-tornalar/falco-fl-1600m-1.png',
    imageAlt: { tr: 'FALCO FL-1600M Dik Torna', en: 'FALCO FL-1600M Vertical Turning Lathe' },
  },
  {
    categorySlug: 'cnc-disli-taslama-tezgahlari',
    name: { tr: 'CNC Dişli Taşlama', en: 'CNC Gear Grinding' },
    seriesLabel: { tr: 'Dış Dişli / İç Dişli / Büyük Çap', en: 'External / Internal / Large Diameter' },
    description: {
      tr: 'Dış ve iç dişli, büyük çaplı dişliler ile ağır iş parçaları için yüksek hassasiyetli CNC dişli taşlama tezgahları. DIN/ISO kalite sınıflarını karşılayan form ve jeneratris taşlama yöntemlerini destekler.',
      en: 'High-precision CNC gear grinding machines for external and internal gears, large-diameter gears and heavy workpieces. Supports form and generating grinding methods meeting DIN/ISO quality classes.',
    },
    exampleModels: 'YKS7226 · YK73125A · YK75200',
    image: '/machines/cnc-disli-taslama-tezgahlari/qcmt-yk75200-1.png',
    imageAlt: { tr: 'QCMT YK75200 CNC Dişli Taşlama Tezgahı', en: 'QCMT YK75200 CNC Gear Grinding Machine' },
  },
  {
    categorySlug: 'universal-tornalar',
    name: { tr: 'Universal Tornalar', en: 'Universal Lathes' },
    seriesLabel: { tr: 'Atölye / Bakım-Onarım / Eğitim', en: 'Workshop / Maintenance / Training' },
    description: {
      tr: 'Bakım-onarım atölyeleri, küçük ölçekli talaşlı imalat ve mesleki eğitim uygulamaları için güvenilir universal torna seçenekleri. Uzun ömürlü mekanik yapı, geniş devir aralığı ve kullanım kolaylığı ön planda tutulur.',
      en: 'Reliable universal lathe options for maintenance workshops, small-scale machining and vocational training. Durable mechanical structure, wide speed range and ease of use are prioritized.',
    },
    exampleModels: 'CW6180B · CW61160 · CW61180',
    image: '/machines/universal-tornalar/falco-cw6180b-cw61110q-cw61125q-1.png',
    imageAlt: { tr: 'FALCO CW6180B Universal Torna', en: 'FALCO CW6180B Universal Lathe' },
  },
  {
    categorySlug: 'cnc-kayar-otomatlar',
    name: { tr: 'CNC Kayar Otomatlar', en: 'CNC Swiss Type Lathes' },
    seriesLabel: { tr: 'Çok Eksenli · Kılavuz Burç Teknolojisi', en: 'Multi-Axis · Guide Bushing Technology' },
    description: {
      tr: 'Tıbbi, elektronik, otomotiv ve bağlantı elemanı sektörlerine yönelik CNC kayar otomat (Swiss type) çözümleri. Kılavuz burç teknolojisiyle ince ve uzun parçaları titreşimsiz, tek bağlamada komple işler.',
      en: 'CNC Swiss-type lathe solutions for medical, electronics, automotive and fastener industries. Guide-bushing technology machines thin, long parts vibration-free in a single setup.',
    },
    exampleModels: 'MA25-6S · MA25-5II · DT38-5II',
    image: '/machines/swiss-type/ma25-6s-1.png',
    imageAlt: { tr: 'MA25-6S CNC Kayar Otomat', en: 'MA25-6S CNC Swiss Type Lathe' },
  },
] satisfies {
  categorySlug: string;
  name: { tr: string; en: string };
  seriesLabel: { tr: string; en: string };
  description: { tr: string; en: string };
  exampleModels: string;
  image: string;
  imageAlt: { tr: string; en: string };
}[];

/* ── Easing constants — match globals.css reveal animation exactly ──────── */
const EASE_IN  = 'opacity 0.2s ease-in, transform 0.2s ease-in';
const EASE_OUT = 'opacity 0.6s ease-out, transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)';

/* ── NavArrow ─────────────────────────────────────────────────────────── */

function NavArrow({
  direction,
  onClick,
  label,
}: {
  direction: 'prev' | 'next';
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-brand-600 text-brand-600 transition-colors duration-200 hover:bg-brand-600 hover:text-white"
    >
      <svg viewBox="0 0 18 18" className="h-4 w-4" fill="none" aria-hidden>
        {direction === 'prev' ? (
          <path d="M11.5 3.5L6.5 9L11.5 14.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <path d="M6.5 3.5L11.5 9L6.5 14.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        )}
      </svg>
    </button>
  );
}

/* ── Component ─────────────────────────────────────────────────────────── */

export function ProductPortfolioSection({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [visible, setVisible]     = useState(true);

  /* Prevent overlapping transitions on rapid clicks */
  const isTransitioning = useRef(false);
  const timerRef        = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  /* Scroll-reveal ref — repeats on every scroll-in, instant reset on scroll-out */
  const revealRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = revealRef.current;
    if (!el) return;

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) { el.classList.add('reveal-visible'); return; }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('reveal-visible');
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -8% 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  /* Cleanup pending timer on unmount */
  useEffect(() => () => clearTimeout(timerRef.current), []);

  const handleGroupChange = (idx: number) => {
    if (idx === activeIdx || isTransitioning.current) return;
    isTransitioning.current = true;
    setVisible(false);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setActiveIdx(idx);
      setVisible(true);
      isTransitioning.current = false;
    }, 220); // just after the 200ms ease-in fade-out completes
  };

  const prev = () =>
    handleGroupChange((activeIdx - 1 + portfolioGroups.length) % portfolioGroups.length);
  const next = () =>
    handleGroupChange((activeIdx + 1) % portfolioGroups.length);

  const group      = portfolioGroups[activeIdx];
  const total      = portfolioGroups.length;
  const prevLabel  = locale === 'tr' ? 'Önceki grup' : 'Previous group';
  const nextLabel  = locale === 'tr' ? 'Sonraki grup' : 'Next group';

  /* Inline styles matching scroll-reveal easing exactly */
  const textStyle: React.CSSProperties = {
    opacity:    visible ? 1 : 0,
    transform:  visible ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.98)',
    transition: visible ? EASE_OUT : EASE_IN,
    willChange: 'opacity, transform',
  };
  const imgStyle: React.CSSProperties = {
    opacity:    visible ? 1 : 0,
    transition: visible ? 'opacity 0.55s ease-out' : 'opacity 0.2s ease-in',
  };

  return (
    /* Section is relative — arrows are absolute at its left/right edges */
    <section className="relative overflow-hidden bg-white">

      {/* ── Left arrow — pinned at section left edge, desktop ── */}
      <div className="absolute inset-y-0 left-2 z-10 hidden items-center lg:flex xl:left-4">
        <NavArrow direction="prev" onClick={prev} label={prevLabel} />
      </div>

      {/* ── Right arrow — pinned at section right edge, desktop ── */}
      <div className="absolute inset-y-0 right-2 z-10 hidden items-center lg:flex xl:right-4">
        <NavArrow direction="next" onClick={next} label={nextLabel} />
      </div>

      <Container className="py-20 lg:py-28">

        {/* Scroll-reveal wrapper — uses existing globals.css classes, repeats every scroll */}
        <div ref={revealRef} className="reveal-on-scroll">

          {/* ── Main 2-col grid ── */}
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[5fr_6fr] lg:items-center lg:gap-0">

            {/* ── Left: text content ── */}
            <div className="flex flex-col lg:pr-14">

              {/* Eyebrow only — no static heading */}
              <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-brand-500">
                {locale === 'tr' ? 'Ürün Portföyü' : 'Product Portfolio'}
              </span>

              {/* Group content — animates on group change */}
              <div style={textStyle}>

                {/* Series label */}
                <span className="mt-4 block text-[10.5px] font-semibold uppercase tracking-[0.13em] text-brand-400">
                  {group.seriesLabel[locale]}
                </span>

                {/* Active group name — hero heading */}
                <h2 className="mt-2 font-display text-[2rem] font-bold leading-tight text-brand-700 lg:text-[2.5rem]">
                  {group.name[locale]}
                </h2>

                {/* Description */}
                <p className="mt-4 text-[0.9375rem] leading-[1.75] text-ink-500">
                  {group.description[locale]}
                </p>

                {/* Models line */}
                <p className="mt-4 text-[12.5px] font-medium text-ink-600">
                  <span className="mr-1 text-ink-400">
                    {locale === 'tr' ? 'Örnek modeller:' : 'Models:'}
                  </span>
                  {group.exampleModels}
                </p>

                {/* CTA */}
                <div className="mt-7">
                  <Link
                    href={localePath(locale, routes.category(group.categorySlug))}
                    className="inline-flex items-center gap-2 rounded bg-brand-600 px-5 py-2.5 text-[13.5px] font-medium text-white transition-colors duration-200 hover:bg-brand-700"
                  >
                    {dict.common.exploreCategory}
                    <Arrow />
                  </Link>
                </div>

                {/* Slide counter */}
                <p className="mt-7 text-[12px] font-medium tabular-nums text-ink-400">
                  {String(activeIdx + 1).padStart(2, '0')}
                  <span className="mx-1 text-ink-200">/</span>
                  {String(total).padStart(2, '0')}
                </p>
              </div>
            </div>

            {/* ── Right: product image — no frame, floating ── */}
            <div style={imgStyle}>
              <div className="relative aspect-[4/3]">
                <Image
                  src={group.image}
                  alt={group.imageAlt[locale]}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain mix-blend-multiply"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Mobile arrows + counter ── */}
        <div className="mt-8 flex items-center gap-4 lg:hidden">
          <NavArrow direction="prev" onClick={prev} label={prevLabel} />
          <span className="text-[12px] font-medium tabular-nums text-ink-400">
            {String(activeIdx + 1).padStart(2, '0')}
            <span className="mx-1 text-ink-200">/</span>
            {String(total).padStart(2, '0')}
          </span>
          <NavArrow direction="next" onClick={next} label={nextLabel} />
        </div>

      </Container>
    </section>
  );
}
