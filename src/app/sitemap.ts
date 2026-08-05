import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { routes } from "@/lib/routes";
import { categories } from "@/lib/products";

const BASE = "https://borsanteknoloji.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  const staticPaths = [
    routes.home,
    routes.products,
    routes.about,
    routes.service,
    routes.contact,
    routes.investment,
  ];

  for (const locale of locales) {
    for (const path of staticPaths) {
      entries.push({
        url: `${BASE}/${locale}${path}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: path === routes.home ? 1 : 0.8,
      });
    }

    for (const cat of categories) {
      entries.push({
        url: `${BASE}/${locale}${routes.category(cat.slug)}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.7,
      });

      for (const product of cat.products) {
        entries.push({
          url: `${BASE}/${locale}${routes.product(cat.slug, product.slug)}`,
          lastModified: now,
          changeFrequency: "monthly",
          priority: 0.6,
        });
      }
    }
  }

  return entries;
}
