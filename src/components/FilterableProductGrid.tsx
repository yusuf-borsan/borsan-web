"use client";

import { useState } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Product } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

/* ── Filter key type ─────────────────────────────────────────────────────── */

type FilterKey = "all" | "5axis" | "4axis" | "tailstock";

const FILTER_ORDER: FilterKey[] = ["all", "5axis", "4axis", "tailstock"];

const FILTER_LABELS: Record<FilterKey, { tr: string; en: string }> = {
  all:       { tr: "Tümü",                        en: "All" },
  "5axis":   { tr: "CNC 5 Eksen Döner Tablalar",  en: "CNC Five-Axis Rotary Tables" },
  "4axis":   { tr: "CNC 4 Eksen Döner Tablalar",  en: "CNC Four-Axis Rotary Tables" },
  tailstock: { tr: "Punta Destekleri",             en: "Tailstock Support Systems" },
};

/* ── Slug-based classifier ───────────────────────────────────────────────── */

function classify(product: Product): FilterKey | null {
  const s = product.slug.toLowerCase();
  if (s.includes("tcvr")) return "5axis";
  if (s.includes("tcv"))  return "4axis";
  if (
    s.includes("rt") || s.includes("qt") || s.includes("yt") ||
    s.includes("ht") || s.includes("punta")
  ) return "tailstock";
  return null;
}

/* ── FilterableProductGrid ───────────────────────────────────────────────── */

export function FilterableProductGrid({
  products,
  locale,
  dict,
  noProductsLabel,
}: {
  products: Product[];
  locale: Locale;
  dict: Dictionary;
  noProductsLabel: string;
}) {
  const [active, setActive] = useState<FilterKey>("all");

  /* Groups that have ≥1 product */
  const populated = new Set(
    products.map(classify).filter((k): k is FilterKey => k !== null),
  );

  /* Show filter bar when at least one specific group is populated */
  const showFilters = populated.size >= 1;

  /* Filtered product list */
  const shown =
    active === "all"
      ? products
      : products.filter((p) => classify(p) === active);

  /* Per-locale message when a specific filter has no products yet */
  const filterEmptyText =
    locale === "tr"
      ? "Bu ürün ailesi için ürünler yakında eklenecektir."
      : "Products for this family are coming soon.";

  /* No filtering needed — plain grid */
  if (!showFilters) {
    return products.length > 0 ? (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <ProductCard key={p.slug} product={p} locale={locale} dict={dict} />
        ))}
      </div>
    ) : (
      <p className="mt-6 max-w-xl text-ink-500">{noProductsLabel}</p>
    );
  }

  return (
    <div>
      {/* ── Filter tab strip — all chips always visible when filter bar is shown ── */}
      {/*
        Separator is absolutely positioned so the overflow-x:auto scroll container
        cannot clip it. Active indicator uses after:: pseudo-element (inside the button,
        never clipped by parent overflow). This avoids the -mb-px / border-b trick
        that fails intermittently when overflow-x:auto implicitly sets overflow-y:auto.
      */}
      <div className="relative mb-8">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-ink-100" />
        <div className="relative flex overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {FILTER_ORDER.map((key) => {
            const isActive = active === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActive(key)}
                className={[
                  "relative shrink-0 whitespace-nowrap px-6 py-4 text-[13.5px] font-medium transition-colors duration-150",
                  isActive
                    ? "text-ink-900 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-[#1F4488]"
                    : "text-ink-400 hover:text-ink-600",
                ].join(" ")}
              >
                {locale === "tr" ? FILTER_LABELS[key].tr : FILTER_LABELS[key].en}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Product grid ── */}
      {shown.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((p) => (
            <ProductCard key={p.slug} product={p} locale={locale} dict={dict} />
          ))}
        </div>
      ) : (
        <p className="mt-6 text-sm text-ink-400">{filterEmptyText}</p>
      )}
    </div>
  );
}
