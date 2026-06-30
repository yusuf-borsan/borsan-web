"use client";

import { useSearchParams } from "next/navigation";
import type { Dictionary } from "@/i18n/dictionaries";
import { QuoteForm } from "@/components/QuoteForm";

export function InvestmentForm({ dict }: { dict: Dictionary }) {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type");

  const requestTypeOptions = dict.quoteForm.requestTypeOptions;
  let defaultRequestType: string | undefined;

  if (typeParam === "partner") {
    defaultRequestType = requestTypeOptions[4];
  } else if (typeParam === "machine") {
    defaultRequestType = requestTypeOptions[0];
  }

  return (
    <QuoteForm
      dict={dict}
      dark
      showInvestmentFields
      defaultRequestType={defaultRequestType}
    />
  );
}
