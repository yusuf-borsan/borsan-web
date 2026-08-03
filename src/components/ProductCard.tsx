import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Product } from "@/lib/products";
import { localePath, routes } from "@/lib/routes";
import { Arrow } from "./ui";

/* ─── Spec chip extraction ───────────────────────────────────────────────── */

type SpecKind = "diameter" | "axes" | "control" | "speed";
type SpecChip = { text: string; kind: SpecKind };

function getKeySpecs(product: Product, locale: Locale): SpecChip[] {
  const chips: SpecChip[] = [];

  // 1. Diameter or bar capacity (must contain "Ø" in value to avoid text-only labels)
  const diamSpec = product.specs.find(
    (s) =>
      (s.label.tr.includes("Çap") && s.value.tr.includes("Ø")) ||
      s.label.tr === "Maks. Bar Kapasitesi",
  );
  if (diamSpec) chips.push({ text: diamSpec.value[locale], kind: "diameter" });

  // 2. Axis count (exact label match — avoids "X Ekseni Strok" etc.)
  const axisSpec = product.specs.find(
    (s) => s.label.tr === "Eksen Sayısı" || s.label.en === "Number of Axes",
  );
  if (axisSpec) {
    // "7 eksen (X1, Y1, Z1…)" → "7 Eksen" / "7 Axes"
    const short = axisSpec.value[locale].replace(/\s*\([^)]*\)/, "").trim();
    chips.push({ text: short, kind: "axes" });
  } else {
    // Fallback: spindle speed
    const speedSpec = product.specs.find((s) => s.label.tr.includes("İş Mili Dev"));
    if (speedSpec) chips.push({ text: speedSpec.value[locale], kind: "speed" });
  }

  // 3. Control system (abbreviated — strip channel suffix)
  const ctrlSpec = product.specs.find((s) => s.label.tr === "Kontrol Ünitesi");
  if (ctrlSpec) {
    const raw = ctrlSpec.value[locale].replace(/\s*\([^)]*\)/, "").trim();
    const parts = raw.split(" ");
    chips.push({
      text: parts.length > 2 ? parts.slice(0, 2).join(" ") : raw,
      kind: "control",
    });
  }

  return chips;
}

/* ─── Micro icons (inline SVG — no extra dependency) ───────────────────── */

function DiameterIcon() {
  return (
    <svg viewBox="0 0 14 14" className="h-3 w-3 shrink-0" fill="none" aria-hidden>
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" />
      <line x1="3.2" y1="7" x2="10.8" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function AxesIcon() {
  return (
    <svg viewBox="0 0 14 14" className="h-3 w-3 shrink-0" fill="none" aria-hidden>
      <line x1="7" y1="1.5" x2="7" y2="12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="1.5" y1="7" x2="12.5" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="3.2" y1="3.2" x2="10.8" y2="10.8" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.55" />
    </svg>
  );
}

function ControlIcon() {
  return (
    <svg viewBox="0 0 14 14" className="h-3 w-3 shrink-0" fill="none" aria-hidden>
      <rect x="1.5" y="3.5" width="11" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="4.2" cy="7" r="0.9" fill="currentColor" />
      <circle cx="7" cy="7" r="0.9" fill="currentColor" />
      <circle cx="9.8" cy="7" r="0.9" fill="currentColor" />
    </svg>
  );
}

function SpeedIcon() {
  return (
    <svg viewBox="0 0 14 14" className="h-3 w-3 shrink-0" fill="none" aria-hidden>
      <path d="M2.2 10.5 A5.5 5.5 0 0 1 11.8 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="7" y1="10.5" x2="9.8" y2="4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/* ─── ProductCard ─────────────────────────────────────────────────────────── */

export function ProductCard({
  product,
  locale,
  dict,
}: {
  product: Product;
  locale: Locale;
  dict: Dictionary;
}) {
  const href = localePath(locale, routes.product(product.categorySlug, product.slug));
  const chips = getKeySpecs(product, locale);

  const isFVASeries = product.model?.startsWith("FV-A");

  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-[3px] border border-[#E5E7EB] bg-white shadow-[0_1px_4px_rgba(20,23,29,0.06),0_0_0_1px_rgba(20,23,29,0.02)] transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-[0_6px_24px_-4px_rgba(20,23,29,0.13)]"
    >
      {/* ── Image area ── */}
      <div className={`relative aspect-[16/11] overflow-hidden ${isFVASeries ? "bg-[#f5f5f5]" : "bg-white"}`}>
        <Image
          src={product.image}
          alt={product.name[locale]}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-contain p-3 transition-transform duration-500 group-hover:scale-[1.04]"
        />

        {/* Model badge — refined, less heavy */}
        <span className="absolute left-3 top-3 rounded-[2px] bg-brand-700/90 px-2 py-[4px] text-[10px] font-semibold tracking-[0.08em] text-white/95">
          {product.model}
        </span>
      </div>

      {/* ── Content area — goes deep navy on hover ── */}
      <div className="flex flex-1 flex-col px-5 pb-5 pt-4 transition-colors duration-300 group-hover:bg-[#0B2F66]">

        <h3 className="font-display text-[0.9375rem] font-semibold leading-snug text-brand-600 transition-colors duration-300 group-hover:text-white">
          {product.name[locale]}
        </h3>

        <p className="mt-2 line-clamp-3 flex-1 text-[12.5px] font-normal leading-[1.65] text-ink-500 transition-colors duration-300 group-hover:text-white/60">
          {product.summary[locale]}
        </p>

        {/* ── Spec chips ── */}
        {chips.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {chips.map((chip, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 rounded-[2px] border border-brand-100 bg-brand-50/70 px-2 py-[3px] text-[10px] font-medium leading-none tracking-wide text-brand-700 transition-all duration-300 group-hover:border-white/15 group-hover:bg-white/10 group-hover:text-white"
              >
                {chip.kind === "diameter" && <DiameterIcon />}
                {chip.kind === "axes"    && <AxesIcon />}
                {chip.kind === "control" && <ControlIcon />}
                {chip.kind === "speed"   && <SpeedIcon />}
                {chip.text}
              </span>
            ))}
          </div>
        )}

        {/* ── View details link — pinned to bottom with separator ── */}
        <span className="mt-4 inline-flex items-center gap-1.5 border-t border-[#F0F2F5] pt-4 text-[12px] font-medium tracking-wide text-brand-600 transition-colors duration-300 group-hover:border-white/10 group-hover:text-white">
          {dict.common.viewDetails}
          <Arrow />
        </span>
      </div>
    </Link>
  );
}
