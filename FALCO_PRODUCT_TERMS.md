# FALCO Ürün Teknik Terim Standardı

Bu dosya, `src/lib/products.ts` içindeki tüm FALCO torna ürünlerinde kullanılacak
teknik terim standardını tanımlar. Yeni FALCO ürünü eklerken bu dosyayı referans al.

---

## Spec Label'ları — Türkçe / İngilizce

| Eski (kullanma) | Doğru TR | Doğru EN |
|---|---|---|
| Yatak Çapı (maks.) | **Maks. Yatak Üzeri Çevirme Çapı** | **Max. Swing Over Bed** |
| Kalemlik Üzeri Çevir Çapı | **Kalemlik Üzeri Çevirme Çapı** | **Swing Over Carriage** |
| Ray Genişliği | **Kızak Genişliği** | **Bed Guideway Width** |
| İş Mili Deliği | **İş Mili Delik Çapı** | **Spindle Bore** |
| İş Mili Konik | **İş Mili Koniği** | **Spindle Taper** |
| İş Mili Devri | **İş Mili Devir Aralığı** | **Spindle Speed Range** |
| İş Mili Gücü | **İş Mili Motor Gücü** | **Spindle Motor Power** |
| Z Ekseni Strok | **Z Ekseni Hareket Mesafesi** | **Z-Axis Travel** |
| X Hızlı Hareket | **X Ekseni Hızlı Hareket** | **X-Axis Rapid Traverse** |
| Z Hızlı Hareket | **Z Ekseni Hızlı Hareket** | **Z-Axis Rapid Traverse** |
| Kart Çapı | **Ayna Çapı** | **Chuck Diameter** |
| Kontrol Ünitesi | **CNC Kontrol Ünitesi** | **CNC Controller** |
| Makine Ağırlığı | **Yaklaşık Makine Ağırlığı** | **Approx. Machine Weight** |
| Makine Ölçüsü | **Makine Ölçüleri** | **Machine Dimensions** |

### Dik Torna (VTL) — Ek Kurallar

| Kullanma | Kullan |
|---|---|
| İş Mili Çalışma Çapı | **Döner Tabla Çapı** / **Rotary Table Diameter** |
| Standart Plaka Çapı | **Standart Ayna Çapı** / **Standard Chuck Diameter** |

---

## Metin İçi Terim Değiştirmeleri (summary / highlights)

| Eski ifade | Doğru ifade |
|---|---|
| "yatak çapı" | "yatak üzeri çevirme çapı" |
| "ray genişliği" / "ray genişlikli" | "kızak genişliği" / "kızak genişlikli" |
| "iş mili deliği" | "iş mili delik çapı" |
| "3 çeneli kart" / "kart" | "3 çeneli ayna" / "ayna" |
| "3 çeneli plaka" | "3 çeneli ayna" |
| "ISO A2-x konik" | "ISO A2-x iş mili koniği" |
| "iş mili motoru" | "iş mili motor gücü" |
| "değişken hız" | "değişken iş mili devir aralığı" |
| "guide width" (EN) | "guideway width" |
| "swing capacity" (EN) | "max. swing over bed" |

---

## L Nesnesi Notu

`products.ts` içindeki paylaşılan `L` nesnesi JIANKE ürünleriyle ortaktır —
**FALCO ürünleri için `L.spindleSpeed`, `L.spindlePower`, `L.spindleBore`,
`L.taper`, `L.zTravel`, `L.control`, `L.weight` kullanma.**
Bunların hepsini yukarıdaki tabloya göre inline `{ tr: "...", en: "..." }` olarak yaz.

---

## Doğru Kullanım Örnekleri

```
"Φ600mm maks. yatak üzeri çevirme çapı"
"Φ315mm 3 çeneli ayna"
"440mm kızak genişliği"
"Φ82mm iş mili delik çapı"
"65–1600 dev/dak iş mili devir aralığı"
"Z ekseni hareket mesafesi: 890 / 1390 / 1850 / 2850 mm"
"ISO A2-8 iş mili koniği"
"CNC kontrol ünitesi: Guangzhou GSK980TB3i"
```

---

## Uygulandığı Ürünler (Tamamlanan)

- FALCO CK518 CNC Dik Torna (`dik-tornalar`)
- FALCO CK6152 CNC Yatay Torna (`cnc-tornalar`)
- FALCO CK6160 CNC Yatay Torna (`cnc-tornalar`)
- FALCO CAK63 CNC Yatay Torna (`cnc-tornalar`)
- FALCO CAK80 CNC Yatay Torna 550mm Kızak (`cnc-tornalar`)
- FALCO CAK86 CNC Yatay Torna (`cnc-tornalar`)
