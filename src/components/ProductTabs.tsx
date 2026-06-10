"use client";

import { useState } from "react";
import type { Locale, Localized } from "@/i18n/config";
import type { Spec } from "@/lib/products";
import { CheckIcon } from "./icons";

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
          <table className="w-full text-sm">
            <tbody>
              {specs.map((spec, i) => (
                <tr key={spec.label[locale]} className={i % 2 === 1 ? "bg-steel-300/10" : "bg-white"}>
                  <th
                    scope="row"
                    className="w-[45%] whitespace-nowrap px-4 py-3 text-left font-medium text-ink-500"
                  >
                    {spec.label[locale]}
                  </th>
                  <td className="px-4 py-3 text-right font-semibold text-ink-900">
                    {spec.value[locale]}
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
