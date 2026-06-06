# Sürüm Geçmişi (Changelog)

Borsan Teknoloji web platformunun sürümleri. Her sürüme GitHub üzerinden kolayca
ulaşabilirsin:

- **Etiketler (Tags):** https://github.com/yusuf-borsan/borsan-web/tags
- **Sürümler (Releases):** https://github.com/yusuf-borsan/borsan-web/releases

Belirli bir sürümün koduna bakmak/indirmek için Releases sayfasından ilgili sürümü
seç; "Source code (zip)" ile o anki halini indirebilirsin.

---

## v2.3.0 — CNC Kayar Otomatlar kategorisi + ilk gerçek ürünler (2026-06-07)

### Eklenenler
- **7. kategori: CNC Kayar Otomatlar** (CNC Swiss Type Lathes) — kendi ikonu,
  kategori sayfası ve ürünler listesi.
- **Hero slider'a 4. slayt** (CNC Kayar Otomatlar) — gerçek showroom fotoğrafı,
  doğrudan kategori sayfasına bağlantı.
- **Ürün detayında sekmeli yapı**: "Teknik Özellikler" ve "Ürün Özellikleri"
  sekmeleri (aktif sekme kurumsal mavi). Veri modeline `features` (string[]) alanı.
- **İlk gerçek ürünler:** `JIANKE MA25-6S` ve `JIANKE MA25-5 II` — teknik veriler
  ve özellikler resmi JIANKE kataloğundan (docx) çekildi; her biri 4 görselli galeri,
  öne çıkanlar (mühendis odaklı 4 madde), teknik tablo ve teklif formu entegrasyonu.
- Gelecek için altyapı: `public/machines/swiss-type/`, `public/catalogs/swiss-type/`
  (yer tutucu PDF'ler).

### İyileştirmeler / Düzeltmeler
- Ürün galerisi ve kartlarında görseller **beyaz arka plan + object-contain** ile
  kırpılmadan, kusursuz beyaz zeminde gösteriliyor (PNG/şeffaf/siyah-bg sorunları giderildi).
- Teknik özellikler tablosunda **satır kırılması engellendi** (`whitespace-nowrap`),
  sütun genişletilerek taşma giderildi — tablo tek satır, jilet gibi hizalı.
- Marka adı tüm sayfa ve formlarda **JIANKE** (büyük harf) olarak standartlaştırıldı.
- Hero 4. slayt görseli ölçeklendirme ve yerleşim ince ayarları.

---

## v2.2.0 — Başlık yerleşimi iyileştirmeleri (2026-06-03)

### Değişiklikler
- Başlıklarda **dengeli satır kırma** (`text-wrap: balance`) ve paragraflarda
  `text-wrap: pretty` uygulandı; tek kelimenin alt satıra düşmesi gibi biçimsiz
  görünümler giderildi. (Yazı tipi, renk ve boyut değişmedi — sadece yerleşim.)
- **"Her Uygulama İçin Doğru Tezgah"** başlığı masaüstünde **tek satır** olacak
  şekilde genişletildi; diğer başlıklar dengeli iki satır olarak korundu.

### Teknik
- `text-balance` / `text-pretty`: HeroCarousel, SectionHeading, PageHero,
  CtaSection, ReferencesSection ve ürün detay başlığı.
- Hero başlık sütunu genişletildi (uzun ikinci satırların tek satıra sığması için).
- Kategoriler bölüm başlığına yalnızca o örnek için `lg:max-w-3xl`.

---

## v2.1.0 — Menü her ekranda 3 çizgi (2026-06-03)

### Değişiklikler
- Üçlü çizgi (hamburger) menü butonu artık **masaüstü dahil tüm ekran
  boyutlarında** görünüyor. Geniş ekranda üstteki yatay menü (Ürünler,
  Hakkımızda, Servis, İletişim) ile birlikte yer alıyor; tıklanınca sağdan
  açılan panel her boyutta çalışıyor.

### Teknik
- `Header.tsx`'te hamburger butonu, karartma katmanı (overlay) ve yan panelden
  `lg:hidden` (geniş ekranda gizle) kuralı kaldırıldı.

---

## v2.0.0 — Dinamik arayüz modülleri (2026-06-03)

İlk kurumsal sürümün üzerine üç dinamik/etkileşimli modül eklendi. Renk paleti ve
tasarım tonları korundu.

### Eklenenler
- **Sağdan açılan yan panel menü (mobil):** Üçlü çizgi ikonuna basınca üst bar
  kaymak yerine ekranın sağından akıcı bir yan panel açılıyor; dışarı tıklama, X
  butonu veya Esc ile kapanıyor. Menü seçenekleri büyük tipografiyle listeleniyor.
- **Hero slider / carousel:** Ana sayfadaki sabit alan; sağ/sol oklu, otomatik
  geçişli (fare üstündeyken duraklayan), her slaytta arka plan + başlık/alt metni
  fade efektiyle değişen 3 slaytlı bir slider'a dönüştürüldü.
- **Sonsuz akan referans şeridi:** Kutulu durağan referans logoları kaldırıldı;
  yerine soldan sağa kesintisiz akan, fare üstüne gelince bulunduğu yerden
  yumuşakça yavaşlayan (JavaScript ile sürülen) bir şerit eklendi.

### Düzeltmeler
- Üçlü çizgi menüsü, sayfanın başında değilken (aşağı kaydırılmışken) hatalı
  konumlanıp takılıyordu. Yan panel `<header>` dışına taşınarak her durumda tam
  ekran ve düzgün açılır hale getirildi.

### Teknik
- Yeni: `src/components/HeroCarousel.tsx`, `src/components/ReferenceMarquee.tsx`
- Animasyonlar Safari/Chrome uyumlu; `prefers-reduced-motion` desteklenir.
- TypeScript tipleri ve mevcut renk token'ları korundu.

---

## v1.0.0 — İlk kurumsal sürüm (2026-06-03)

CNC takım tezgahları satışı için çok dilli (TR/EN) kurumsal web platformunun ilk
çalışan sürümü.

### Kapsam
- Next.js App Router + TypeScript + Tailwind CSS v4
- Türkçe/İngilizce çoklu dil, SEO uyumlu yapı, responsive tasarım
- Sayfalar: Ana Sayfa, Ürünler, Kategori, Ürün Detay, Hakkımızda, Servis, İletişim
- Logodan örneklenen marka kimliği (mavi #1F4488 + gri #606060), endüstriyel/premium
  tasarım dili
- 6 tezgah kategorisi ve örnek ürün/teknik özellik verisi
