# PROJECT HANDOFF — Borsan Teknoloji Web Platformu

> Bu doküman, projeyi devralacak bir geliştirici için hazırlanmıştır. Projenin
> mevcut durumunu, eksiklerini ve production yol haritasını eksiksiz anlatır.
> Son güncelleme: 2026-06-09 · Sürüm: **v2.4.0** · Durum: **Prototip / MVP**

---

## 1. Projenin Amacı

**Borsan Teknoloji**, CNC takım tezgahları satışı yapan bir firmadır. Bu proje;
firmanın **çok dilli (TR/EN), kurumsal, mühendislik/premium hisli** web platformunun
temelidir. Hedef: ürünleri profesyonel şekilde sergilemek, mühendislik güveni vermek
ve **teklif talebi** toplamaktır. Servis hizmeti yalnızca firmadan makine alan
müşterilere verilir (sitede bu vurgulanır).

Mevcut aşama: **çalışan, profesyonel görünümlü bir prototip/MVP**. Tasarım, mimari ve
UX tamamlandı; gerçek içerik ve backend entegrasyonları henüz eksiktir.

---

## 2. Teknoloji Stack

| Katman | Teknoloji | Sürüm |
|---|---|---|
| Framework | Next.js (App Router, Turbopack) | 16.2.7 |
| UI kütüphanesi | React | 19.2.4 |
| Dil | TypeScript | ^5 |
| Stil | Tailwind CSS (v4, CSS-first `@theme`) | ^4 |
| Lint | ESLint + eslint-config-next | ^9 / 16.2.7 |
| Fontlar | `next/font/google` — Archivo (display), Inter (gövde), `latin-ext` | — |

- **Bağımlılıklar minimal**: yalnızca `next`, `react`, `react-dom`. Harici UI/form/auth/DB
  kütüphanesi YOK.
- **Render**: Tamamen statik (SSG). Son derlemede **57 sayfa** prerender ediliyor
  (`generateStaticParams` ile her locale + her ürün/kategori).
- **Çoklu dil**: Harici i18n kütüphanesi yok; **kendi sözlük tabanlı (custom dictionary)**
  altyapısı kullanılıyor (aşağıda).
