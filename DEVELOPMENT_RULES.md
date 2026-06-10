# DEVELOPMENT RULES — Borsan Teknoloji Web Platformu

> **Bu dosya, projeyi devralacak yeni Claude oturumları içindir.**
> Amaç: yeni bir oturumun farklı/keyfi kararlar verip oturmuş mimariyi bozmasını
> önlemek. Aşağıdaki kurallar **bağlayıcıdır**. Bir kuralı ihlal etmeden önce
> kullanıcıdan **açık onay** al ve gerekçeni yaz.
>
> Bağlam için önce oku: `PROJECT_HANDOFF.md` (durum), `CHANGELOG.md` (geçmiş),
> `README.md` (genel bakış). Sürüm: v2.8.0.

---

## 0. Altın Kurallar (önce bunlar)

1. **Renk paletini DEĞİŞTİRME.** Marka mavisi `#1F4488`, gri `#606060`, antrasit/beyaz/
   açık gri. Yeni renk token'ı uydurma.
2. **TypeScript tiplerini BOZMA.** Özellikle `Localized = Record<"tr"|"en", string>` ve
   `Dictionary = typeof tr` türetimi. `tr.ts` ve `en.ts` **birebir aynı şekle** sahip olmalı.
3. **i18n'i BOZMA.** Kullanıcıya görünen HER metin sözlükte; iki dil de eksiksiz.
4. **Yeni Tailwind utility sınıfı eklediysen `rm -rf .next` yap** (Turbopack önbelleği
   yeni sınıfı üretmeyebilir). Bu en sık tuzak.
5. **Ürün fotoğraflarında `object-cover` KULLANMA.** Standart: `bg-white` + `object-contain`.
6. **Kullanıcı istemeden commit/push/sürüm YAPMA.** Yalnızca açıkça istendiğinde.
7. **Mevcut deseni taklit et, yeniden icat etme.** Yeni iş için önce benzer mevcut
   kodu bul, aynı kalıbı uygula.

---

## 1. Mevcut Mimari Neden Seçildi

| Karar | Gerekçe |
|---|---|
| **Next.js App Router + tam statik (SSG)** | Vitrin sitesi; içerik build-time'da sabit. Hızlı, ucuz host, iyi SEO. Sunucu/runtime gerekmiyor. |
| **Özel sözlük tabanlı i18n** (next-intl YOK) | Bağımlılığı az tutmak, build-time çözümleme, tam kontrol. `[locale]` segment + `proxy.ts` yönlendirme yeterli. |
| **Mock data (`products.ts`) — DB yok** | Prototip aşaması; içerik az ve sabit. Yapı bilinçli olarak **Supabase'e taşınabilir** şekilde (`Localized`, `features?: text[]`) kuruldu. |
| **Tailwind v4 `@theme` token'ları** | Tek kaynaktan tasarım sistemi (renk/animasyon). Marka renkleri token olarak; tutarlılık. |
| **Minimal bağımlılık** (sadece next/react) | Bakım yükü, güvenlik yüzeyi ve bundle düşük. Her ek paket bilinçli karar olmalı. |
| **Server component varsayılan** | Daha az JS, daha hızlı. `"use client"` yalnızca etkileşim gerektiğinde. |

**Sonuç:** Mimari "küçük, hızlı, bakımı kolay, sonradan büyütülebilir" üzerine kurulu.
Bunu koru.

---

## 2. Hangi Teknolojiler KULLANILMALI

- **Next.js App Router** (mevcut sürüm), **TypeScript**, **Tailwind CSS v4**.
- **`next/image`** tüm görseller için (optimizasyon).
- **`next/font/google`** — fontlar `latin-ext` subset'i ile (Türkçe karakterler için zorunlu).
- **Server component** varsayılan; etkileşim için **client component** (`"use client"`).
- Form backend gerektiğinde: **Supabase** (DB) ve/veya **Resend / SMTP** (e-posta).
  *Mimari zaten buna uygun tasarlandı.*
- Görsel/PDF/docx işleme scriptleri: **Python 3.12** (PATH'te değil, tam yol:
  `C:\Users\Yusuf\AppData\Local\Programs\Python\Python312\python.exe`), `pillow`,
  `python-docx`, `zipfile`.
- Deploy: **Vercel** (planlanan).

---

## 3. Hangi Teknolojiler KULLANILMAMALI (gerekçesiz)

