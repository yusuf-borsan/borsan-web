import type { Locale } from "@/i18n/config";

/** Build a locale-prefixed path. Pass "" for the home page. */
export function localePath(locale: Locale, path = ""): string {
  const clean = path.startsWith("/") || path === "" ? path : `/${path}`;
  return `/${locale}${clean}`;
}

export const routes = {
  home: "",
  products: "/urunler",
  about: "/hakkimizda",
  service: "/servis",
  contact: "/iletisim",
  category: (slug: string) => `/urunler/${slug}`,
  product: (categorySlug: string, productSlug: string) =>
    `/urunler/${categorySlug}/${productSlug}`,
} as const;
