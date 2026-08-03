"use client";

import type { Dictionary } from "@/i18n/dictionaries";
import { QuoteForm } from "@/components/QuoteForm";

export function ServiceForm({ dict }: { dict: Dictionary }) {
  return <QuoteForm dict={dict} dark showServiceTopics />;
}
