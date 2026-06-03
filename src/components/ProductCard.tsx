import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Product } from "@/lib/products";
import { localePath, routes } from "@/lib/routes";
import { Arrow } from "./ui";

export function ProductCard({
  product,
  locale,
  dict,
}: {
  product: Product;
  locale: Locale;
  dict: Dictionary;
}) {
  const href = localePath(locale, routes.product(product.categorySlug, product.slug));
  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-md border border-ink-100 bg-white transition-all duration-300 hover:border-brand-200 hover:shadow-[0_18px_40px_-24px_rgba(20,23,29,0.4)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-ink-900">
        <Image
          src={product.image}
          alt={product.name[locale]}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <span className="absolute left-4 top-4 rounded-sm bg-white/95 px-2.5 py-1 text-xs font-bold tracking-wide text-brand-700">
          {product.model}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-lg leading-tight text-ink-900">{product.name[locale]}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-500">{product.summary[locale]}</p>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-600">
          {dict.common.viewDetails}
          <Arrow />
        </span>
      </div>
    </Link>
  );
}