- **Node**: 24.x ile geliştirildi. (Python 3.12, görsel/PDF/docx araç scriptleri için
  kullanılıyor — PATH'te değil, tam yol gerekiyor.)

---

## 3. Klasör Yapısı

```
borsan-web/
├─ public/
│  ├─ branding/            logo.png (renkli), logo-white.png (koyu zemin)
│  ├─ categories/          kategori görselleri (SVG blueprint placeholder)
│  ├─ hero/                hero.svg + swiss-type-v2.jpg (slayt 4 gerçek foto)
│  ├─ machines/            ürün görselleri (SVG placeholder)
│  │  └─ swiss-type/       JIANKE gerçek fotoğrafları (ma25-6s-*, ma25-5ii-*, ma12-5ii-*, mr32-5ii-*)
│  ├─ catalogs/swiss-type/ yer tutucu katalog PDF'leri (660 bayt, gerçek değil)
│  ├─ company/  references/ (boş — gelecekte gerçek görseller)
├─ scripts/
│  ├─ generate_svgs.py     blueprint placeholder görselleri üretir
│  └─ make_placeholder_pdf.py  yer tutucu katalog PDF üretir
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx         kök (sadece children — html/body alt katmanda)
│  │  ├─ globals.css        Tailwind @theme tasarım sistemi (renkler, animasyonlar)
│  │  ├─ favicon.ico        ⚠️ Next.js VARSAYILAN favicon (değiştirilmeli)
│  │  └─ [locale]/
│  │     ├─ layout.tsx      <html lang>, fontlar, Header+Footer, generateMetadata
│  │     ├─ page.tsx        Ana Sayfa (hero carousel, kategoriler, avantajlar, marquee, CTA)
│  │     ├─ not-found.tsx   404
│  │     ├─ hakkimizda/ servis/ iletisim/   kurumsal sayfalar
│  │     └─ urunler/
│  │        ├─ page.tsx                       ürün listesi (kategoriler)
│  │        ├─ [category]/page.tsx            kategori → model listesi
│  │        └─ [category]/[product]/page.tsx  ürün detayı (galeri, tab, teklif formu)
│  ├─ components/   Header, Footer, HeroCarousel, ReferenceMarquee, ProductTabs,
│  │               Gallery, QuoteForm, ProductCard, LocaleSwitcher, ui, icons, sections
│  ├─ i18n/
│  │  ├─ config.ts          locale tanımları (tr/en, default tr)
│  │  ├─ dictionaries/tr.ts, en.ts, index.ts   TÜM arayüz metinleri
│  ├─ lib/
│  │  ├─ products.ts        ⭐ TÜM ürün/kategori verisi (mock data)
│  │  └─ routes.ts          locale'li yol yardımcıları
│  └─ proxy.ts              locale yönlendirme (eski adıyla middleware)
├─ CHANGELOG.md, README.md, PROJECT_HANDOFF.md
```

---

## 4. Veritabanı Yapısı

**Gerçek veritabanı YOK.** Tüm içerik `src/lib/products.ts` içinde **TypeScript mock
data** olarak duruyor. Yapı, gelecekte **Supabase**'e taşınacak şekilde tasarlandı.

### Tip modeli (`src/lib/products.ts`)
```ts
type Localized = Record<"tr" | "en", string>;   // her alan iki dilli

type Spec     = { label: Localized; value: Localized };
type Product  = {
  slug, model, categorySlug: string;
  name, summary: Localized;
  highlights: Localized[];          // "Öne Çıkanlar" maddeleri
  features?: Localized[];           // "Ürün Özellikleri" sekmesi (Supabase'de text[])
  specs: Spec[];                    // teknik tablo
  image: string;                    // ana görsel
  gallery: string[];                // galeri görselleri
  catalog?: string;                 // PDF yolu (şimdilik placeholder)
};
type Category = { slug, icon, name, tagline, description, image, products };
```

### Mevcut içerik
- **7 kategori**: CNC Tornalar, CNC Dik/Yatay İşleme Merkezleri, Dik Tornalar, Taşlama,
  Dişli Profil Taşlama, **CNC Kayar Otomatlar**.
- **16 ürün** — bunların **4'ü GERÇEK** (resmi katalogdan, gerçek fotoğraflarla):
  `JIANKE MA25-6S`, `JIANKE MA25-5 II`, `JIANKE MA12-5 II`, `JIANKE MR32-5 II`.
  Diğer 12'si **placeholder/uydurma** (`BT-*` kodlu, blueprint SVG görselli).
- Gerçek ürünlerin tümü `cnc-kayar-otomatlar` kategorisindedir; her biri tam teknik tablo,
  özellikler sekmesi, galeri (3–4 fotoğraf) ve placeholder PDF kataloğa sahiptir.

### Supabase'e geçiş notu
- `Localized` alanlar → ya `*_tr`/`*_en` sütunlar ya da `jsonb`.
- `highlights`, `features` → `text[]` (i18n için `jsonb[]` veya ayrı tablo).
- `specs` → ayrı `product_specs` tablosu (product_id, label_tr, label_en, value_tr, value_en).
- `gallery` → ayrı `product_images` tablosu veya `text[]`.
- Öneri: `categories`, `products`, `product_specs`, `product_images`, `quote_requests`,
  `references` tabloları + Supabase Storage (görseller) + RLS.

---

## 5. Authentication Sistemi

**YOK.** Hiçbir kimlik doğrulama/oturum altyapısı kurulu değil (NextAuth, Supabase Auth,
Clerk vb. yok). Site tamamen herkese açık, statik bir vitrin. İleride **admin panel**
gerektiğinde auth eklenmeli (bkz. Roadmap).

---

## 6. Admin Panel Durumu

**YOK.** İçerik yönetimi için panel/CMS bulunmuyor. İçerik değiştirmek için **kodu
düzenleyip yeniden deploy** etmek gerekiyor. Bu, geliştirici olmayan kullanıcı (firma)
için sürdürülemez — Roadmap'te yüksek öncelikli.

---

## 7. Ürün Yönetim Sistemi

Şu an "ürün yönetimi" = **`src/lib/products.ts` dosyasını elle düzenlemek**.

- Yeni ürün eklemek için izlenen pattern (bu projede 4 kez uygulandı):
  1. Resmi katalog **docx/PDF**'inden teknik veriler çekilir (`python-docx` / `pypdf`).
  2. **Görseller YALNIZCA kullanıcının sohbete yüklediği fotoğraflardan alınır.**
     Kullanıcı görselleri masaüstündeki `publicmachinesswiss-type` klasörüne kaydeder;
     `public/machines/swiss-type/` altına kopyalanır (gerekirse beyaz arka plan işlenir).
     PDF/docx'ten görsel çekme — BU ARTIK YASAK.
  3. `products.ts`'e yeni `Product` nesnesi eklenir (TR/EN specs + features + highlights).
  4. Yer tutucu katalog PDF'i `public/catalogs/...` altına eklenir.
- **Görsel standardı**: ürün fotoğrafları **beyaz arka plan + `object-contain`** ile
  gösterilir (Gallery ve ProductCard). Siyah/şeffaf arka plan sorunlarını önler.
- **Görsel kaynağı kuralı**: fotoğraflar **yalnızca kullanıcının sohbete yüklediği**
  resimlerden alınır; PDF/docx'ten çekilmez.
- **Galeri**: ürün detayında 3–4 görsel + tıklanabilir küçük resimler.
- **Teknik tablo standardı**: tüm spec değerleri kısa tutulur; uzun bileşik string
  (em-dash, iki ayrı birim birleştirme) kesinlikle kullanılmaz → tablo yatay kaymaz.
- Eksik: toplu içe aktarma, görsel optimizasyon pipeline'ı, stok/fiyat yönetimi (yok ve
  gerekmiyor — bu bir vitrin sitesi).

