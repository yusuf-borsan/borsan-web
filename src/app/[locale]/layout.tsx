import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Archivo, Inter } from "next/font/google";
import { locales, isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  display: "swap",
});

const archivo = Archivo({
  subsets: ["latin", "latin-ext"],
  weight: ["600", "700", "800", "900"],
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
    icons: { icon: "/favicon.ico" },
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

  return (
    <html lang={locale} className={`${inter.variable} ${archivo.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-white text-ink-900 antialiased">
        <Header locale={typedLocale} dict={dict} />
        <main className="flex-1">{children}</main>
        <Footer locale={typedLocale} dict={dict} />
      </body>
    </html>
  );
}
