import type { Metadata } from "next";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { localePath } from "@/lib/routes";
import { Container } from "@/components/ui";
import { PageHero } from "@/components/sections";
import { QuoteForm } from "@/components/QuoteForm";
import { PinIcon, PhoneIcon, MailIcon, ClockIcon } from "@/components/icons";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : "tr");
  return { title: dict.contact.title };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "tr";
  const dict = getDictionary(locale);

  const phoneHref = `tel:${dict.contact.phone.replace(/\s|\(|\)/g, "")}`;

  const cards = [
    { icon: PinIcon,   title: dict.contact.addressTitle, value: dict.contact.address },
    { icon: PhoneIcon, title: dict.contact.phoneTitle,   value: dict.contact.phone,  href: phoneHref },
    { icon: MailIcon,  title: dict.contact.emailTitle,   value: dict.contact.email,  href: `mailto:${dict.contact.email}` },
    { icon: ClockIcon, title: dict.contact.hoursTitle,   value: dict.contact.hours },
  ];

  return (
    <>
      <PageHero
        eyebrow={dict.contact.eyebrow}
        title={dict.contact.title}
        subtitle={dict.contact.intro}
        breadcrumb={[
          { label: dict.common.home, href: localePath(locale) },
          { label: dict.contact.eyebrow },
        ]}
      />

      <section className="bg-slate-50">
        <Container className="py-16 lg:py-24">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">

            {/* ── Left: contact info ── */}
            <div className="lg:col-span-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {cards.map((c) => {
                  const Icon = c.icon;
                  return (
                    <div key={c.title} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                      <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-600/10 text-brand-600">
                        <Icon className="h-6 w-6" />
                      </span>
                      <h3 className="mt-4 text-xs font-semibold uppercase tracking-wider text-ink-400">
                        {c.title}
                      </h3>
                      {c.href ? (
                        <a href={c.href} className="mt-1 block whitespace-pre-line text-ink-900 transition-colors hover:text-brand-600">
                          {c.value}
                        </a>
                      ) : (
                        <p className="mt-1 whitespace-pre-line text-ink-900">{c.value}</p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Map placeholder */}
              <div className="mt-6 flex aspect-[16/10] items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-ink-950 bg-grid shadow-sm">
                <span className="eyebrow text-steel-500">{dict.contact.mapPlaceholder}</span>
              </div>
            </div>

            {/* ── Right: contact form ── */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl bg-brand-600 p-8 shadow-2xl sm:p-10">
                <h2 className="font-display text-2xl text-white sm:text-3xl">
                  {dict.contact.formTitle}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-white/70">
                  {dict.contact.intro}
                </p>
                <div className="mt-8">
                  <QuoteForm dict={dict} dark />
                </div>
              </div>
            </div>

          </div>
        </Container>
      </section>
    </>
  );
}
