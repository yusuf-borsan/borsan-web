# Borsan Teknoloji — Kurumsal Web Platformu

CNC takım tezgahları satışı yapan Borsan Teknoloji için modern, çok dilli (TR/EN)
kurumsal web platformu. Next.js App Router + TypeScript + Tailwind CSS v4 ile
geliştirilmiştir. Endüstriyel, mühendislik odaklı ve premium bir tasarım dili kullanır.

## Teknoloji

- **Next.js 16** (App Router, Turbopack) — tamamen statik (SSG) üretim
- **TypeScript**
- **Tailwind CSS v4** (CSS-first `@theme` tasarım sistemi)
- **Çok dil**: Türkçe (varsayılan) + İngilizce, `[locale]` route segmenti + `proxy.ts` ile
- **SEO**: locale başına `generateMetadata`, OpenGraph, `alternates.languages`
- Gelecekte **Supabase** entegrasyonuna uygun, veri katmanı ayrık mimari

## Çalıştırma

```bash
npm install
npm run dev      # http://localhost:3000  → /tr adresine yönlenir
npm run build    # statik üretim (43 sayfa)
npm run start    # üretim sunucusu
```

## Proje Yapısı

```
src/
  app/
    layout.tsx                 # kök (html/body alt katmanda)
    [locale]/
      layout.tsx               # <html lang>, fontlar, Header + Footer, metadata
      page.tsx                 # Ana Sayfa (hero, kategoriler, avantajlar, referanslar, CTA)
      urunler/                 # Ürünler listesi
        [category]/            # Kategori → model listesi
          [product]/           # Ürün detay (galeri, teknik tablo, katalog, teklif formu)
      hakkimizda/  servis/  iletisim/
      not-found.tsx
  components/                  # Header, Footer, ui, sections, icons, Gallery, QuoteForm ...
  i18n/
    config.ts                  # locale tanımları
    dictionaries/{tr,en}.ts    # tüm arayüz metinleri (tek kaynak)
  lib/
    products.ts                # ürün/kategori verisi (çift dilli)  ← Supabase'e taşınabilir
    routes.ts                  # locale'li yol yardımcıları
  proxy.ts                     # locale yönlendirme (eski adıyla middleware)
public/
  branding/  logo/  hero/  machines/  categories/  company/  references/  catalogs/
scripts/generate_svgs.py       # placeholder görselleri yeniden üretmek için
```

## Marka Kimliği

Logodan örneklenen gerçek marka renkleri (`src/app/globals.css` içinde token):

- **Marka mavisi** `#1F4488` (BORSAN yazısı) → vurgu rengi `--color-brand-600`
- **Marka grisi** `#606060` (TEKNOLOJİ alt yazısı) → yardımcı renk `--color-steel-600`
- Koyu antrasit yüzeyler `--color-ink-*`, beyaz ve açık gri

Logo varlıkları:

- `public/branding/logo.png` — renkli logo (açık zeminli header için)
- `public/branding/logo-white.png` — beyaz logo (koyu footer için)

## Görseller (Önemli)

`public/{categories,machines,hero}` altındaki `.svg` dosyaları **geçici mühendislik
şematiği placeholder'larıdır**. Gerçek makine fotoğrafları geldiğinde iki yol var:

1. Aynı dosya adıyla `.svg` yerine koyup `src/lib/products.ts` içindeki `image`/`gallery`
   yollarını yeni dosya adlarıyla güncelleyin, **veya**
2. Fotoğrafları ilgili klasöre atıp veri dosyasındaki yolları düzenleyin.

`next.config.ts` içindeki `dangerouslyAllowSVG` yalnızca bu placeholder'lar içindir;
gerçek görsellere geçince kaldırılabilir.

## İçerik Düzenleme

- **Arayüz metinleri**: `src/i18n/dictionaries/tr.ts` ve `en.ts` (her iki dosya aynı şekle sahip olmalı).
- **Ürünler / teknik özellikler**: `src/lib/products.ts`.
- **İletişim bilgileri**: dictionaries içindeki `contact` bölümü.

> Not: Bu sürüm bir **prototiptir**. Teklif/iletişim formları henüz veri göndermez
> (client tarafında başarı ekranı gösterir). Supabase veya bir e-posta servisine
> bağlanması sonraki aşamadır.
