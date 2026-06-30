"use client";

import { useState, useEffect, useRef } from "react";
import type { Dictionary } from "@/i18n/dictionaries";
import { QuoteForm } from "@/components/QuoteForm";
import { BarFeederIcon, CoolantIcon, OilMistIcon, PartsIcon } from "@/components/icons";
import type { Locale } from "@/i18n/config";
import Image from "next/image";

const EQUIPMENT_ICONS: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  barfeeder: BarFeederIcon,
  coolant:   CoolantIcon,
  oilmist:   OilMistIcon,
  partscatcher: PartsIcon,
};

function CheckSmall() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3" aria-hidden>
      <path d="M3 8l3.5 3.5L13 4" />
    </svg>
  );
}
function PlusSmall() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" className="h-3 w-3" aria-hidden>
      <path d="M8 3v10M3 8h10" />
    </svg>
  );
}
function ChevLeft() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}
function ChevRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

const VISIBLE = 4;

/* imageUrl/imageAlt are optional — infrastructure ready, data not required yet */
type EquipmentItem = {
  readonly icon: string;
  readonly name: string;
  readonly imageUrl?: string;
  readonly imageAlt?: string;
};

export function ProductQuoteSection({
  optionalEquipment,
  dict,
  defaultProduct,
  productOptions,
  locale,
}: {
  optionalEquipment: ReadonlyArray<EquipmentItem>;
  dict: Dictionary;
  defaultProduct: string;
  productOptions: string[];
  locale: Locale;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const [start, setStart] = useState(0);
  const total = optionalEquipment.length;
  const canPrev = start > 0;
  const canNext = start + VISIBLE < total;

  /* Measure the rendered card slot width so translateX uses pixels, not %. */
  const trackRef = useRef<HTMLDivElement>(null);
  const [cardPx, setCardPx] = useState(0);

  useEffect(() => {
    const measure = () => {
      const first = trackRef.current?.firstElementChild as HTMLElement | null;
      if (first) setCardPx(first.offsetWidth);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const toggle = (name: string) =>
    setSelected((s) => (s.includes(name) ? s.filter((x) => x !== name) : [...s, name]));

  const equipLabel = locale === "tr" ? "Seçili Opsiyonlar" : "Selected Options";

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">

      {/* ── Left: optional equipment carousel — 7/12 cols on desktop ── */}
      <div className="lg:col-span-7 lg:self-center">
        <h3 className="font-display text-xl font-semibold text-white">
          {dict.productPage.optionalEquipmentTitle}
        </h3>
        <p className="mt-1.5 text-sm text-white/55">
          {locale === "tr"
            ? "İstediğiniz donanımları seçerek teklifinize ekleyin."
            : "Select equipment to include in your quote."}
        </p>

        {/* Overflow-hidden viewport; track translates by measured card pixel width */}
        <div className="mt-5 overflow-hidden">
          <div
            ref={trackRef}
            className="flex transition-transform duration-300 ease-in-out"
            style={cardPx > 0 ? { transform: `translateX(-${start * cardPx}px)` } : undefined}
          >
            {optionalEquipment.map((item) => {
              const Icon = EQUIPMENT_ICONS[item.icon] ?? BarFeederIcon;
              const isSelected = selected.includes(item.name);
              return (
                /* Slot: full-width on mobile, half on sm, quarter on lg */
                <div key={item.icon} className="w-full shrink-0 px-1.5 sm:w-1/2 lg:w-1/4">
                  <button
                    type="button"
                    onClick={() => toggle(item.name)}
                    className={`relative flex w-full flex-col items-center gap-3 rounded-xl border p-5 text-center transition-all duration-150 min-h-[175px] lg:min-h-[200px] ${
                      isSelected
                        ? "border-white/60 bg-white/20 text-white shadow-md"
                        : "border-white/15 bg-white/5 text-white/60 hover:border-white/35 hover:bg-white/10 hover:text-white/80"
                    }`}
                  >
                    {/* +/✓ badge */}
                    <span
                      className={`absolute right-2 top-2 flex h-[18px] w-[18px] items-center justify-center rounded-full border transition-colors ${
                        isSelected
                          ? "border-white bg-white text-brand-700"
                          : "border-white/30 text-white/50"
                      }`}
                    >
                      {isSelected ? <CheckSmall /> : <PlusSmall />}
                    </span>

                    {/* Visual: image if available, else SVG icon */}
                    <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white/10 overflow-hidden">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.imageAlt ?? item.name}
                          width={64}
                          height={64}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <Icon className="h-9 w-9" />
                      )}
                    </div>

                    <p className="text-sm font-medium leading-snug">{item.name}</p>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Arrow controls — rendered only when more items than fit on desktop */}
        {total > VISIBLE && (
          <div className="mt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStart((s) => Math.max(0, s - 1))}
              disabled={!canPrev}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/25 text-white/60 transition-all hover:border-white hover:text-white disabled:opacity-25"
              aria-label="Önceki"
            >
              <ChevLeft />
            </button>
            <span className="text-xs tabular-nums text-white/40">
              {start + 1}–{Math.min(start + VISIBLE, total)} / {total}
            </span>
            <button
              type="button"
              onClick={() => setStart((s) => Math.min(s + 1, total - VISIBLE))}
              disabled={!canNext}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/25 text-white/60 transition-all hover:border-white hover:text-white disabled:opacity-25"
              aria-label="Sonraki"
            >
              <ChevRight />
            </button>
          </div>
        )}
      </div>

      {/* ── Right: quote form — 5/12 cols on desktop ── */}
      <div className="lg:col-span-5">
        <h2 className="font-display text-2xl font-semibold text-white sm:text-3xl">
          {dict.productPage.requestQuoteTitle}
        </h2>
        <p className="mt-2 mb-6 text-sm leading-relaxed text-white/55">
          {dict.productPage.requestQuoteText}
        </p>
        <QuoteForm
          dict={dict}
          defaultProduct={defaultProduct}
          productOptions={productOptions}
          selectedOptions={selected}
          selectedOptionsLabel={equipLabel}
          dark
        />
      </div>

    </div>
  );
}
