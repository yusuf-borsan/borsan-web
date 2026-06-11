"use client";

import { useState } from "react";
import type { Locale, Localized } from "@/i18n/config";
import type { Spec } from "@/lib/products";
import { CheckIcon } from "./icons";

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

type TabKey = "specs" | "features";

export function ProductTabs({
  specs,
  features,
  locale,
  labels,
}: {
  specs: Spec[];
  features: Localized[];
  locale: Locale;
  labels: { specs: string; features: string; specsNote: string };
}) {
  const [tab, setTab] = useState<TabKey>("specs");

  const tabs: { key: TabKey; label: string }[] = [
    { key: "specs", label: labels.specs },
    { key: "features", label: labels.features },
  ];

  return (
    <div className="overflow-hidden rounded-md border border-ink-100">
      {/* Tab bar */}
      <div className="grid grid-cols-2" role="tablist">
        {tabs.map((t) => {
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(t.key)}
              className={`px-4 py-4 text-sm font-semibold transition-colors ${
                active
                  ? "bg-brand-600 text-white"
                  : "bg-steel-300/10 text-ink-500 hover:bg-steel-300/20 hover:text-ink-700"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Panel: technical specifications */}
      {tab === "specs" && (
        <div>
          <table className="w-full table-fixed text-sm">
            <colgroup>
              <col className="w-[48%]" />
              <col className="w-[52%]" />
            </colgroup>
            <tbody>
              {specs.map((spec, i) => (
                <tr key={spec.label[locale]} className={i % 2 === 1 ? "bg-steel-300/10" : "bg-white"}>
                  <th
                    scope="row"
                    className="px-4 py-3 text-left font-medium text-ink-500"
                  >
                    {spec.label[locale]}
                  </th>
                  <td className="px-4 py-3 text-right font-semibold text-ink-900">
                    <SpecValue value={spec.value[locale]} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="border-t border-ink-100 bg-white px-4 py-3 text-xs text-ink-400">
            {labels.specsNote}
          </p>
        </div>
      )}

      {/* Panel: product features */}
      {tab === "features" && (
        <ul className="divide-y divide-ink-100 bg-white">
          {features.map((f, i) => (
            <li key={i} className="flex items-start gap-3 px-6 py-3.5">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-600/10 text-brand-600">
                <CheckIcon className="h-3.5 w-3.5" />
              </span>
              <span className="text-sm leading-relaxed text-ink-700">{f[locale]}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
