import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { localePath, routes } from "@/lib/routes";
import { categories } from "@/lib/products";
import { MailIcon, PhoneIcon, PinIcon } from "./icons";

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const year = new Date().getFullYear();

  const companyLinks = [
    { href: localePath(locale, routes.about), label: dict.nav.about },
    { href: localePath(locale, routes.service), label: dict.nav.service },
    { href: localePath(locale, routes.contact), label: dict.nav.contact },
  ];

  return (
    <footer className="bg-ink-950 text-steel-300">
      <div className="bg-grid">
        <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Image
                src="/branding/logo-white.png"
                alt={dict.meta.siteName}
                width={1939}
                height={423}
                className="h-10 w-auto"
              />
              <p className="mt-6 max-w-sm text-sm leading-relaxed text-steel-400">
                {dict.footer.about}
              </p>
            </div>

            <div className="lg:col-span-3">
              <h3 className="eyebrow text-brand-300">{dict.footer.productsTitle}</h3>
              <ul className="mt-5 space-y-3 text-sm">
                {categories.map((cat) => (
                  <li key={cat.slug}>
                    <Link
                      href={localePath(locale, routes.category(cat.slug))}
                      className="text-steel-300 transition-colors hover:text-white"
                    >
                      {cat.name[locale]}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-2">
              <h3 className="eyebrow text-brand-300">{dict.footer.companyTitle}</h3>
              <ul className="mt-5 space-y-3 text-sm">
                {companyLinks.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-steel-300 transition-colors hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-3">
              <h3 className="eyebrow text-brand-300">{dict.footer.contactTitle}</h3>
              <ul className="mt-5 space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <PinIcon className="mt-0.5 h-5 w-5 shrink-0 text-brand-400" />
                  <span className="whitespace-pre-line text-steel-300">{dict.contact.address}</span>
                </li>
                <li className="flex items-center gap-3">
                  <PhoneIcon className="h-5 w-5 shrink-0 text-brand-400" />
                  <a href={`tel:${dict.contact.phone.replace(/\s|\(|\)/g, "")}`} className="text-steel-300 hover:text-white">
                    {dict.contact.phone}
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <MailIcon className="h-5 w-5 shrink-0 text-brand-400" />
                  <a href={`mailto:${dict.contact.email}`} className="text-steel-300 hover:text-white">
                    {dict.contact.email}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-steel-500 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {year} {dict.meta.siteName}. {dict.footer.rights}
            </p>
            <p className="text-steel-600">{dict.footer.prototypeNote}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