- ❌ **next-intl / react-i18next** vb. — mevcut özel i18n yeterli; değiştirme.
- ❌ **Ağır UI kütüphaneleri** (MUI, Chakra, Ant, Bootstrap). Tailwind + kendi `ui`
  primitive'lerimiz kullanılır.
- ❌ **CSS-in-JS** (styled-components, emotion). Yalnızca Tailwind + `globals.css`.
- ❌ **Redux / Zustand / global state** — bu sitede gereksiz; lokal `useState` yeter.
- ❌ **jQuery, moment.js, lodash** ve benzeri eski/ağır paketler.
- ❌ **ORM / ağır data katmanı** prototipte — Supabase client doğrudan yeterli olacak.
- ❌ **Animasyon kütüphanesi** (Framer Motion vb.) — mevcut CSS/`rAF` çözümleri korunur,
  yenisi gerekçesiz eklenmez.
- Genel kural: **yeni bağımlılık = bilinçli karar**. Kullanıcıya gerekçesini söyle.

---

## 4. Hangi Durumlarda REFACTOR Yapılabilir

- ✅ **Mock data → Supabase** taşıması (planlı; `products.ts` yapısı korunarak DB'ye map'lenir).
- ✅ **Admin panel + authentication** eklenmesi (Supabase Auth) — yeni alan, mevcut sayfaları bozmadan.
- ✅ **SEO dosyaları** ekleme (`sitemap.ts`, `robots.ts`, `manifest.ts`, JSON-LD) — eklemeli, yıkıcı değil.
- ✅ **Form backend'i** bağlama (`QuoteForm`'a action/fetch) — UI aynı kalır.
- ✅ Tekrarlayan kodu mevcut `ui`/`sections` primitive'lerine çıkarma.
- ✅ Performans/erişilebilirlik iyileştirmeleri (token/yapı korunarak).

Refactor ederken: **küçük, izole, geri alınabilir** adımlar; mevcut tasarım dili ve
tiplere sadık kal; her adımda derle + test et.

---

## 5. Hangi Durumlarda Mevcut Yapı KORUNMALI

- 🔒 **i18n mimarisi** (`[locale]` + `proxy.ts` + sözlükler). Yeniden yazma.
- 🔒 **Tasarım token'ları** (`globals.css` `@theme`) ve renk paleti.
- 🔒 **`Localized` ve `Dictionary` tip yapısı.**
- 🔒 **Component yapısı ve `ui` primitive'leri** (Container, Button/ButtonLink,
  SectionHeading, Eyebrow). Yeni stil yerine bunları kullan.
- 🔒 **Sürümleme akışı** (git tag + GitHub Release + CHANGELOG).
- 🔒 **Statik (SSG) yaklaşım** — runtime/SSR'a gerekçesiz geçme.
- 🔒 **Route slug'ları** Türkçe (`/urunler`, `/hakkimizda`...) — kullanıcı istemeden lokalize etme.
- 🔒 **Ürün galerisi standardı** (beyaz zemin + object-contain).

---

## 6. Ürün Ekleme Standardı

Bu projede 2 kez uygulanan, **değiştirilmeyecek** akış:

1. **Veri kaynağı**: Resmi katalog **docx/PDF**'inden çek (`python-docx` / `pypdf` ile
   tabloları UTF-8 dosyaya yaz; cp1254 hatasından kaçınmak için stdout'a yazma).
