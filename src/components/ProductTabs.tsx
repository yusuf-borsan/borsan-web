"use client";

import { useState } from "react";
import type { Locale, Localized } from "@/i18n/config";
import type { Spec } from "@/lib/products";
import { CheckIcon } from "@/components/icons";

/* ══════════════════════════════════════════════════════════════
   SpecNavigator — prev/next for 4+ "/" separated values
   ══════════════════════════════════════════════════════════════ */
function SpecNavigator({ parts }: { parts: string[] }) {
  const [idx, setIdx] = useState(0);
  return (
    <div className="flex items-center justify-end gap-1">
      <button
        type="button"
        onClick={() => setIdx((i) => Math.max(0, i - 1))}
        disabled={idx === 0}
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-lg leading-none text-ink-400 hover:bg-steel-300/30 hover:text-ink-700 disabled:opacity-25"
        aria-label="Önceki"
      >
        ‹
      </button>
      <span className="min-w-0 truncate text-right text-xs font-semibold text-ink-900">
        {parts[idx]}
      </span>
      <button
        type="button"
        onClick={() => setIdx((i) => Math.min(parts.length - 1, i + 1))}
        disabled={idx === parts.length - 1}
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-lg leading-none text-ink-400 hover:bg-steel-300/30 hover:text-ink-700 disabled:opacity-25"
        aria-label="Sonraki"
      >
        ›
      </button>
      <span className="shrink-0 tabular-nums text-[10px] text-ink-400">
        {idx + 1}/{parts.length}
      </span>
    </div>
  );
}

function SpecValue({ value }: { value: string }) {
  const parts = value.split(" / ");
  if (parts.length < 4) return <>{value}</>;
  return <SpecNavigator parts={parts} />;
}

/* ══════════════════════════════════════════════════════════════
   Display-only label fixes (products.ts NOT touched)
   ══════════════════════════════════════════════════════════════ */
function fixSpecLabel(label: string): string {
  return label
    .replace("Kuyrukluk Hareketi", "Punta Gövdesi Hareketi")
    .replace("Kuyrukluk Konik", "Punta Koniği")
    .replace("Kuyrukluk Punta Çapı", "Punta Çapı")
    .replace("Kuyruk Mili Koniği", "Punta Koniği")
    .replace("Kuyruk Mili Kilitleme", "Punta Mili Kilitleme")
    .replace("Kuyruk Mili", "Punta Mili")
    .replace("Kuyrukluk", "Punta Grubu");
}

/* ══════════════════════════════════════════════════════════════
   Spec grouping
   ══════════════════════════════════════════════════════════════ */
type GroupDef = { tr: string; en: string; keywords: string[] };

const GROUPS: GroupDef[] = [
  {
    tr: "İşleme Kapasitesi",
    en: "Machining Capacity",
    keywords: ["Çevirme", "Kesme", "İş Parçası", "Bar", "Ayna"],
  },
  {
    tr: "Gövde ve Kızak Yapısı",
    en: "Bed & Guideway",
    keywords: ["Gövde", "Kızak", "Merkez", "Punta"],
  },
  {
    tr: "İş Mili",
    en: "Spindle",
    keywords: ["İş Mili"],
  },
  {
    tr: "İlerleme ve Hareketler",
    en: "Feed & Motion",
    keywords: ["Eksen", "Hareket", "Hızlı", "Vida Mili", "İlerleme"],
  },
  {
    tr: "Vida Açma Özellikleri",
    en: "Threading",
    keywords: ["Vida Açma", "Metrik", "İnç", "Modül", "Diametral", "Ana Vida"],
  },
  {
    tr: "Punta Grubu",
    en: "Tailstock",
    keywords: ["Kuyruk"],
  },
  {
    tr: "Taret ve Kalemlik",
    en: "Turret & Tool Post",
    keywords: ["Taret", "Kalem"],
  },
  {
    tr: "Hassasiyet",
    en: "Precision",
    keywords: ["Hassasiyet", "Yuvarlaklık", "Silindiriklik"],
  },
  {
    tr: "Ölçüler, Ağırlık ve Enerji",
    en: "Dimensions, Weight & Power",
    keywords: ["Ağırlık", "Ölçü", "Elektrik", "Kapasite"],
  },
];

