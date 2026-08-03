import type { Metadata } from "next";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { localePath } from "@/lib/routes";
import { categories } from "@/lib/products";
import { Container } from "@/components/ui";
import { PageHero } from "@/components/sections";
import { QuoteForm } from "@/components/QuoteForm";
import { RevealOnScroll } from "@/components/RevealOnScroll";

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

  const phones = dict.contact.phone.split("\n");
  const hoursLines = dict.contact.hours.split("\n");

  const categoryOptions = categories.map((cat) => ({
    value: cat.slug,
    label: cat.name[locale],
    products: cat.products.map((p) => ({
      value: p.slug,
      label: p.name[locale],
    })),
  }));

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

      {/* ── Main dark content ── */}
      <section className="relative bg-ink-950">

        <Container className="relative py-16 lg:py-24">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">

            {/* ── Left: contact info ── */}
            <RevealOnScroll className="lg:col-span-5">
              <div className="space-y-7 lg:pr-6">

                {/* Addresses */}
                <div>
                  <p className="mb-4 text-[10.5px] font-semibold uppercase tracking-widest text-brand-400">
                    {dict.contact.addressTitle}
                  </p>
                  <div className="space-y-5">
                    <div>
                      <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-steel-500">
                        {dict.contact.addressLabel}
                      </p>
                      <p className="text-[13.5px] leading-relaxed text-steel-300">
                        {dict.contact.address}
                      </p>
                    </div>
                    <div>
                      <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-steel-500">
                        {dict.contact.address2Title}
                      </p>
                      <p className="text-[13.5px] leading-relaxed text-steel-300">
                        {dict.contact.address2}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-white/[0.06]" />

                {/* Phone */}
                <div>
                  <p className="mb-4 text-[10.5px] font-semibold uppercase tracking-widest text-brand-400">
                    {dict.contact.phoneTitle}
                  </p>
                  <div className="space-y-2">
                    {phones.map((phone) => (
                      <a
                        key={phone}
                        href={`tel:${phone.replace(/\s/g, "")}`}
                        className="block text-[13.5px] text-steel-300 transition-colors hover:text-white"
                      >
                        {phone}
                      </a>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-white/[0.06]" />

                {/* Email */}
                <div>
                  <p className="mb-4 text-[10.5px] font-semibold uppercase tracking-widest text-brand-400">
                    {dict.contact.emailTitle}
                  </p>
                  <a
                    href={`mailto:${dict.contact.email}`}
                    className="text-[13.5px] text-steel-300 transition-colors hover:text-white"
                  >
                    {dict.contact.email}
                  </a>
                </div>

                <div className="h-px bg-white/[0.06]" />

                {/* Hours */}
                <div>
                  <p className="mb-4 text-[10.5px] font-semibold uppercase tracking-widest text-brand-400">
                    {dict.contact.hoursTitle}
                  </p>
                  <div className="space-y-0.5">
                    {hoursLines.map((line, idx) => (
                      <p key={idx} className="text-[13.5px] text-steel-300">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>

              </div>
            </RevealOnScroll>

            {/* ── Right: form ── */}
            <RevealOnScroll delay={100} className="lg:col-span-7">
              <h2 className="font-display text-2xl text-white sm:text-[1.75rem]">
                {dict.contact.formTitle}
              </h2>
              <p className="mt-3 text-[13.5px] leading-relaxed text-steel-400">
                {dict.contact.formDesc}
              </p>
              <div className="mt-8">
                <QuoteForm
                  dict={dict}
                  dark
                  showContactTopics
                  categoryOptions={categoryOptions}
                />
              </div>
            </RevealOnScroll>

          </div>
        </Container>
      </section>

      {/* ── Map ── */}
      <section className="relative bg-ink-950">
        <Container className="pb-16 lg:pb-24">
          <RevealOnScroll>
            <div
              className="overflow-hidden rounded-xl"
              style={{ aspectRatio: "21/9" }}
            >
              <iframe
                src="https://maps.google.com/maps?q=Teknik+Yap%C4%B1+Residence+Inn+Deluxia+Ba%C5%9Fakehir+%C4%B0stanbul&hl=tr&z=18&output=embed"
                className="h-full w-full border-0"
                loading="lazy"
                allowFullScreen
                title={dict.contact.address2Title}
              />
            </div>
          </RevealOnScroll>
        </Container>
      </section>
    </>
  );
}
