# Sürüm Geçmişi (Changelog)

Borsan Teknoloji web platformunun sürümleri. Her sürüme GitHub üzerinden kolayca
ulaşabilirsin:

- **Etiketler (Tags):** https://github.com/yusuf-borsan/borsan-web/tags
- **Sürümler (Releases):** https://github.com/yusuf-borsan/borsan-web/releases

Belirli bir sürümün koduna bakmak/indirmek için Releases sayfasından ilgili sürümü
seç; "Source code (zip)" ile o anki halini indirebilirsin.

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
