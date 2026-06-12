# Sürüm Geçmişi (Changelog)

Borsan Teknoloji web platformunun sürümleri. Her sürüme GitHub üzerinden kolayca
ulaşabilirsin:

- **Etiketler (Tags):** https://github.com/yusuf-borsan/borsan-web/tags
- **Sürümler (Releases):** https://github.com/yusuf-borsan/borsan-web/releases

Belirli bir sürümün koduna bakmak/indirmek için Releases sayfasından ilgili sürümü
seç; "Source code (zip)" ile o anki halini indirebilirsin.

---

## v3.0.0 — FALCO CNC + Universal Tornalar: Ağır Tip Serileri Tamamlandı (2026-06-12)

### Yeni Kategori: Universal Tornalar

Siteye yeni bir ürün kategorisi eklendi: **Universal Tornalar** (konvansiyonel/manuel yatay torna).
Kategori, 8 FALCO CW61xx modeliyle başlıyor; mega menü ve ürünler listesine otomatik eklendi.

### FALCO CNC Tornalar — Ağır Tip + Süper Ağır Tip (5 yeni ürün)

| Ürün | Kızak | Maks. Çap | Tip |
|------|-------|-----------|-----|
| FALCO CK61125B | 755mm | Φ1250mm | Ağır Tip CNC |
| FALCO CK61160B | 755mm | Φ1600mm | Ağır Tip CNC |
| FALCO CK61160 | 1100mm | Φ1600mm | Süper Ağır Tip CNC |
| FALCO CK61180 | 1100mm | Φ1800mm | Süper Ağır Tip CNC |
| FALCO CK61200 | 1100mm | Φ2000mm | Süper Ağır Tip CNC |

### FALCO Universal Tornalar — 3 Seri, 8 Ürün

| Ürün | Kızak | Maks. Çap | Tip |
|------|-------|-----------|-----|
| FALCO CW6180B | 600mm | Φ800mm | Standart Universal |
| FALCO CW61110Q | 600mm | Φ1100mm | Standart Universal |
| FALCO CW61125Q | 600mm | Φ1250mm | Standart Universal |
| FALCO CW61125B | 755mm | Φ1250mm | Ağır Tip Universal |
| FALCO CW61160B | 755mm | Φ1600mm | Ağır Tip Universal |
| FALCO CW61160 | 1100mm | Φ1600mm | Süper Ağır Tip Universal |
| FALCO CW61180 | 1100mm | Φ1800mm | Süper Ağır Tip Universal |
| FALCO CW61200 | 1100mm | Φ2000mm | Süper Ağır Tip Universal |

Her ürün: eksiksiz teknik tablo (vida açma seçenekleri metrik/inç/modül/DP, ilerleme
kademeleri, ileri/geri devir, kuyrukluk tipi dahil), 8 özellik maddesi, gerçek galeri.

### Özet

- Toplam kategori: 7 → **8** (+Universal Tornalar)
- Toplam gerçek ürün: 19 → **32** (+13 FALCO)
- Prerender edilen sayfa: ~61 → **~89** (+28 sayfa)

---

## v2.9.0 — FALCO CNC Tornalar: Tam Veri + SpecNavigator + BT Temizliği (2026-06-11)

### FALCO CNC Tornalar — 10 Ürün Tamamlandı

Tüm FALCO CNC Yatay Torna ürünlerine resmi teknik veriler, gerçek fotoğraf galerileri ve 8 mühendis odaklı özellik maddesi eklendi.

