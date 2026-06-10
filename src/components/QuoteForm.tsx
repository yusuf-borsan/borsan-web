"use client";

import { useState } from "react";
import type { Dictionary } from "@/i18n/dictionaries";
import { Button } from "./ui";
import { CheckIcon } from "./icons";

type Props = {
  dict: Dictionary;
  /** Pre-selected product label (on product detail pages). */
  productOptions?: string[];
  defaultProduct?: string;
  /** Dark variant: white labels, white-bg inputs, white button on blue bg. */
  dark?: boolean;
};

export function QuoteForm({ dict, productOptions, defaultProduct, dark = false }: Props) {
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
    ? "w-full rounded-lg border-0 bg-white px-4 py-3 text-sm text-ink-900 outline-none transition focus:ring-2 focus:ring-blue-300 placeholder:text-ink-400"
    : "w-full rounded-sm border border-ink-200 bg-white px-4 py-3 text-sm text-ink-900 outline-none transition-colors placeholder:text-ink-400 focus:border-brand-500";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
      className="grid grid-cols-1 gap-5 sm:grid-cols-2"
    >
      <Field label={f.name} name="name" required dark={dark} inputCls={inputCls} />
      <Field label={f.company} name="company" dark={dark} inputCls={inputCls} />
      <Field label={f.email} name="email" type="email" required dark={dark} inputCls={inputCls} />
      <Field label={f.phone} name="phone" type="tel" dark={dark} inputCls={inputCls} />

      <div className="sm:col-span-2">
        <FieldLabel htmlFor="product" dark={dark}>{f.product}</FieldLabel>
        {productOptions && productOptions.length > 0 ? (
          <select
            id="product"
            name="product"
            defaultValue={defaultProduct ?? productOptions[0]}
            className={inputCls}
          >
            {productOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        ) : (
          <input
            id="product"
            name="product"
            defaultValue={defaultProduct}
            className={inputCls}
          />
        )}
      </div>

      <div className="sm:col-span-2">
        <FieldLabel htmlFor="message" dark={dark}>{f.message}</FieldLabel>
        <textarea
          id="message"
          name="message"
          rows={4}
          placeholder={f.messagePlaceholder}
          className={inputCls}
        />
      </div>

      <label className={`flex items-start gap-3 text-xs leading-relaxed sm:col-span-2 ${dark ? "text-white/80" : "text-ink-500"}`}>
        <input type="checkbox" required className={`mt-0.5 h-4 w-4 ${dark ? "accent-blue-300" : "accent-brand-600"}`} />
        <span>{f.consent}</span>
      </label>

      <div className="sm:col-span-2">
        {dark ? (
          <button
            type="submit"
            className="w-full rounded-xl bg-white py-4 text-sm font-bold text-[#005088] transition-all hover:scale-[1.02] hover:bg-slate-100"
          >
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

function FieldLabel({
  htmlFor,
  dark,
  children,
}: {
  htmlFor: string;
  dark?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={`mb-2 block text-sm font-medium ${dark ? "text-white/90" : "text-ink-700"}`}
    >
      {children}
    </label>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
  dark,
  inputCls,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  dark?: boolean;
  inputCls: string;
}) {
  return (
    <div>
      <FieldLabel htmlFor={name} dark={dark}>
        {label}
        {required && (
          <span className={`ml-1 ${dark ? "text-blue-200" : "text-brand-600"}`}>*</span>
        )}
      </FieldLabel>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className={inputCls}
      />
    </div>
  );
}