---

## 8. SEO Durumu

### Var olanlar ✅
- Her locale + sayfa için **`generateMetadata`** (title template, description).
- **OpenGraph** (title, description, type, `locale` tr_TR/en_US, siteName).
- **`alternates.languages`** (tr/en) — hreflang temeli.
- `metadataBase` = `https://borsanteknoloji.com`.
- Semantik HTML, `lang` attribute locale'e göre, responsive, hızlı (statik SSG).

### Eksikler ❌ (production öncesi yapılmalı)
- **`sitemap.xml` YOK** (`src/app/sitemap.ts` eklenmeli).
- **`robots.txt` YOK** (`src/app/robots.ts` eklenmeli).
- **JSON-LD structured data YOK** (Organization, Product, BreadcrumbList şeması önerilir).
- **Gerçek favicon YOK** — `src/app/favicon.ico` hâlâ Next.js varsayılanı.
- **OG paylaşım görseli YOK** (sosyal medya önizleme görseli).
- **Twitter Card meta YOK**.
- **`manifest.ts` / PWA YOK**.
- **Canonical URL** sayfa bazında ayarlı değil (yalnız dil alternatifleri var).
- **Analytics YOK** (GA4/Plausible).
- Not: EN sayfaların yol segmentleri Türkçe (`/en/urunler`) — lokalize slug yok (SEO'da
  küçük bir eksi; opsiyonel iyileştirme).

---

## 9. Tamamlanan Özellikler ✅