| Ürün | Kızak | Maks. Çap | Güncelleme |
|------|-------|-----------|------------|
| FALCO CK6152 | 440mm | Φ520mm | ✅ Tamamlandı |
| FALCO CK6160 | 440mm | Φ600mm | ✅ Tamamlandı |
| FALCO CAK63 | 550mm | Φ630mm | ✅ Tamamlandı |
| FALCO CAK80 (550mm Kızak) | 550mm | Φ800mm | ✅ Tamamlandı |
| FALCO CAK86 | 600mm | Φ860mm | ✅ Tamamlandı |
| FALCO CAK110 (600mm Kızak) | 600mm | Φ1100mm | ✅ Tamamlandı |
| FALCO CAK125 (600mm Kızak) | 600mm | Φ1250mm | ✅ Tamamlandı |
| FALCO CAK80 (700mm Kızak) | 700mm | Φ800mm | ✅ Tamamlandı |
| FALCO CAK110 (700mm Kızak) | 700mm | Φ1100mm | ✅ Tamamlandı |
| FALCO CAK125 (700mm Kızak) | 700mm | Φ1250mm | ✅ Tamamlandı |

Her üründe:
- 20–23 satırlık eksiksiz teknik tablo (Gövde, İki Punta Arası Mesafe, X/Z hareket, Taret, Konumlama Hassasiyeti, Ağırlık, Ölçüler dahil)
- 8 mühendis odaklı özellik maddesi (Ürün Özellikleri sekmesi)
- Gerçek ürün fotoğrafı galerisi (1–2 fotoğraf)

### SpecNavigator Bileşeni (`ProductTabs.tsx`)

Birden fazla varyant barındıran spec değerleri için prev/next buton navigasyonu eklendi.

- **Eşik**: 4+ değer (`" / "` ile ayrılmış) → `SpecNavigator`; 1–3 değer → düz metin
- **Birim kuralı**: Her değer kendi birimini taşır (`890mm / 1390mm` ✅; `890 / 1390 mm` ❌)
- **Tablo düzeni**: `table-fixed` + `colgroup` (48% / 52%) — navigatör diğer satırları kaydırmaz
- **Truncate**: değer span'ı `truncate` — hiçbir zaman iki satıra bölünmez

### BT Ürünleri Kaldırıldı

`cnc-tornalar` kategorisinden gerçek teknik verisi ve fotoğrafı olmayan iki placeholder ürün tamamen silindi:
- `bt-l250` (BT-L250 CNC Torna)
- `bt-l400m` (BT-L400M Tahrikli Takımlı Torna)

### Görsel Eklemeler (`public/machines/cnc-tornalar/`)

| Dosya | Kullanılan Ürünler |
|-------|-------------------|
| `falco-cak550-series-1.png` | CAK63, CAK80 (550mm) |
| `falco-cak600-series-1.png` | CAK86, CAK110 (600mm), CAK125 (600mm) |
| `falco-cak600-series-2.png` | CAK86, CAK110 (600mm), CAK125 (600mm) |
| `falco-cak700-series-1.png` | CAK80 (700mm), CAK110 (700mm), CAK125 (700mm) |
| `falco-ck6152-ck6160-1.png` | CK6152, CK6160 |
| `falco-ck6152-ck6160-2.png` | CK6152, CK6160 |

### FALCO_PRODUCT_TERMS.md

FALCO ürünleri için kalıcı terminoloji standardı oluşturuldu. Doğru/yanlış spec etiket ve değer örnekleri, `L` nesnesi kullanım notu (`L.xxx` FALCO ürünlerinde kullanılmaz — inline `{ tr, en }` zorunludur).

### Teknik
- Statik derleme: **65 → 61 sayfa** (2 BT ürünü kaldırıldı, TR+EN = −4 sayfa)
- `npx tsc --noEmit` temiz
- `package.json` version: `2.8.0` → `2.9.0`

---

## v2.8.0 — Hero Carousel: 4 Gerçek CNC Fotoğrafı (2026-06-10)

### Hero Carousel — Tüm Slaytlar Gerçek Fotoğrafla

Tüm 4 hero slaytına profesyonel CNC makinesi fotoğrafları eklendi; SVG/placeholder
görseller tamamen kaldırıldı.

