import type { Metadata } from "next";
import Image from "next/image";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { localePath, routes } from "@/lib/routes";
import { Container, ButtonLink, Eyebrow } from "@/components/ui";
import { Breadcrumb } from "@/components/sections";
import { CheckIcon } from "@/components/icons";
import { EuropePartnershipMap } from "@/components/EuropePartnershipMap";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { SolutionLevelsSection } from "@/components/SolutionLevels";
import { InvestmentForm } from "./InvestmentForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const loc: Locale = isLocale(locale) ? locale : "tr";
  const dict = getDictionary(loc);
  const inv = dict.investment;
  return {
    title:
      loc === "tr"
        ? "Makine Yatırım Çözümleri | CNC Makine Tedariği ve Atölye Kurulumu | Borsan Teknoloji"
        : "Machine Investment Solutions | CNC Machine Procurement & Workshop Setup | Borsan Teknoloji",
    description: inv.heroSubtitle,
    keywords:
      loc === "tr"
        ? "CNC makine tedariği, atölye kurulumu, makine yatırım çözümleri, teknik şartname, hibe proje teknik dosyası, CNC torna, kapasite artırımı"
        : "CNC machine procurement, workshop setup, machine investment solutions, technical specification, grant project technical file, CNC lathe, capacity expansion",
  };
}