function getGroupIndex(labelTr: string): number {
  for (let i = 0; i < GROUPS.length; i++) {
    if (GROUPS[i].keywords.some((kw) => labelTr.includes(kw))) return i;
  }
  return GROUPS.length;
}

/* ══════════════════════════════════════════════════════════════
   Tab content components
   ══════════════════════════════════════════════════════════════ */
function SpecsTab({
  specs,
  locale,
  specsNote,
}: {
  specs: Spec[];
  locale: Locale;
  specsNote: string;
}) {
  const buckets: Spec[][] = Array.from({ length: GROUPS.length + 1 }, () => []);
  for (const spec of specs) {
    buckets[getGroupIndex(spec.label.tr)].push(spec);
  }

  const allGroups = [
    ...GROUPS.map((g, i) => ({
      title: locale === "tr" ? g.tr : g.en,
      specs: buckets[i],
    })),
    {
      title: locale === "tr" ? "Diğer Teknik Bilgiler" : "Other Technical Information",
      specs: buckets[GROUPS.length],
    },
  ].filter((g) => g.specs.length > 0);

  return (
    <div className="space-y-8">
      {allGroups.map((group) => (
        <div key={group.title}>
          {/* Group header with trailing rule */}
          <div className="mb-2 flex items-center gap-3">
            <span className="shrink-0 text-[10px] font-bold uppercase tracking-widest text-brand-600">
              {group.title}
            </span>
            <div className="h-px flex-1 bg-brand-600/15" />
          </div>
          {/* Spec rows — no outer border, only inner dividers */}
          <table className="w-full table-fixed text-sm">
            <colgroup>
              <col className="w-[55%]" />
              <col className="w-[45%]" />
            </colgroup>
            <tbody className="divide-y divide-ink-100/60">
              {group.specs.map((spec) => (
                <tr key={spec.label.tr} className="even:bg-ink-50/40">
                  <th
                    scope="row"
                    className="py-2 pr-3 text-left text-sm font-normal text-ink-500"
                  >
                    {fixSpecLabel(spec.label[locale])}
                  </th>
                  <td className="py-2 text-right text-sm font-semibold text-ink-800">
                    <SpecValue value={spec.value[locale]} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
      {specsNote && <p className="text-xs text-ink-400">{specsNote}</p>}
    </div>
  );
}

function FeaturesTab({
  features,
  locale,
}: {
  features: Localized[];
  locale: Locale;
}) {
  return (
    <ul className="divide-y divide-ink-100/60">
      {features.map((f, i) => (
        <li key={i} className="flex items-start gap-3 py-3 even:bg-ink-50/40">
          <span className="mt-0.5 shrink-0 text-brand-600">
            <CheckIcon className="h-3.5 w-3.5" />
          </span>
          <span className="text-[15px] leading-relaxed text-ink-700">{f[locale]}</span>
        </li>
      ))}
    </ul>
  );
}

/* ══════════════════════════════════════════════════════════════
   ProductDetailTabs — main exported component
   ══════════════════════════════════════════════════════════════ */
type TabKey = "specs" | "features";

export function ProductDetailTabs({
  specs,
  features,
  locale,
  labels,
}: {
  specs: Spec[];
  features: Localized[];
  locale: Locale;
  labels: {
    specs: string;
    features: string;
    specsNote: string;
  };
}) {
  const [tab, setTab] = useState<TabKey>("specs");

  const tabs: { key: TabKey; label: string }[] = [
    { key: "specs", label: labels.specs },
    { key: "features", label: labels.features },
  ];

  return (
    <div>
      {/* Underline tab strip — scrollbar hidden on all browsers */}
      <div
        className="flex overflow-x-auto border-b border-ink-200 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="tablist"
      >
        {tabs.map((t) => {
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(t.key)}
              className={`-mb-px shrink-0 border-b-2 px-6 py-3.5 text-sm font-semibold transition-colors ${
                active
                  ? "border-brand-600 text-brand-600"
                  : "border-transparent text-ink-500 hover:border-ink-300 hover:text-ink-900"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="mt-8">
        {tab === "specs" && (
          <SpecsTab specs={specs} locale={locale} specsNote={labels.specsNote} />
        )}
        {tab === "features" && <FeaturesTab features={features} locale={locale} />}
      </div>
    </div>
  );
}