| Slayt | Fotoğraf | Kaynak / Özellik |
|-------|----------|-----------------|
| 1 | `hero-main.png` — CNC delme/frezeleme | `ana ekran 1..png` → `scaleX(-1)` mirror (odak sağa) |
| 2 | `hero-main2.png` — CNC torna + kıvılcımlar | `ana ekran 2..png` → doğal yerleşim |
| 3 | `hero-main3.png` — Dişli + mil stüdyo çekimi | `ana ekran resim 3..png` → doğal yerleşim |
| 4 | `hero-main4.png` — JIANKE MA25-6S atölyesi | `ana ekran 4..png` → sağa kaydırma + sol kenar fade |

### Yerleştirme Tekniği (Height-fit + Right-align)
- **`<img className="h-full w-auto absolute top-0">`** + CSS `right` ile sağa yaslanmış.
  `next/image fill` kullanılmaz (konteyner genişliğini zorlar, yatay kaydırma imkânsız).
- 1456px masaüstünde ~977–1066px görüntü genişliği → sol ~390–480px doğal koyu boşluk (yazı alanı).
- **`scaleX(-1)` mirror**: odak noktası sol yarıda olan fotoğraflar çevrilir (Slayt 1).
- **`rightOffset`**: zoom olmadan CSS `right: -Npx` ile fotoğraf daha sağa itilir (Slayt 4: 180px).
- **`leftFade`**: `mask-image: linear-gradient(to right, transparent 0%, black 28%)`
  ile fotoğrafın sol kenarı arka planla geçişli birleşir, keskin kenar yok (Slayt 4).
- **Gradyan overlay** (tüm slaytlar):
  `linear-gradient(90deg, #0c0e13 0%, rgba(12,14,19,0.88) 42%, rgba(12,14,19,0.25) 100%)`
- `heightFitConfig` lookup tablosu (`HeroCarousel.tsx`) her fotoğraf için `mirror`,
  `rightOffset`, `leftFade` ayarlarını tutar.

### Teknik
- `@next/next/no-img-element` ESLint kuralı height-fit `<img>` için `eslint-disable-next-line` ile bastırıldı.
- `npx tsc --noEmit` her adımda temiz.
- `package.json` version: `0.1.0` → `2.8.0`.

---

## v2.7.0 — Navbar yeniden tasarımı + MA25-5B + UI yenilemeleri (2026-06-10)

### Navbar (Header.tsx + LocaleSwitcher.tsx) — Tam Yeniden Tasarım
- **Yükseklik** 80px → **70px** (`h-[70px]`); daha kompakt, modern oran.
- **Frosted-glass arka plan**: her zaman `bg-white/90 backdrop-blur-md`; scroll'da ince
  alt border + hafif gölge eklenir.
- **Hover alt çizgi animasyonu**: `after:` pseudo-element ile `w-0 → w-full` (200ms).
- **Link hiyerarşisi**: Ürünler & Servis → `font-semibold text-ink-800` (birincil);
  Hakkımızda & İletişim → `font-medium text-ink-500` (ikincil); aralarında ince divider.
- **LocaleSwitcher yenilendi**: "TR / EN" toggle yerine **"TR ▼" dropdown** (animasyonlu
  chevron, dışarı tıklamayla kapanır).
- **"Teklif Al" butonu**: daha geniş padding + `shadow-md` + `hover:-translate-y-0.5` kaldırma efekti.
- **Hamburger**: `h-px` ince çizgiler, 300ms smooth ↔ X animasyonu, desktop'ta `lg:hidden`.
- **Ürünler Mega Menüsü**: hover ile açılan, tüm 7 kategoriyi 4 sütunlu grid'de gösteren
  dropdown (CategoryIcon + kategori adı + tagline; `Tüm Ürünleri Gör →` linki).
- **Mobil drawer**: yükseklik 70px'e senkronize, "TR ▼" + "Teklif Al" footer bölümünde.

### Yeni Ürün
- **JIANKE MA25-5B** (8. ürün, `cnc-kayar-otomatlar`) — 5+B eksen (X1,Y1,Z1,X2,Z2+B1),
  SYNTEC 210TB-A kontrol, Ø25 bar, 4 gerçek fotoğraf galerisi, tam teknik tablo TR/EN.

