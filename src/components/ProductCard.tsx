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

  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-md border border-ink-100 bg-white shadow-[0_2px_14px_-4px_rgba(20,23,29,0.09)] transition-all duration-300 hover:-translate-y-2 hover:border-brand-300/50 hover:shadow-[0_22px_52px_-10px_rgba(20,23,29,0.22)]"
    >
      {/* ── Image area ── */}
      <div className="relative aspect-[4/3] overflow-hidden bg-white">
        <Image
          src={product.image}
          alt={product.name[locale]}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-contain transition-transform duration-500 group-hover:scale-[1.05]"
        />

        {/* Model badge — kurumsal mavi, beyaz yazı */}
        <span className="absolute left-4 top-4 rounded-sm bg-brand-700 px-2.5 py-1 text-xs font-bold tracking-wide text-white shadow-[0_2px_10px_-2px_rgba(15,35,90,0.40)]">
          {product.model}
        </span>
      </div>

      {/* ── Content area — goes deep navy on hover ── */}
      <div className="flex flex-1 flex-col p-6 transition-colors duration-300 group-hover:bg-[#0B2F66]">

        <h3 className="font-display text-lg leading-tight text-ink-900 transition-colors duration-300 group-hover:text-white">
          {product.name[locale]}
        </h3>

        <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-500 transition-colors duration-300 group-hover:text-white/65">
          {product.summary[locale]}
        </p>

        {/* ── Spec chips ── */}
        {chips.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {chips.map((chip, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 rounded-full border border-brand-100 bg-brand-50 px-2.5 py-1 text-[11px] font-semibold leading-none text-brand-700 transition-all duration-300 group-hover:border-white/20 group-hover:bg-white/10 group-hover:text-white"
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

        {/* ── View details link ── */}
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 transition-colors duration-300 group-hover:text-white">
          {dict.common.viewDetails}
          <Arrow />
        </span>
      </div>
    </Link>
  );
}
