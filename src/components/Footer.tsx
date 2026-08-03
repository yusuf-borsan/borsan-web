import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { localePath, routes } from "@/lib/routes";
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
      <div>
        <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-12">
            <div className="sm:col-span-2 lg:col-span-4">
              <Image
                src="/branding/logo-white.png"
                alt={dict.meta.siteName}
                width={1939}
                height={423}
                className="h-8 w-auto"
              />
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-steel-400">
                {dict.footer.about}
              </p>
            </div>

            <div className="lg:col-span-2">
              <h3 className="eyebrow text-brand-300">{dict.footer.productsTitle}</h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <Link
                    href={localePath(locale, routes.products)}
                    className="text-steel-300 transition-colors hover:text-white"
                  >
                    {dict.common.viewAllProducts}
                  </Link>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-2">
              <h3 className="eyebrow text-brand-300">{dict.footer.companyTitle}</h3>
              <ul className="mt-4 space-y-2 text-sm">
                {companyLinks.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-steel-300 transition-colors hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="sm:col-span-2 lg:col-span-4">
              <h3 className="eyebrow text-brand-300">{dict.footer.contactTitle}</h3>
              <ul className="mt-4 space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <PinIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                  <span className="whitespace-pre-line text-steel-300">{dict.contact.address}</span>
                </li>
                <li className="flex items-start gap-3">
                  <PhoneIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                  <div className="space-y-1">
                    {dict.contact.phone.split("\n").map((phone) => (
                      <a key={phone} href={`tel:${phone.replace(/\s/g, "")}`} className="block text-steel-300 hover:text-white">
                        {phone}
                      </a>
                    ))}
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <MailIcon className="h-4 w-4 shrink-0 text-brand-400" />
                  <a href={`mailto:${dict.contact.email}`} className="text-steel-300 hover:text-white">
                    {dict.contact.email}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-5 text-xs text-steel-500 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {year} {dict.meta.siteName}. {dict.footer.rights}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
