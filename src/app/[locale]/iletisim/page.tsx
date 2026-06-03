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
    { icon: PinIcon, title: dict.contact.addressTitle, value: dict.contact.address },
    { icon: PhoneIcon, title: dict.contact.phoneTitle, value: dict.contact.phone, href: phoneHref },
    { icon: MailIcon, title: dict.contact.emailTitle, value: dict.contact.email, href: `mailto:${dict.contact.email}` },
    { icon: ClockIcon, title: dict.contact.hoursTitle, value: dict.contact.hours },
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

      <section className="bg-white">
        <Container className="py-16 lg:py-24">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            {/* Left: info + map */}
            <div className="lg:col-span-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {cards.map((c) => {
                  const Icon = c.icon;
                  return (
                    <div key={c.title} className="rounded-md border border-ink-100 bg-steel-300/5 p-6">
                      <span className="flex h-11 w-11 items-center justify-center rounded-sm bg-brand-600/10 text-brand-600">
                        <Icon className="h-6 w-6" />
                      </span>
                      <h3 className="mt-4 text-sm font-semibold uppercase tracking-wide text-ink-400">
                        {c.title}
                      </h3>
                      {c.href ? (
                        <a href={c.href} className="mt-1 block whitespace-pre-line text-ink-900 hover:text-brand-600">
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
              <div className="mt-6 flex aspect-[16/10] items-center justify-center rounded-md border border-ink-100 bg-ink-950 bg-grid">
                <span className="eyebrow text-steel-500">{dict.contact.mapPlaceholder}</span>
              </div>
            </div>

            {/* Right: form */}
            <div className="lg:col-span-7">
              <div className="rounded-md border border-ink-100 bg-white p-6 sm:p-8">
                <h2 className="font-display text-2xl text-ink-900">{dict.contact.formTitle}</h2>
                <p className="mt-2 text-sm text-ink-500">{dict.quoteForm.title}</p>
                <div className="mt-6">
                  <QuoteForm dict={dict} />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