export default async function InvestmentPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "tr";
  const dict = getDictionary(locale);
  const inv = dict.investment;

  return (
    <>
      {/* ── A. Hero — two-layer image: blurred bg + masked sharp ── */}
      <section className="relative overflow-hidden bg-[#040911] text-white">
        {/* Layer 1: blurred background fill — seamless base */}
        <Image
          src="/hero/investment-hero.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="scale-[1.06] object-cover object-[65%_center] opacity-[0.45] blur-[12px]"
        />
        <div className="absolute inset-0 bg-[#040911]/55" aria-hidden />

        {/* Layer 2 (desktop): sharp image, wide mask for invisible seam */}
        <div
          className="pointer-events-none absolute inset-0 hidden lg:block"
          style={{
            WebkitMaskImage: "linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.04) 8%, rgba(0,0,0,0.14) 16%, rgba(0,0,0,0.32) 24%, rgba(0,0,0,0.54) 32%, rgba(0,0,0,0.76) 40%, rgba(0,0,0,0.92) 48%, rgba(0,0,0,1) 56%, rgba(0,0,0,1) 100%)",
            maskImage: "linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.04) 8%, rgba(0,0,0,0.14) 16%, rgba(0,0,0,0.32) 24%, rgba(0,0,0,0.54) 32%, rgba(0,0,0,0.76) 40%, rgba(0,0,0,0.92) 48%, rgba(0,0,0,1) 56%, rgba(0,0,0,1) 100%)",
          }}
        >
          <div className="flex h-full items-center justify-end">
            <Image
              src="/hero/investment-hero.png"
              alt=""
              width={1920}
              height={1080}
              priority
              sizes="72vw"
              className="h-full w-auto max-w-[74%] object-contain object-right"
            />
          </div>
        </div>

        {/* Seam-killer: extra soft gradient at the blend zone */}
        <div
          className="pointer-events-none absolute inset-y-0 left-[28%] hidden w-[24%] lg:block"
          style={{
            background:
              "linear-gradient(90deg, rgba(4,9,17,0.7) 0%, rgba(4,9,17,0.45) 30%, rgba(4,9,17,0.18) 60%, transparent 100%)",
            filter: "blur(6px)",
          }}
          aria-hidden
        />
        {/* Extra bottom-half seam softener — the lower portion of the edge is brighter */}
        <div
          className="pointer-events-none absolute bottom-0 left-[24%] hidden h-[55%] w-[28%] lg:block"
          style={{
            background:
              "linear-gradient(90deg, rgba(4,9,17,0.75) 0%, rgba(4,9,17,0.50) 28%, rgba(4,9,17,0.22) 58%, transparent 100%)",
            filter: "blur(10px)",
          }}
          aria-hidden
        />

        {/* Main gradient overlay — very wide left-to-right fade */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(4,9,17,0.98) 0%, rgba(4,9,17,0.96) 16%, rgba(4,9,17,0.90) 30%, rgba(4,9,17,0.74) 42%, rgba(4,9,17,0.50) 56%, rgba(4,9,17,0.24) 72%, rgba(4,9,17,0.08) 88%, rgba(4,9,17,0.02) 100%)",
          }}
          aria-hidden
        />
        {/* Mobile overlay */}
        <div className="absolute inset-0 bg-[#040911]/55 lg:hidden" aria-hidden />

        <Container className="relative py-16 sm:py-20 lg:py-28">
          <div className="mb-6">
            <Breadcrumb
              items={[
                { label: dict.common.home, href: localePath(locale) },
                { label: inv.eyebrow },
              ]}
            />
          </div>

          <div className="max-w-2xl">
            <Eyebrow tone="light">{inv.eyebrow}</Eyebrow>
            <h1 className="font-display mt-4 text-balance text-4xl leading-[1.04] sm:text-5xl lg:text-[3.25rem]">
              {inv.heroTitle}
            </h1>
            <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-steel-300">
              {inv.heroSubtitle}
            </p>
            <div className="mt-10">
              <ButtonLink
                href="#yatirim-formu"
                variant="primary"
                size="lg"
                withArrow
              >
                {inv.ctaPrimary}
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      {/* ── B. Solution Levels — gear-driven mechanical reveal ── */}
      <section className="bg-[#f5f7fa]">
        <Container className="py-20 lg:py-28">
          <RevealOnScroll>
            <div className="mb-16 max-w-2xl">
              <Eyebrow>{inv.packagesEyebrow}</Eyebrow>
              <h2 className="mt-4 text-[1.875rem] font-semibold leading-[1.15] tracking-[-0.01em] text-[#1F4488] sm:text-[2.25rem] lg:text-[2.625rem]">
                {inv.packagesTitle}
              </h2>
              <p className="mt-4 text-pretty text-base leading-relaxed text-ink-500 sm:text-lg">
                {inv.packagesSubtitle}
              </p>
            </div>
          </RevealOnScroll>

          <SolutionLevelsSection packages={inv.packages} />
        </Container>
      </section>

      {/* ── D. Technical Dossier — photo as background layer ── */}
      <section className="relative overflow-hidden bg-[#050c18] text-white lg:min-h-[680px]">
        {/* Background photo — full section */}
        <Image
          src="/hero/teknik-dosya-3.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-[25%_bottom]"
        />
        {/* Horizontal overlay — text readability left, photo visible center/right */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(5,12,24,0.92) 0%, rgba(5,12,24,0.78) 30%, rgba(5,12,24,0.42) 55%, rgba(5,12,24,0.62) 100%)",
          }}
          aria-hidden
        />
        {/* Vertical overlay — lighter in the middle where photo lives */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(5,12,24,0.75) 0%, rgba(5,12,24,0.18) 40%, rgba(5,12,24,0.22) 65%, rgba(5,12,24,0.70) 100%)",
          }}
          aria-hidden
        />
        {/* Mobile extra overlay */}
        <div className="absolute inset-0 bg-[#050c18]/30 lg:hidden" aria-hidden />

        <Container className="relative py-16 lg:py-24">
          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-14">
            {/* Left: title + description */}
            <RevealOnScroll>
              <div className="lg:py-4">
                <Eyebrow tone="light">{locale === "tr" ? "Teknik Dosya" : "Technical File"}</Eyebrow>
                <h2 className="mt-4 text-[1.75rem] font-semibold leading-[1.15] tracking-[-0.01em] text-white sm:text-[2rem] lg:text-[2.25rem]">
                  {inv.dossierTitle}
                </h2>
                <p className="mt-4 max-w-lg text-[15px] leading-[1.7] text-steel-300">
                  {inv.dossierSubtitle}
                </p>
              </div>
            </RevealOnScroll>

            {/* Right: 6 items — clean text list */}
            <div className="relative lg:pl-10 lg:pt-2">
              <div
                className="pointer-events-none absolute -inset-x-8 -inset-y-6 lg:-inset-x-12"
                style={{
                  background: "radial-gradient(ellipse 95% 85% at 60% 50%, rgba(5,12,24,0.55), transparent 72%)",
                }}
                aria-hidden
              />
              {inv.dossierItems.map((item, i) => (
                <RevealOnScroll key={item.title} delay={60 + i * 50}>
                  <div className={`py-[18px] ${i < inv.dossierItems.length - 1 ? "border-b border-white/[0.07]" : ""}`}>
                    <h3 className="text-[15px] font-semibold leading-snug text-white">{item.title}</h3>
                    <p className="mt-1.5 text-[13.5px] leading-relaxed text-steel-400">{item.text}</p>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ── E. Process — icon stepper with arrows ── */}
      <section className="bg-white">
        <Container className="py-16 lg:py-24">
          <RevealOnScroll>
            <div className="mb-14 max-w-2xl">
              <Eyebrow>{inv.processTitle}</Eyebrow>
              <h2 className="mt-4 text-[1.875rem] font-semibold leading-[1.15] tracking-[-0.01em] text-[#1F4488] sm:text-[2.25rem] lg:text-[2.625rem]">
                {inv.processTitle}
              </h2>
            </div>
          </RevealOnScroll>

          {/* Desktop: horizontal with arrows */}
          <div className="hidden sm:flex sm:items-start sm:justify-between">
            {inv.processSteps.map((step, i) => (
              <RevealOnScroll key={step.label} delay={i * 140} className="flex items-start">
                {/* Step */}
                <div className="flex w-40 flex-col items-center text-center lg:w-44">
                  <Image
                    src={["/icons/process/ihtiyac-analizi.png", "/icons/process/teknik-secim.png", "/icons/process/sartname-hazirligi.png", "/icons/process/teklif-dosyasi.png", "/icons/process/tedarik-koordinasyonu.png"][i]}
                    alt={step.label}
                    width={120}
                    height={120}
                    className="mb-4 h-[68px] w-[68px] object-contain lg:h-[76px] lg:w-[76px]"
                  />
                  <h3 className="text-sm font-semibold text-[#14171d]">{step.label}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-ink-500">{step.text}</p>
                </div>
                {/* Arrow between steps */}
                {i < inv.processSteps.length - 1 && (
                  <div className="process-arrow mt-7 flex shrink-0 items-center px-1 lg:mt-8 lg:px-2">
                    <svg viewBox="0 0 32 16" width={28} height={14} fill="none" aria-hidden>
                      <path d="M0 8h26M20 2l6 6-6 6" stroke="#1F4488" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </RevealOnScroll>
            ))}
          </div>

          {/* Mobile: vertical with down arrows */}
          <ol className="flex flex-col items-center gap-0 sm:hidden">
            {inv.processSteps.map((step, i) => (
              <RevealOnScroll key={step.label} delay={i * 100}>
                <li className="flex flex-col items-center text-center">
                  <Image
                    src={["/icons/process/ihtiyac-analizi.png", "/icons/process/teknik-secim.png", "/icons/process/sartname-hazirligi.png", "/icons/process/teklif-dosyasi.png", "/icons/process/tedarik-koordinasyonu.png"][i]}
                    alt={step.label}
                    width={120}
                    height={120}
                    className="mb-3 h-14 w-14 object-contain"
                  />
                  <h3 className="text-sm font-semibold text-[#14171d]">{step.label}</h3>
                  <p className="mt-1 max-w-xs text-xs leading-relaxed text-ink-500">{step.text}</p>
                  {i < inv.processSteps.length - 1 && (
                    <div className="process-arrow my-3">
                      <svg viewBox="0 0 16 28" width={14} height={24} fill="none" aria-hidden>
                        <path d="M8 0v22M2 16l6 6 6-6" stroke="#1F4488" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  )}
                </li>
              </RevealOnScroll>
            ))}
          </ol>
        </Container>
      </section>

      {/* ── F. Grant / Project Support — hero-style bg image ── */}
      <section className="relative overflow-hidden bg-[#040911] text-white lg:min-h-[480px]">
        {/* Blurred bg layer */}
        <Image
          src="/hero/hibe-destek.png"
          alt=""
          fill
          sizes="100vw"
          className="scale-[1.06] object-cover object-[65%_center] opacity-[0.4] blur-[12px]"
        />
        <div className="absolute inset-0 bg-[#040911]/55" aria-hidden />

        {/* Sharp image layer (desktop) */}
        <div
          className="pointer-events-none absolute inset-0 hidden lg:block"
          style={{
            WebkitMaskImage: "linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.04) 8%, rgba(0,0,0,0.14) 16%, rgba(0,0,0,0.32) 24%, rgba(0,0,0,0.54) 32%, rgba(0,0,0,0.76) 40%, rgba(0,0,0,0.92) 48%, rgba(0,0,0,1) 56%, rgba(0,0,0,1) 100%)",
            maskImage: "linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.04) 8%, rgba(0,0,0,0.14) 16%, rgba(0,0,0,0.32) 24%, rgba(0,0,0,0.54) 32%, rgba(0,0,0,0.76) 40%, rgba(0,0,0,0.92) 48%, rgba(0,0,0,1) 56%, rgba(0,0,0,1) 100%)",
          }}
        >
          <div className="flex h-full items-center justify-end">
            <Image
              src="/hero/hibe-destek.png"
              alt=""
              width={1920}
              height={1080}
              sizes="72vw"
              className="h-full w-auto max-w-[74%] object-contain object-right"
            />
          </div>
        </div>

        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(90deg, rgba(4,9,17,0.98) 0%, rgba(4,9,17,0.96) 16%, rgba(4,9,17,0.90) 30%, rgba(4,9,17,0.74) 42%, rgba(4,9,17,0.50) 56%, rgba(4,9,17,0.24) 72%, rgba(4,9,17,0.08) 88%, rgba(4,9,17,0.02) 100%)",
          }}
          aria-hidden
        />
        {/* Bottom seam softener */}
        <div
          className="pointer-events-none absolute bottom-0 left-[24%] hidden h-[55%] w-[28%] lg:block"
          style={{
            background: "linear-gradient(90deg, rgba(4,9,17,0.75) 0%, rgba(4,9,17,0.50) 28%, rgba(4,9,17,0.22) 58%, transparent 100%)",
            filter: "blur(10px)",
          }}
          aria-hidden
        />
        {/* Mobile overlay */}
        <div className="absolute inset-0 bg-[#040911]/50 lg:hidden" aria-hidden />

        <Container className="relative py-16 lg:py-24">
          <RevealOnScroll>
            <div className="max-w-2xl">
              <Eyebrow tone="light">{locale === "tr" ? "Proje Desteği" : "Project Support"}</Eyebrow>
              <h2 className="mt-4 text-[1.75rem] font-semibold leading-[1.15] tracking-[-0.01em] text-white sm:text-[2rem] lg:text-[2.25rem]">
                {inv.grantTitle}
              </h2>
              <p className="mt-4 text-[15px] leading-[1.7] text-steel-300">
                {inv.grantText}
              </p>

              {/* Roles — premium list items */}
              <ul className="mt-8 flex flex-col gap-5">
                {inv.grantRoles.map((role) => (
                  <li key={role.title} className="flex items-start gap-3">
                    <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-brand-300" />
                    <div>
                      <span className="text-[15px] font-semibold text-white">{role.title}</span>
                      <span className="mx-1.5 text-steel-500">—</span>
                      <span className="text-[14px] leading-relaxed text-steel-300">{role.text}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </RevealOnScroll>
        </Container>
      </section>

      {/* ── G. Europe Partnerships ── */}
      <section className="relative overflow-hidden bg-[#0a0f1a] text-white">
        {/* Subtle ambient glow behind map area */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse 55% 65% at 70% 50%, rgba(30,68,136,0.14), transparent 70%)" }}
          aria-hidden
        />
        <Container className="relative py-16 lg:py-24">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[34%_1fr] lg:gap-10">
            <RevealOnScroll>
              <div>
                <Eyebrow tone="light">{locale === "tr" ? "Avrupa İş Birlikleri" : "European Partnerships"}</Eyebrow>
                <h2 className="mt-4 text-[1.75rem] font-semibold leading-[1.15] tracking-[-0.01em] text-white sm:text-[2rem] lg:text-[2.25rem]">
                  {inv.partnerTitle}
                </h2>
                <p className="mt-4 text-[15px] leading-[1.7] text-steel-300">{inv.partnerText}</p>
                <ul className="mt-6 flex flex-col gap-3">
                  {inv.partnerTypes.map((t) => (
                    <li key={t} className="flex items-center gap-3 text-[14px] text-steel-300">
                      <CheckIcon className="h-4 w-4 shrink-0 text-brand-300" />
                      {t}
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <ButtonLink
                    href={`${localePath(locale, routes.investment)}?type=partner#yatirim-formu`}
                    variant="primary"
                    size="lg"
                    withArrow
                  >
                    {inv.partnerCta}
                  </ButtonLink>
                </div>
              </div>
            </RevealOnScroll>

            {/* Right: map — no box, transparent bg, soft edge fade */}
            <div className="hidden lg:block">
              <EuropePartnershipMap />
            </div>
            <div className="lg:hidden">
              <EuropePartnershipMap />
            </div>
          </div>
        </Container>
      </section>

      {/* ── H. Form ── */}
      <section id="yatirim-formu" className="relative scroll-mt-[70px] overflow-hidden bg-[#0b1e38]">
        <Container className="relative py-16 lg:py-24">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
            <RevealOnScroll>
              <div className="text-white">
                <h2 className="font-display text-3xl leading-tight sm:text-4xl">{inv.formTitle}</h2>
                <p className="mt-4 text-base leading-relaxed text-steel-300">{inv.formSubtitle}</p>
                <ul className="mt-8 flex flex-col gap-3">
                  {inv.formBullets.map((b) => (
                    <li key={b} className="flex items-start gap-3 text-sm leading-relaxed text-steel-300">
                      <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand-300" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </RevealOnScroll>
            <RevealOnScroll delay={100}>
              <InvestmentForm dict={dict} />
            </RevealOnScroll>
          </div>
        </Container>
      </section>
    </>
  );
}