2. **`src/lib/products.ts`** içine ilgili kategorinin `products` dizisine yeni `Product`
   nesnesi ekle. **Zorunlu alanlar** (hepsi TR + EN):
   - `slug`, `model`, `categorySlug`, `name` (resmi tam ad), `summary`
   - `highlights`: **mühendis odaklı 4 madde** (eksen/hassasiyet/iş mili/rijitlik gibi
     en güçlü özellikler, kurumsal dille yorumlanmış)
   - `features`: daha geniş avantaj listesi (Ürün Özellikleri sekmesi)
   - `specs`: teknik tablo (kataloğdaki tüm anlamlı satırlar; tekrarlayan etiketler için
     `L` sabitini kullan, ürüne özel olanları inline `{ tr, en }` yaz)
   - `image` (ana = 1. fotoğraf), `gallery` (3–4'e kadar), `catalog` (placeholder PDF yolu)
3. **Marka adı standardı**: `name` = `"JIANKE - <MODEL> CNC Kayar Otomat"` (TR) /
   `"JIANKE - <MODEL> Swiss Type Lathe"` (EN). **JIANKE her yerde BÜYÜK HARF.**
4. **Teklif formu** ürün adını otomatik gösterir (ürün detay sayfası `defaultProduct={p.name[locale]}`
   geçer) — ekstra iş gerekmez.
5. Ekledikten sonra: **`rm -rf .next && npm run build`** ile derle, TR+EN rotalarını ve
   teknik tablonun tek satır (taşmasız) durduğunu doğrula.

> Not: Spec değerlerinde TR ondalık virgül (`0,001`), EN nokta (`0.001`); binlik için
> TR nokta (`3.050`), EN virgül (`3,050`).
>
> **Spec değerlerini KISA tut.** Uzun bileşik string YASAK (örn. `"3,5 / 3,5 kW (nom.) — 6,0 / 6,0 kW (maks.)"`).
> Doğru form: `"3,5 / 6,0 kW"`. Uzun değer → `whitespace-nowrap` olsa bile tablo yatay kayar.

---

## 7. Görsel Ekleme Standardı

- **Konum**: ürün görselleri `public/machines/swiss-type/` (veya ilgili klasör);
  kategori görselleri `public/categories/`; hero `public/hero/`.
- **İsimlendirme**: `<model-slug>-1..N` (örn. `ma25-6s-1.png`). 1. görsel = **ana/kart
  görseli** (genelde makine fotoğrafı).
- **Gösterim standardı (KRİTİK)**: Galeri ve ürün kartlarında **`bg-white` +
  `object-contain`**. `object-cover` KULLANMA (ürünü kırpar).
- **Arka plan**: Ürün fotoğrafları **beyaz arka planlı** olmalı.
  - Kaynak siyah/şeffaf ise işle: saf siyah stüdyo zemini → `PIL.ImageDraw.floodfill`
    ile beyaza çevir (eşik ~30; makinenin koyu kısmı ~40 olduğu için güvenli).
  - Beyaz yazılı/şeffaf teknik diyagramları **beyaza çevirme** (yazı kaybolur);
    mümkünse kullanıcıdan beyaz-zemin sürümü iste.
- **Placeholder**: gerçek foto yoksa `scripts/generate_svgs.py` ile blueprint SVG üret
  (4:3, koyu antrasit zemin — `bg-white`/`object-contain` ile uyumlu, tam doldurur).
- **Kaynak bulma — ZORUNLU KURAL**: Görseller **yalnızca kullanıcının sohbete yüklediği
  fotoğraflardan alınır.** Kullanıcı yüklenen görselleri masaüstündeki
  `publicmachinesswiss-type` klasörüne kaydeder; oradan `public/machines/swiss-type/`'a
  kopyalanır. Kullanıcı sohbete yüklediğinde bu klasörde ara.
  **PDF/docx içinden görsel çekmek YASAK** (düşük kalite, yanlış arka plan).
- Görsel dosyasını değiştirdiysen Next/Image önbelleği için **`rm -rf .next`** + sert yenileme.

---

## 8. Hero Fotoğraf Ekleme Standardı

### Yerleştirme Kuralı (height-fit + right-align) — DEĞİŞTİRME

Hero slaytlarında **`next/image fill` KULLANMA**. Fill her zaman konteyner genişliğini
tam doldurur; bu durumda `objectPosition X` sıfır etki yapar ve zoom şart olur.

**Doğru yöntem** — `HeroCarousel.tsx` `heightFitConfig` lookup tablosu:

```tsx
const heightFitConfig: Record<string, { mirror: boolean; rightOffset?: number; leftFade?: boolean }> = {
  "/hero/hero-main.png":  { mirror: true  },   // odak sol yarıda → çevir
  "/hero/hero-main2.png": { mirror: false },
  "/hero/hero-main3.png": { mirror: false },
  "/hero/hero-main4.png": { mirror: false, rightOffset: 180, leftFade: true },
};
```

```tsx
// Render — zoom yok, scaling değişmez, sadece konum:
<img
  src={slide.image}
  alt=""
  className="absolute top-0 h-full w-auto"
  style={{
    right: rightOffset !== undefined ? `-${rightOffset}px` : "0",
    transform: mirror ? "scaleX(-1)" : undefined,
    WebkitMaskImage: leftFade ? "linear-gradient(to right, transparent 0%, black 28%)" : undefined,
    maskImage:       leftFade ? "linear-gradient(to right, transparent 0%, black 28%)" : undefined,
  }}
/>
```

### Parametreler
| Parametre | Açıklama |
|-----------|----------|
| `mirror: true` | `scaleX(-1)` — odak noktası sol yarıdaysa çevir (sağa taşır) |
| `rightOffset: N` | CSS `right: -Npx` — fotoğrafı N px sağa kaydır (zoom yok, sağ N px kayar) |
| `leftFade: true` | CSS `mask-image` gradyanı — fotoğrafın sol kenarı şeffaftan opağa (0→28%) geçişli |

### Gradyan Overlay (global, tüm slaytlar — değiştirme)
```
linear-gradient(90deg, #0c0e13 0%, rgba(12,14,19,0.88) 42%, rgba(12,14,19,0.25) 100%)
```

### Yeni Slayt Fotoğrafı Eklerken
1. Kaynak: masaüstündeki `publicmachinesswiss-type\` klasöründen kopyala → `public/hero/hero-mainN.png`
2. Fotoğrafı incele: **odak noktası hangi yüzde**?
   - Sağ yarıda (%50+): `mirror: false` (doğal yerleşim yeterli)
   - Sol yarıda (<%45): `mirror: true` (çevirince sağa geçer)
   - Hâlâ yazı altında: `rightOffset: 150–200` ekle
   - Sol kenar görünür kesiliyor: `leftFade: true` ekle
3. `tr.ts` ve `en.ts` ilgili slaytın `image` alanını güncelle
4. `npx tsc --noEmit` temiz olmalı
5. `eslint-disable-next-line @next/next/no-img-element` yorumu `<img>` satırının üstünde olmalı

---

## 8. PDF (Katalog) Ekleme Standardı

- **Konum**: `public/catalogs/swiss-type/<model-slug>.pdf` (veya ilgili klasör).
- Gerçek katalog yoksa: **`scripts/make_placeholder_pdf.py`** ile geçerli (açılabilir),
  minimal bir **yer tutucu PDF** üret (xref offsetleri hesaplı). 404'lü/bozuk link bırakma.
- `products.ts`'te `catalog: "/catalogs/swiss-type/<slug>.pdf"` olarak bağla.
- Ürün detayındaki "Teknik Katalog" alanı bu yolu kullanır; ekstra iş yok.

---

## 9. i18n Standardı

- **Kaynak**: `src/i18n/dictionaries/tr.ts` (ana, `Dictionary` tipini türetir) ve
  `en.ts`. **İkisi birebir aynı şekle** sahip olmalı; yeni alan eklersen **iki dosyaya da** ekle.
- Kullanıcıya görünen **hiçbir metni hardcode etme** — sözlüğe ekle.
- **Ürün/kategori verisi** `Localized` (`{ tr, en }`) alanlar taşır; tek dil yazma.
- `locale` çözümleme: `isLocale()`, `getDictionary(locale)`. Diller: `tr` (varsayılan), `en`.
- Yeni dil eklemek istenirse: `config.ts` `locales` dizisi + her sözlük + her `Localized`
  alanın o dili — büyük iş, yalnızca açıkça istenirse.
- **Route slug'ları her iki dilde Türkçedir** (`/en/urunler`). Bilinçli; isteğe bağlı
  lokalize edilebilir (Roadmap), ama varsayılan budur.

---

## 10. Tasarım Dili

- **His**: Endüstriyel · mühendislik · premium. Startup/SaaS gibi DURMASIN.
- **Renkler** (token, `globals.css`): `brand` (mavi #1F4488 ve skala), `ink` (antrasit
  yüzeyler), `steel` (gri #606060 ve nötrler), beyaz, açık gri. **Sadece bu token'lar.**
- **Tipografi**: Display = Archivo (büyük, sıkı), gövde = Inter. Büyük başlıklar tercih
  edilir. Başlıklarda `text-wrap: balance`, lead paragraflarda `text-pretty`.
- **Düzen**: aşırı kart yapısından kaçın; geniş tipografi, bol boşluk, ince "engineering"
  detaylar (grid arka plan, eyebrow çizgileri, dimension/blueprint estetiği).
- **Teknik tablolar**: `whitespace-nowrap` — satır kırılması/taşma OLMASIN.
- **Marka adı**: **JIANKE** her zaman büyük harf.
- **Animasyonlar**: var olanları koru (hero fade carousel, sağ panel kayma, rAF marquee).
  Safari/Chrome uyumlu (`translate3d`), `prefers-reduced-motion` saygılı. Yeni animasyonu
  abartma.

---

## 11. Kod Yazma Prensipleri

- **Server component varsayılan.** `"use client"` yalnızca state/etkileşim için
  (HeroCarousel, ProductTabs, Gallery, QuoteForm, Header, LocaleSwitcher, ReferenceMarquee).
- **Next 16 async params**: sayfalar `params: Promise<{...}>` alır; `await params` kullan.
- **Yeni dinamik route** → `generateStaticParams` + `generateMetadata` ekle.
- **Linkler**: `localePath(locale, routes.x)` ve `routes` yardımcısı; elle `/tr/...` yazma.
- **Mevcut primitive'leri kullan**: `Container`, `Button`/`ButtonLink`, `SectionHeading`,
  `Eyebrow`, `icons`. Yeni stilli buton/başlık uydurma.
- **Tailwind**: sadece tema token'ları (`bg-brand-600`, `text-ink-900`...). Keyfi hex yok.
  Yeni utility sınıfında **`.next` temizliği** gerekebilir.
- **Tipler**: `any` kullanma; `Localized`/`Dictionary`/`Product`/`Spec` tiplerine sadık kal.
- **Doğrulama**: her değişiklikten sonra **`npm run build`** (gerekirse `rm -rf .next`
  ile) ve mümkünse tarayıcıda kontrol. Önizleme aracının ekran görüntüleri bazen
  güvenilmez — doğrulamayı `curl` + `preview_eval` ölçümleriyle yap.
- **Küçük, odaklı değişiklik**; gereksiz dosya/yapı oluşturma.

---

## 12. Bu Proje İçin YASAK Kararlar

- 🚫 Renk paletini değiştirmek / yeni marka rengi uydurmak.
- 🚫 `Localized` / `Dictionary` tip yapısını kırmak; `tr.ts` ile `en.ts`'i farklı şekle sokmak.
- 🚫 Tek dilde metin eklemek; kullanıcıya görünen metni hardcode etmek.
- 🚫 i18n'i başka kütüphaneyle değiştirmek; routing/`proxy.ts`'i gerekçesiz elden geçirmek.
- 🚫 Ürün fotoğraflarında `object-cover` veya koyu kart zemini kullanmak.
- 🚫 Ağır bağımlılık / UI framework / CSS-in-JS / global state eklemek.
- 🚫 SSG'den gerekçesiz SSR/runtime'a geçmek.
- 🚫 Kullanıcı istemeden commit/push yapmak, sürüm/etiket/Release oluşturmak.
- 🚫 Yeni Tailwind sınıfı ekleyip `.next` temizlemeden "çalışmıyor" diye yapıyı değiştirmek.
- 🚫 Mock data yapısını DB planı olmadan dağıtmak/yeniden kurgulamak.
- 🚫 `JIANKE` markasını küçük harfle yazmak (her yerde büyük harf zorunludur).
- 🚫 Ürün görselini PDF/docx'ten çekmek — **yalnızca kullanıcının sohbete yüklediği
  fotoğraflar** kullanılır.
- 🚫 Teknik tablo spec değerlerine uzun bileşik string yazmak — tablo kaydırmalı olur.
- 🚫 Bozuk/404 link (eksik görsel/PDF) bırakmak — placeholder üret.
- 🚫 Mevcut sürümleri (tag/Release) değiştirmek/silmek; geçmişi yeniden yazmak.

---

## 13. Yeni Oturum İçin Hızlı Başlangıç Kontrol Listesi

1. `PROJECT_HANDOFF.md` + bu dosyayı oku.
2. `git branch --show-current` (main mi?) ve `git status` (temiz mi?).
3. İstenen iş için **benzer mevcut kodu bul**, aynı deseni uygula.
4. Yeni Tailwind sınıfı eklediysen `rm -rf .next`.
5. `npm run build` ile doğrula; TR+EN kontrol et.
6. Commit/push/sürüm **yalnızca kullanıcı isterse**.
7. Şüphedeysen: **mevcut yapıyı koru, kullanıcıya sor.**