### Ürün Detayı — Teklif Bölümü Yenilendi
- **2 sütunlu layout**: sol = Opsiyonel Donanımlar kartları (Bar Sürücü, Soğutma, Yağ
  Buharı Ayırıcı, Parça Yakalama — beyaz kart + brand-600 ikon); sağ = dark form.
- **QuoteForm dark varyantı** (`dark` prop): `bg-brand-600` arka plan, beyaz inputlar,
  beyaz submit butonu.
- 4 yeni SVG ikon eklendi: `BarFeederIcon`, `CoolantIcon`, `OilMistIcon`, `PartsIcon`.

### İletişim Sayfası Yenilendi
- Sol sütun: 2×2 **beyaz kart** grid (bg-white + brand-600/10 ikon, hover'da solid
  brand-600 ikon + border/shadow değişimi).
- Sağ sütun: `QuoteForm dark` — dark blue `bg-brand-600` form.

### Düzeltmeler / İyileştirmeler
- Teknik özellikler tablosu yatay kaydırma tamamen kaldırıldı (`ProductTabs.tsx`).
- Marka rengi tutarlılığı: `#005088` → `bg-brand-600` (#1F4488) tüm bileşenlerde.
- MA25-5B birinci fotoğraf güncellendi (`.jpg` → `.png`).
- ProductCard ve kategori sayfası görsel modernizasyonu.

### Teknik
- Statik derleme: **57 → 65 sayfa** (yeni ürün TR+EN, opsiyonel donanım dictionary girişleri).
- Yeni `Dictionary` alanları: `productPage.optionalEquipmentTitle`, `productPage.optionalEquipment[]`.

---

## v2.5.0 — DT38-5 II, DT38-6S, ZR20-5 II + doğruluk düzeltmeleri (2026-06-09)

### Eklenenler
- **JIANKE DT38-5 II**, **DT38-6S**, **ZR20-5 II** — 3 yeni CNC Kayar Otomat ürünü
  (teknik veriler ve özellikler resmi kataloglardan; her biri TR/EN).

### Düzeltmeler
- Spec değerlerinde doğruluk düzeltmeleri.

---

## v2.4.0 — 4 gerçek JIANKE ürünü + görsel ve tablo standartları (2026-06-09)

### Eklenenler
- **JIANKE MA12-5 II** — CNC Kayar Otomat (Mitsubishi M80 çift kanal, Ø12 mm, 5 eksen,
  12.000/10.000 dev/dak, 4 gerçek fotoğraf galerisi, tam teknik tablo).
- **JIANKE MR32-5 II** — CNC Kayar Otomat (SYNTEC 210TB-A çift kanal, Ø32 mm, 5 eksen,
  8.000/8.000 dev/dak, 3 gerçek fotoğraf galerisi, tam teknik tablo).

### İyileştirmeler / Düzeltmeler
- **Görsel kaynak kuralı**: bundan itibaren ürün fotoğrafları yalnızca kullanıcının
  sohbete yüklediği görüntülerden alınır; PDF/docx içinden çekilmez.
- **Teknik tablo taşma düzeltmesi (MR32-5 II)**: iki uzun bileşik spec değeri kısaltıldı
  (`"3,5 / 6,0 kW"`, `"Ø 13 / M12 (ER20, eksenel)"`) — tablo artık kaydırmasız.
- **Dokümanlar güncellendi**: `PROJECT_HANDOFF.md` (4 gerçek ürün, 57 sayfa, yeni kurallar)
  ve `DEVELOPMENT_RULES.md` (JIANKE büyük harf, kısa spec standardı, görsel kaynak kuralı).

### Teknik
- Statik derleme: **53 → 57 sayfa** (her yeni ürün TR+EN = +2 sayfa).
- Gerçek ürün sayısı: 2 → 4 (tümü `cnc-kayar-otomatlar` kategorisinde).

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
