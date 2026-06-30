"use client";

import { useState } from "react";
import type { Dictionary } from "@/i18n/dictionaries";
import { Button } from "./ui";
import { CheckIcon } from "./icons";

const COUNTRY_CODES = [
  { code: "+90",  abbr: "TR" },
  { code: "+49",  abbr: "DE" },
  { code: "+1",   abbr: "US" },
  { code: "+44",  abbr: "GB" },
  { code: "+33",  abbr: "FR" },
  { code: "+39",  abbr: "IT" },
  { code: "+31",  abbr: "NL" },
  { code: "+7",   abbr: "RU" },
  { code: "+971", abbr: "AE" },
] as const;

function ChevDown({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

/* Inline SVG country flags — no emoji, no external package, renders on all platforms */
function FlagIcon({ abbr }: { abbr: string }) {
  let inner: React.ReactNode;
  switch (abbr) {
    case "TR":
      inner = (
        <>
          <rect width={20} height={14} fill="#E30A17"/>
          <circle cx="7.5" cy="7" r="3.2" fill="white"/>
          <circle cx="8.8" cy="7" r="2.6" fill="#E30A17"/>
          <polygon points="12.5,5 12.97,6.35 14.4,6.38 13.26,7.25 13.68,8.62 12.5,7.8 11.32,8.62 11.74,7.25 10.6,6.38 12.03,6.35" fill="white"/>
        </>
      );
      break;
    case "DE":
      inner = (
        <>
          <rect width={20} height={4.67} fill="#000"/>
          <rect y={4.67} width={20} height={4.67} fill="#DD0000"/>
          <rect y={9.33} width={20} height={4.67} fill="#FFCE00"/>
        </>
      );
      break;
    case "US":
      inner = (
        <>
          <rect width={20} height={14} fill="#B22234"/>
          <rect y={2.15} width={20} height={1.08} fill="white"/>
          <rect y={4.31} width={20} height={1.08} fill="white"/>
          <rect y={6.46} width={20} height={1.08} fill="white"/>
          <rect y={8.62} width={20} height={1.08} fill="white"/>
          <rect y={10.77} width={20} height={1.08} fill="white"/>
          <rect y={12.92} width={20} height={1.08} fill="white"/>
          <rect width={8} height={7.54} fill="#3C3B6E"/>
        </>
      );
      break;
    case "GB":
      inner = (
        <>
          <rect width={20} height={14} fill="#012169"/>
          <polygon points="0,0 2.8,0 20,11.2 20,14 17.2,14 0,2.8" fill="white"/>
          <polygon points="0,14 0,11.2 17.2,0 20,0 20,2.8 2.8,14" fill="white"/>
          <polygon points="0,0 1.4,0 20,12.6 20,14 18.6,14 0,1.4" fill="#C8102E"/>
          <polygon points="0,14 0,12.6 18.6,0 20,0 20,1.4 1.4,14" fill="#C8102E"/>
          <rect y={5.2} width={20} height={3.6} fill="white"/>
          <rect x={8.2} width={3.6} height={14} fill="white"/>
          <rect y={6} width={20} height={2} fill="#C8102E"/>
          <rect x={9.1} width={1.8} height={14} fill="#C8102E"/>
        </>
      );
      break;
    case "FR":
      inner = (
        <>
          <rect width={6.67} height={14} fill="#002395"/>
          <rect x={6.67} width={6.67} height={14} fill="white"/>
          <rect x={13.33} width={6.67} height={14} fill="#ED2939"/>
        </>
      );
      break;
    case "IT":
      inner = (
        <>
          <rect width={6.67} height={14} fill="#009246"/>
          <rect x={6.67} width={6.67} height={14} fill="white"/>
          <rect x={13.33} width={6.67} height={14} fill="#CE2B37"/>
        </>
      );
      break;
    case "NL":
      inner = (
        <>
          <rect width={20} height={4.67} fill="#AE1C28"/>
          <rect y={4.67} width={20} height={4.67} fill="white"/>
          <rect y={9.33} width={20} height={4.67} fill="#21468B"/>
        </>
      );
      break;
    case "RU":
      inner = (
        <>
          <rect width={20} height={4.67} fill="white"/>
          <rect y={4.67} width={20} height={4.67} fill="#0039A6"/>
          <rect y={9.33} width={20} height={4.67} fill="#D52B1E"/>
        </>
      );
      break;
    case "AE":
      inner = (
        <>
          <rect width={20} height={4.67} fill="#009739"/>
          <rect y={4.67} width={20} height={4.67} fill="white"/>
          <rect y={9.33} width={20} height={4.67} fill="#000"/>
          <rect width={5} height={14} fill="#EF3340"/>
        </>
      );
      break;
    default:
      inner = <rect width={20} height={14} fill="#aaa"/>;
  }
  return (
    <span className="inline-flex shrink-0 overflow-hidden rounded-[2px]" style={{ width: 20, height: 14 }}>
      <svg viewBox="0 0 20 14" width={20} height={14} aria-hidden>
        {inner}
      </svg>
    </span>
  );
}

/* Custom select — avoids browser default colors breaking on dark backgrounds */
function CustomSelect({
  id,
  name,
  options,
  defaultValue,
  dark,
}: {
  id: string;
  name: string;
  options: { value: string; label: string }[];
  defaultValue?: string;
  dark?: boolean;
}) {
  const [value, setValue] = useState(defaultValue ?? options[0]?.value ?? "");
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value) ?? options[0];

  const triggerCls = dark
    ? "flex w-full items-center justify-between gap-2 rounded-lg border border-white/20 bg-white/10 px-3 py-2.5 text-left text-sm text-white transition hover:bg-white/15"
    : "flex w-full items-center justify-between gap-2 rounded-sm border border-ink-200 bg-white px-3 py-2.5 text-left text-sm text-ink-900 transition hover:border-brand-400";

  const panelCls = dark
    ? "border border-white/20 bg-[#0b1e38]"
    : "border border-ink-200 bg-white";

  const optionActive = dark ? "bg-brand-600 text-white" : "bg-brand-50 text-brand-700 font-medium";
  const optionHover  = dark ? "text-white/80 hover:bg-white/10" : "text-ink-800 hover:bg-ink-50";

  return (
    <div className="relative">
      <input type="hidden" id={id} name={name} value={value} />
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((x) => !x)}
        className={triggerCls}
      >
        <span className="truncate">{selected?.label}</span>
        <ChevDown className={`h-4 w-4 shrink-0 transition-transform duration-150 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} aria-hidden />
          <ul
            role="listbox"
            className={`absolute left-0 top-full z-20 mt-1 max-h-52 w-full overflow-y-auto rounded-md shadow-xl ${panelCls}`}
          >
            {options.map((opt) => (
              <li
                key={opt.value}
                role="option"
                aria-selected={opt.value === value}
                onClick={() => { setValue(opt.value); setOpen(false); }}
                className={`cursor-pointer px-3 py-2 text-sm ${opt.value === value ? optionActive : optionHover}`}
              >
                {opt.label}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

/* Custom country-code picker */
function PhoneField({ dark, label }: { dark?: boolean; label: string }) {
  const [countryCode, setCountryCode] = useState("+90");
  const [open, setOpen] = useState(false);
  const sel = COUNTRY_CODES.find((c) => c.code === countryCode) ?? COUNTRY_CODES[0];

  const triggerCls = dark
    ? "flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-2.5 py-2.5 text-sm text-white transition hover:bg-white/15"
    : "flex items-center gap-1.5 rounded-sm border border-ink-200 bg-white px-2.5 py-2.5 text-sm text-ink-900 transition hover:border-brand-400";

  const inputCls = dark
    ? "min-w-0 flex-1 rounded-lg border border-white/20 bg-white/10 px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/40 focus:border-white/50"
    : "min-w-0 flex-1 rounded-sm border border-ink-200 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-brand-500";

  const panelCls = dark ? "border border-white/20 bg-[#0b1e38]" : "border border-ink-200 bg-white";

  return (
    <div>
      <FieldLabel htmlFor="phone" dark={dark}>{label}</FieldLabel>
      <div className="flex min-w-0 gap-2">
        {/* Country code picker */}
        <div className="relative shrink-0">
          <input type="hidden" name="country_code" value={countryCode} />
          <button
            type="button"
            aria-haspopup="listbox"
            aria-expanded={open}
            onClick={() => setOpen((x) => !x)}
            className={triggerCls}
          >
            <FlagIcon abbr={sel.abbr} />
            <span className="text-xs font-semibold">{sel.abbr}</span>
            <span className={`text-xs ${dark ? "text-white/50" : "text-ink-400"}`}>{sel.code}</span>
            <ChevDown className={`h-3 w-3 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
          {open && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} aria-hidden />
              <ul
                role="listbox"
                className={`absolute left-0 top-full z-20 mt-1 max-h-52 w-44 overflow-y-auto rounded-md shadow-xl ${panelCls}`}
              >
                {COUNTRY_CODES.map((c) => (
                  <li
                    key={c.code}
                    role="option"
                    aria-selected={c.code === countryCode}
                    onClick={() => { setCountryCode(c.code); setOpen(false); }}
                    className={`flex cursor-pointer items-center gap-2 px-3 py-2 text-sm ${
                      c.code === countryCode
                        ? dark ? "bg-brand-600 text-white" : "bg-brand-50 text-brand-700 font-medium"
                        : dark ? "text-white/80 hover:bg-white/10" : "text-ink-800 hover:bg-ink-50"
                    }`}
                  >
                    <FlagIcon abbr={c.abbr} />
                    <span className="font-semibold">{c.abbr}</span>
                    <span className={`ml-auto text-xs ${dark ? "text-white/50" : "text-ink-400"}`}>{c.code}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
        {/* Phone number input */}
        <input id="phone" name="phone" type="tel" className={inputCls} />
      </div>
    </div>
  );
}

/* ── Main QuoteForm ── */
type Props = {
  dict: Dictionary;
  productOptions?: string[];
  defaultProduct?: string;
  selectedOptions?: string[];
  selectedOptionsLabel?: string;
  dark?: boolean;
  showInvestmentFields?: boolean;
  defaultRequestType?: string;
};

export function QuoteForm({
  dict,
  productOptions,
  defaultProduct,
  selectedOptions = [],
  selectedOptionsLabel,
  dark = false,
  showInvestmentFields = false,
  defaultRequestType,
}: Props) {
  const f = dict.quoteForm;
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return dark ? (
      <div className="flex flex-col items-start gap-4 rounded-xl bg-white/15 p-8">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#005088]">
          <CheckIcon className="h-6 w-6" />
        </span>
        <h3 className="font-display text-xl text-white">{f.successTitle}</h3>
        <p className="text-sm leading-relaxed text-white/80">{f.successText}</p>
      </div>
    ) : (
      <div className="flex flex-col items-start gap-4 rounded-md border border-brand-100 bg-brand-50 p-8">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-600 text-white">
          <CheckIcon className="h-6 w-6" />
        </span>
        <h3 className="font-display text-xl text-ink-900">{f.successTitle}</h3>
        <p className="text-sm leading-relaxed text-ink-600">{f.successText}</p>
      </div>
    );
  }

  const inputCls = dark
    ? "w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/40 focus:border-white/50 focus:bg-white/15"
    : "w-full rounded-sm border border-ink-200 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-brand-500";

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2"
    >
      {/* Name */}
      <div>
        <FieldLabel htmlFor="name" dark={dark}>{f.name} <Req dark={dark} /></FieldLabel>
        <input id="name" name="name" type="text" required className={inputCls} />
      </div>

      {/* Company */}
      <div>
        <FieldLabel htmlFor="company" dark={dark}>{f.company}</FieldLabel>
        <input id="company" name="company" type="text" className={inputCls} />
      </div>

      {/* Email */}
      <div>
        <FieldLabel htmlFor="email" dark={dark}>{f.email} <Req dark={dark} /></FieldLabel>
        <input id="email" name="email" type="email" required className={inputCls} />
      </div>

      {/* Phone with country picker */}
      <PhoneField dark={dark} label={f.phone} />

      {/* Investment-specific fields */}
      {showInvestmentFields && (
        <>
          <div className="sm:col-span-2">
            <FieldLabel htmlFor="request_type" dark={dark}>{f.requestType}</FieldLabel>
            <CustomSelect
              id="request_type"
              name="request_type"
              options={f.requestTypeOptions.map((o) => ({ value: o, label: o }))}
              defaultValue={defaultRequestType}
              dark={dark}
            />
          </div>
          <div>
            <FieldLabel htmlFor="country" dark={dark}>{f.country}</FieldLabel>
            <input id="country" name="country" type="text" className={inputCls} />
          </div>
          <div>
            <FieldLabel htmlFor="machine_type" dark={dark}>{f.machineType}</FieldLabel>
            <input id="machine_type" name="machine_type" type="text" className={inputCls} />
          </div>
          <div className="sm:col-span-2">
            <FieldLabel htmlFor="project_scope" dark={dark}>{f.projectScope}</FieldLabel>
            <CustomSelect
              id="project_scope"
              name="project_scope"
              options={f.projectScopeOptions.map((o) => ({ value: o, label: o }))}
              dark={dark}
            />
          </div>
        </>
      )}

      {/* Product — only shown in standard mode */}
      {!showInvestmentFields && (
        <div className="sm:col-span-2">
          <FieldLabel htmlFor="product" dark={dark}>{f.product}</FieldLabel>
          {productOptions && productOptions.length > 0 ? (
            <CustomSelect
              id="product"
              name="product"
              options={productOptions.map((o) => ({ value: o, label: o }))}
              defaultValue={defaultProduct ?? productOptions[0]}
              dark={dark}
            />
          ) : (
            <input id="product" name="product" defaultValue={defaultProduct} className={inputCls} />
          )}
        </div>
      )}

      {/* Selected options chips */}
      {selectedOptions.length > 0 && (
        <div className="sm:col-span-2">
          <FieldLabel htmlFor="selected_options_display" dark={dark}>
            {selectedOptionsLabel ?? "Seçili Opsiyonlar"}
          </FieldLabel>
          <input type="hidden" name="selected_options" value={selectedOptions.join(", ")} />
          <div className="flex flex-wrap gap-2">
            {selectedOptions.map((opt) => (
              <span
                key={opt}
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                  dark ? "bg-white/15 text-white" : "bg-brand-600/10 text-brand-700"
                }`}
              >
                {opt}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Message */}
      <div className="sm:col-span-2">
        <FieldLabel htmlFor="message" dark={dark}>{f.message}</FieldLabel>
        <textarea id="message" name="message" rows={3} placeholder={f.messagePlaceholder} className={inputCls} />
      </div>

      {/* Consent */}
      <label className={`flex items-start gap-3 text-xs leading-relaxed sm:col-span-2 ${dark ? "text-white/70" : "text-ink-500"}`}>
        <input type="checkbox" required className={`mt-0.5 h-4 w-4 ${dark ? "accent-blue-300" : "accent-brand-600"}`} />
        <span>{f.consent}</span>
      </label>

      {/* Submit */}
      <div className="sm:col-span-2">
        {dark ? (
          <button type="submit" className="w-full rounded-xl bg-white py-3.5 text-sm font-bold text-brand-700 transition-all hover:bg-slate-100">
            {f.submit}
          </button>
        ) : (
          <Button type="submit" variant="primary" size="lg" withArrow className="w-full sm:w-auto">
            {f.submit}
          </Button>
        )}
      </div>
    </form>
  );
}

function Req({ dark }: { dark?: boolean }) {
  return <span className={`ml-0.5 ${dark ? "text-blue-200" : "text-brand-600"}`}>*</span>;
}

function FieldLabel({ htmlFor, dark, children }: { htmlFor: string; dark?: boolean; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className={`mb-1.5 block text-xs font-medium ${dark ? "text-white/80" : "text-ink-600"}`}>
      {children}
    </label>
  );
}
