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
};

export function QuoteForm({ dict, productOptions, defaultProduct }: Props) {
  const f = dict.quoteForm;
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="flex flex-col items-start gap-4 rounded-md border border-brand-100 bg-brand-50 p-8">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-600 text-white">
          <CheckIcon className="h-6 w-6" />
        </span>
        <h3 className="font-display text-xl text-ink-900">{f.successTitle}</h3>
        <p className="text-sm leading-relaxed text-ink-600">{f.successText}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
      className="grid grid-cols-1 gap-5 sm:grid-cols-2"
    >
      <Field label={f.name} name="name" required />
      <Field label={f.company} name="company" />
      <Field label={f.email} name="email" type="email" required />
      <Field label={f.phone} name="phone" type="tel" />

      <div className="sm:col-span-2">
        <FieldLabel htmlFor="product">{f.product}</FieldLabel>
        {productOptions && productOptions.length > 0 ? (
          <select
            id="product"
            name="product"
            defaultValue={defaultProduct ?? productOptions[0]}
            className="w-full rounded-sm border border-ink-200 bg-white px-4 py-3 text-sm text-ink-900 outline-none transition-colors focus:border-brand-500"
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
            className="w-full rounded-sm border border-ink-200 bg-white px-4 py-3 text-sm text-ink-900 outline-none transition-colors focus:border-brand-500"
          />
        )}
      </div>

      <div className="sm:col-span-2">
        <FieldLabel htmlFor="message">{f.message}</FieldLabel>
        <textarea
          id="message"
          name="message"
          rows={4}
          placeholder={f.messagePlaceholder}
          className="w-full rounded-sm border border-ink-200 bg-white px-4 py-3 text-sm text-ink-900 outline-none transition-colors placeholder:text-ink-400 focus:border-brand-500"
        />
      </div>

      <label className="flex items-start gap-3 text-xs leading-relaxed text-ink-500 sm:col-span-2">
        <input type="checkbox" required className="mt-0.5 h-4 w-4 accent-brand-600" />
        <span>{f.consent}</span>
      </label>

      <div className="sm:col-span-2">
        <Button type="submit" variant="primary" size="lg" withArrow className="w-full sm:w-auto">
          {f.submit}
        </Button>
      </div>
    </form>
  );
}

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-ink-700">
      {children}
    </label>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <FieldLabel htmlFor={name}>
        {label}
        {required && <span className="ml-1 text-brand-600">*</span>}
      </FieldLabel>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="w-full rounded-sm border border-ink-200 bg-white px-4 py-3 text-sm text-ink-900 outline-none transition-colors placeholder:text-ink-400 focus:border-brand-500"
      />
    </div>
  );
}
