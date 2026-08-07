import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Manrope, Inter } from "next/font/google";
import { locales, isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { PageTransition } from "@/components/PageTransition";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : "tr");
  const title = `${dict.meta.siteName} — ${dict.meta.tagline}`;
  return {
    title: {
      default: title,
      template: `%s · ${dict.meta.titleSuffix}`,
    },
    description: dict.footer.about,
    metadataBase: new URL("https://borsanteknoloji.com"),
    openGraph: {
      title,
      description: dict.footer.about,
      type: "website",
      locale: locale === "tr" ? "tr_TR" : "en_US",
      siteName: dict.meta.siteName,
    },
    alternates: {
      languages: { tr: "/tr", en: "/en" },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const typedLocale: Locale = locale;
  const dict = getDictionary(typedLocale);

  const siteUrl = "https://borsanteknoloji.com";
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Borsan Teknoloji",
        url: siteUrl,
        logo: `${siteUrl}/branding/logo.png`,
        image: `${siteUrl}/branding/logo.png`,
        email: dict.contact.email,
        telephone: dict.contact.phone.split("\n")[0],
        address: {
          "@type": "PostalAddress",
          streetAddress: "Topçular Mah. Maltepe Cd. No:4/1 D:18",
          addressLocality: "Eyüpsultan",
          addressRegion: "İstanbul",
          addressCountry: "TR",
        },
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        name: "Borsan Teknoloji",
        url: siteUrl,
        publisher: { "@id": `${siteUrl}/#organization` },
        inLanguage: locale === "tr" ? "tr-TR" : "en-US",
      },
    ],
  };

  return (
    <html lang={locale} className={`${inter.variable} ${manrope.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-white text-ink-900 antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SmoothScrollProvider>
          <Header locale={typedLocale} dict={dict} />
          <main className="flex-1">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer locale={typedLocale} dict={dict} />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