- **Çok dilli altyapı** (TR/EN) — `[locale]` route + `proxy.ts` yönlendirme + sözlükler.
- **Ana sayfa**: 4 slaytlı **hero carousel** (ok/nokta, otomatik geçiş, fade, her slayt
  kendi kategorisine link), ürün kategorileri, firma avantajları, **sonsuz akan referans
  şeridi** (hover'da yavaşlar), teklif CTA.
- **Sağdan açılan yan panel menü** (tüm ekranlarda; overlay + Esc + scroll kilidi).
- **Ürünler / Kategori / Ürün Detay** sayfaları.
- **Ürün detayında sekmeli yapı**: Teknik Özellikler ↔ Ürün Özellikleri (aktif sekme
  kurumsal mavi).
- **Görsel galerisi** (4 görsel, küçük resimler, beyaz arka plan + object-contain).
- **Öne Çıkanlar** (mühendis odaklı 4 madde) bölümü.
- **Teklif formu** (ürün adı otomatik dolar) + **iletişim formu** — UI tamam.
- **Hakkımızda / Servis / İletişim** sayfaları.
- **4 gerçek ürün** (JIANKE MA25-6S, MA25-5 II, MA12-5 II, MR32-5 II) tam teknik veriyle,
  gerçek fotoğraf galerileri ve `whitespace-nowrap` kaymaz teknik tablolarla.
- **Marka kimliği**: logodan örneklenen mavi (#1F4488) + gri (#606060), endüstriyel tasarım.
- Tipografi: dengeli satır kırma (`text-wrap: balance`), teknik tabloda `whitespace-nowrap`.
- **Sürümleme**: git tag + GitHub Release + CHANGELOG (v1.0.0 → v2.3.0).

---

## 10. Eksik Özellikler ❌

- **Form backend'i** — teklif/iletişim formları HİÇBİR YERE veri göndermez (sadece
  ekranda "teşekkürler" gösterir). Lead/talep kaybı var.
- **Gerçek içerik** — 16 üründen 12'si uydurma placeholder (BT-*); gerçek iletişim
  bilgileri (adres, telefon, e-posta) yok (örnek/dummy).
- **Gerçek görseller** — çoğu ürün ve tüm referans logoları placeholder.
- **Gerçek katalog PDF'leri** — şu an 660 baytlık yer tutucular.
- **Admin panel / CMS** — içerik yönetimi yok.
- **Authentication** — yok.
- **Veritabanı** — yok (mock data).
- **SEO tamamlama** — sitemap, robots, JSON-LD, favicon, OG görseli (bkz. §8).
- **Analytics & KVKK/çerez** — yok.
- **Yasal sayfalar** — KVKK aydınlatma, gizlilik, çerez politikası yok.
- **Harita** — iletişimde gerçek Google Maps embed yok (placeholder).
- **Arama / filtreleme** — ürünlerde yok.
- **Blog / haberler / vaka çalışmaları** — yok.
- **Test / CI-CD** — yok.

---

## 11. Bilinen Buglar / Kırılganlıklar

1. **Tailwind v4 + Turbopack önbellek sorunu** (en önemli geliştirme tuzağı): **ilk kez
   kullanılan** bir utility sınıfı (`fixed`, `text-balance`, `object-contain`, `lg:max-w-3xl`
   vb.) `.next` önbelleği yüzünden CSS'e üretilmeyebiliyor → stil çalışmaz. Çözüm:
   `rm -rf .next` + dev/build yeniden. Yeni sınıf eklerken buna dikkat.
2. **Next/Image önbelleği** — `public/` altındaki bir görseli aynı isimle değiştirince
   tarayıcı/optimizer eski sürümü gösterebilir. Çözüm: `.next` temizle + sert yenileme
   (Ctrl+F5) veya dosya adını versiyonla.
3. **EN yol segmentleri Türkçe** — `/en/urunler/...` (lokalize slug yok). İşlevsel sorun
   değil, SEO/UX'te küçük tutarsızlık.
4. **Form doğrulaması zayıf** — sadece HTML `required`; e-posta format/spam koruması yok
   (zaten backend olmadığı için kritik değil, ama eklenmeli).
5. **Karışık veri** — 4 gerçek JIANKE ürünü (CNC Kayar Otomatlar kategorisinde) ve 12
   uydurma BT-* ürünü aynı sistemde; yayına çıkmadan tüm placeholder'lar temizlenmeli.
6. Not: Geliştirme sırasında "preview" aracının bazı ekran görüntüleri/scroll'ları
   tutarsızdı — bu bir **kod hatası değil**, araç kaynaklı; site tarayıcıda düzgün çalışır.

---

## 12. Teknik Borçlar

- **İçerik kodda gömülü** (`products.ts`, sözlükler) — geliştirici olmayan biri içerik
  değiştiremez. DB + admin gerekiyor.
- **Formlar backend'siz** — mimari "Supabase'e uygun" ama bağlantı yok.
- **`dangerouslyAllowSVG: true`** (`next.config.ts`) — placeholder SVG'ler için açıldı.
  Gerçek fotoğraflara geçilince kaldırılması/gözden geçirilmesi gerekir (güvenlik notu;
  şu an yalnızca kendi SVG'lerimiz servis edildiği için düşük risk).
- **Placeholder varlıklar** — SVG blueprint görseller, 660 baytlık PDF'ler, sabit
  kodlanmış referans firma isimleri (`REFERENCE_NAMES` dizisi).
- **Test yok, CI/CD yok, hata izleme (Sentry vb.) yok.**
- **i18n slug lokalize değil.**
- **Tek dosyada büyüyen `products.ts`** — ürün sayısı arttıkça DB'ye taşınmalı.

---

## 13. Production'a Çıkmadan Önce Yapılması Gerekenler (Checklist)

**İçerik & Veri**
- [ ] Uydurma BT-* ürünlerini kaldır / gerçek ürünlerle değiştir.
- [ ] Gerçek iletişim bilgileri (adres, telefon, e-posta, çalışma saatleri).
- [ ] Gerçek referans firma logoları.
- [ ] Gerçek katalog PDF'leri.

**Fonksiyonel**
- [ ] Teklif/iletişim formlarını bir backend'e bağla (Supabase tablo + e-posta:
      Resend/SMTP) + **KVKK açık rıza metni** + spam koruması (honeypot/Turnstile).
- [ ] İletişimde gerçek **Google Maps** embed.

**SEO & Meta**
- [ ] `src/app/sitemap.ts` ve `src/app/robots.ts` ekle.
- [ ] **Gerçek favicon** + `manifest.ts` + **OG paylaşım görseli** + Twitter Card.
- [ ] **JSON-LD** (Organization, Product, BreadcrumbList).

**Yasal & Analitik**
- [ ] KVKK aydınlatma, gizlilik, çerez politikası sayfaları.
- [ ] **Çerez/KVKK banner'ı** + **Analytics** (GA4 veya Plausible).

**Altyapı**
- [ ] **Domain** (`borsanteknoloji.com`) + **Vercel** deploy + ortam değişkenleri.
- [ ] Üretim derlemesini **temiz** al (`rm -rf .next && npm run build`) ve doğrula.
- [ ] **Lighthouse** (performans/erişilebilirlik/SEO) ve temel a11y denetimi.
- [ ] Hata izleme (Sentry) — opsiyonel ama önerilir.

---

## 14. Roadmap (Öncelik Sırasına Göre)

**Faz 1 — Yayına Hazırlık (Yüksek öncelik, "ilk canlı sürüm")**
1. **Formları backend'e bağla** + KVKK rızası (Supabase/Resend). *Lead toplamadan
   yayına çıkmak en büyük kayıp.*
2. **Gerçek içerik**: gerçek ürünler/görseller, iletişim bilgileri, placeholder temizliği.
3. **SEO paketi**: sitemap + robots + favicon + OG görseli + JSON-LD.
4. **Yasal & analitik**: KVKK/gizlilik/çerez sayfaları + çerez banner + Analytics.
5. **Vercel'e deploy** + domain bağlama. → **v3.0.0 (canlı)**

**Faz 2 — İçerik Yönetimi (Orta öncelik)**
6. Ürün verisini **Supabase**'e taşı (tablolar + Storage + RLS).
7. **Authentication** (Supabase Auth) + basit **admin panel** (ürün/kategori/teklif
   yönetimi) → firma kendi içeriğini düzenleyebilsin.
8. Teklif taleplerini admin panelde listele/yönet.

**Faz 3 — Büyüme & Cila (Düşük öncelik)**
9. Ürünlerde **arama & filtreleme** (devir, çap, kontrol ünitesi vb.).
10. **Blog / haberler / vaka çalışmaları** modülü (SEO + güven).
11. EN için **lokalize slug** (`/en/products/...`).
12. Gerçek **katalog yönetimi** (PDF yükleme).
13. **Test + CI/CD** (GitHub Actions), hata izleme.
14. Performans/a11y ince ayar, dark mode (opsiyonel).

---

## Ek: Geliştirici Notları

- **Çalıştırma**: `npm install` → `npm run dev` (http://localhost:3000 → `/tr`).
- **Derleme**: `npm run build` (yeni Tailwind sınıfı eklediysen önce `rm -rf .next`).
- **Görsel üretimi**: `scripts/generate_svgs.py` (placeholder), `make_placeholder_pdf.py`.
- **Marka renkleri**: mavi `#1F4488`, gri `#606060` — `globals.css` `@theme` token'larında.
- **GitHub**: `github.com/yusuf-borsan/borsan-web` (private). Sürümler git tag + Release.
- **Detaylı sürüm geçmişi**: `CHANGELOG.md`. Genel bakış: `README.md`.
