import type { Locale, Localized } from "@/i18n/config";

export type Spec = {
  label: Localized;
  value: Localized;
};

export type Product = {
  slug: string;
  model: string;
  categorySlug: string;
  name: Localized;
  summary: Localized;
  /** Short marketing highlights shown as bullet points. */
  highlights: Localized[];
  /**
   * General product features / advantages, shown under the "Product Features"
   * tab on the detail page. Optional: falls back to `highlights` when absent.
   * Maps to a text[] column in the future Supabase `products` table.
   */
  features?: Localized[];
  specs: Spec[];
  /** Primary image (placeholder SVG for the prototype). */
  image: string;
  /** Gallery images. */
  gallery: string[];
  /** Optional catalog PDF path placed under /public/catalogs. */
  catalog?: string;
};

export type Category = {
  slug: string;
  /** Icon key used by the CategoryIcon component. */
  icon: string;
  name: Localized;
  tagline: Localized;
  description: Localized;
  image: string;
  products: Product[];
};

/* Reusable spec labels */
const L = {
  control: { tr: "Kontrol Ünitesi", en: "CNC Control" },
  swing: { tr: "Ayna Üstü Çap", en: "Swing Over Bed" },
  maxTurnDia: { tr: "Maks. Tornalama Çapı", en: "Max. Turning Diameter" },
  maxTurnLen: { tr: "Maks. Tornalama Boyu", en: "Max. Turning Length" },
  spindleBore: { tr: "İş Mili Deliği", en: "Spindle Bore" },
  spindleSpeed: { tr: "İş Mili Devri", en: "Spindle Speed" },
  spindlePower: { tr: "İş Mili Gücü", en: "Spindle Power" },
  turret: { tr: "Takım Taretı", en: "Tool Turret" },
  xTravel: { tr: "X Ekseni Strok", en: "X-Axis Travel" },
  yTravel: { tr: "Y Ekseni Strok", en: "Y-Axis Travel" },
  zTravel: { tr: "Z Ekseni Strok", en: "Z-Axis Travel" },
  table: { tr: "Tabla Ölçüsü", en: "Table Size" },
  taper: { tr: "İş Mili Konik", en: "Spindle Taper" },
  toolMag: { tr: "Takım Magazini", en: "Tool Magazine" },
  rapid: { tr: "Hızlı İlerleme", en: "Rapid Traverse" },
  accuracy: { tr: "Konumlama Hassasiyeti", en: "Positioning Accuracy" },
  maxLoad: { tr: "Maks. Tabla Yükü", en: "Max. Table Load" },
  wheelDia: { tr: "Taşlama Taşı Çapı", en: "Grinding Wheel Dia." },
  grindLen: { tr: "Taşlama Boyu", en: "Grinding Length" },
  module: { tr: "İşlenebilir Modül", en: "Workable Module" },
  weight: { tr: "Makine Ağırlığı", en: "Machine Weight" },
  barCapacity: { tr: "Maks. Bar Kapasitesi", en: "Max. Bar Capacity" },
  guideBushing: { tr: "Kılavuz Burç", en: "Guide Bushing" },
  backSpindleSpeed: { tr: "Arka İş Mili Devri", en: "Back Spindle Speed" },
  toolStations: { tr: "Takım İstasyonu", en: "Tool Stations" },
  axes: { tr: "Eksen Sayısı", en: "Number of Axes" },
  liveTools: { tr: "Tahrikli Takım", en: "Live Tools" },
  maxPartLen: { tr: "Maks. Parça Boyu", en: "Max. Part Length" },
} satisfies Record<string, Localized>;

export const categories: Category[] = [
  {
    slug: "cnc-tornalar",
    icon: "lathe",
    name: { tr: "CNC Tornalar", en: "CNC Lathes" },
    tagline: {
      tr: "Yüksek hassasiyetli yatay tornalama merkezleri",
      en: "High-precision horizontal turning centers",
    },
    description: {
      tr: "Seri üretimden tekil parça imalatına kadar geniş bir yelpazede çalışan, yüksek tork ve rijit gövde yapısına sahip CNC torna tezgahları. Otomotiv, savunma ve genel imalat sektörleri için optimize edilmiştir.",
      en: "Rigid, high-torque CNC turning centers covering everything from high-volume production to single-part manufacturing. Optimized for automotive, defense and general manufacturing.",
    },
    image: "/categories/cnc-tornalar.svg",
    products: [
      {
        slug: "bt-l250",
        model: "BT-L250",
        categorySlug: "cnc-tornalar",
        name: { tr: "BT-L250 CNC Torna", en: "BT-L250 CNC Lathe" },
        summary: {
          tr: "Kompakt gövdede yüksek devirli iş mili. Yoğun seri üretim için ideal.",
          en: "High-speed spindle in a compact frame. Ideal for intensive serial production.",
        },
        highlights: [
          { tr: "Eğimli döküm gövde, üstün talaş tahliyesi", en: "Slant cast bed, superior chip evacuation" },
          { tr: "Servo taretle hızlı takım değişimi", en: "Fast tool change with servo turret" },
          { tr: "Fanuc / Siemens kontrol seçenekleri", en: "Fanuc / Siemens control options" },
        ],
        image: "/machines/cnc-torna.svg",
        gallery: ["/machines/cnc-torna.svg", "/machines/cnc-torna-2.svg", "/machines/cnc-torna-3.svg"],
        catalog: "/catalogs/bt-l250.pdf",
        specs: [
          { label: L.control, value: { tr: "Fanuc 0i-TF Plus", en: "Fanuc 0i-TF Plus" } },
          { label: L.swing, value: { tr: "Ø 540 mm", en: "Ø 540 mm" } },
          { label: L.maxTurnDia, value: { tr: "Ø 250 mm", en: "Ø 250 mm" } },
          { label: L.maxTurnLen, value: { tr: "500 mm", en: "500 mm" } },
          { label: L.spindleBore, value: { tr: "Ø 62 mm", en: "Ø 62 mm" } },
          { label: L.spindleSpeed, value: { tr: "4.500 dev/dak", en: "4,500 rpm" } },
          { label: L.spindlePower, value: { tr: "15 / 11 kW", en: "15 / 11 kW" } },
          { label: L.turret, value: { tr: "12 istasyon", en: "12 stations" } },
          { label: L.accuracy, value: { tr: "± 0,005 mm", en: "± 0.005 mm" } },
          { label: L.weight, value: { tr: "3.800 kg", en: "3,800 kg" } },
        ],
      },
      {
        slug: "bt-l400m",
        model: "BT-L400M",
        categorySlug: "cnc-tornalar",
        name: { tr: "BT-L400M Tahrikli Takımlı Torna", en: "BT-L400M Live-Tooling Lathe" },
        summary: {
          tr: "Y ekseni ve tahrikli takımlarla tek bağlamada komple işleme.",
          en: "Complete machining in a single setup with Y-axis and live tooling.",
        },
        highlights: [
          { tr: "Tahrikli takımlar + C ekseni", en: "Live tooling + C-axis" },
          { tr: "Y ekseni ile yandan delme/frezeleme", en: "Off-center drilling/milling with Y-axis" },
          { tr: "Otomatik parça toplayıcı opsiyonu", en: "Optional automatic parts catcher" },
        ],
        image: "/machines/cnc-torna-2.svg",
        gallery: ["/machines/cnc-torna-2.svg", "/machines/cnc-torna.svg", "/machines/cnc-torna-3.svg"],
        catalog: "/catalogs/bt-l400m.pdf",
        specs: [
          { label: L.control, value: { tr: "Siemens 828D", en: "Siemens 828D" } },
          { label: L.swing, value: { tr: "Ø 700 mm", en: "Ø 700 mm" } },
          { label: L.maxTurnDia, value: { tr: "Ø 400 mm", en: "Ø 400 mm" } },
          { label: L.maxTurnLen, value: { tr: "1.050 mm", en: "1,050 mm" } },
          { label: L.spindleBore, value: { tr: "Ø 91 mm", en: "Ø 91 mm" } },
          { label: L.spindleSpeed, value: { tr: "3.500 dev/dak", en: "3,500 rpm" } },
          { label: L.spindlePower, value: { tr: "22 / 18,5 kW", en: "22 / 18.5 kW" } },
          { label: L.turret, value: { tr: "12 istasyon (tahrikli)", en: "12 stations (driven)" } },
          { label: L.yTravel, value: { tr: "± 50 mm", en: "± 50 mm" } },
          { label: L.weight, value: { tr: "6.200 kg", en: "6,200 kg" } },
        ],
      },
    ],
  },
  {
    slug: "cnc-dik-isleme-merkezleri",
    icon: "vmc",
    name: { tr: "CNC Dik İşleme Merkezleri", en: "CNC Vertical Machining Centers" },
    tagline: {
      tr: "Rijit kızak yapısı, yüksek tezgah dinamiği",
      en: "Rigid guideway structure, high machine dynamics",
    },
    description: {
      tr: "Kalıp imalatından genel parça işlemeye kadar yüksek talaş kaldırma kapasitesi sunan dik işleme merkezleri. Box-way ve lineer kızak seçenekleriyle her uygulamaya uygun çözüm.",
      en: "Vertical machining centers delivering high metal-removal rates from mold making to general part machining. Box-way and linear-guide options for every application.",
    },
    image: "/categories/dik-isleme.svg",
    products: [
      {
        slug: "bt-vmc850",
        model: "BT-VMC850",
        categorySlug: "cnc-dik-isleme-merkezleri",
        name: { tr: "BT-VMC850 Dik İşleme Merkezi", en: "BT-VMC850 Vertical Machining Center" },
        summary: {
          tr: "Genel imalat için dengeli strok ve yüksek iş mili devri.",
          en: "Balanced travels and high spindle speed for general manufacturing.",
        },
        highlights: [
          { tr: "Direkt bağlı iş mili, düşük titreşim", en: "Direct-drive spindle, low vibration" },
          { tr: "24 takımlı kollu magazin", en: "24-tool armed magazine" },
          { tr: "Termal kompanzasyon standart", en: "Thermal compensation as standard" },
        ],
        image: "/machines/vmc.svg",
        gallery: ["/machines/vmc.svg", "/machines/vmc-2.svg", "/machines/vmc-3.svg"],
        catalog: "/catalogs/bt-vmc850.pdf",
        specs: [
          { label: L.control, value: { tr: "Fanuc 0i-MF Plus", en: "Fanuc 0i-MF Plus" } },
          { label: L.xTravel, value: { tr: "850 mm", en: "850 mm" } },
          { label: L.yTravel, value: { tr: "500 mm", en: "500 mm" } },
          { label: L.zTravel, value: { tr: "540 mm", en: "540 mm" } },
          { label: L.table, value: { tr: "1.000 × 500 mm", en: "1,000 × 500 mm" } },
          { label: L.taper, value: { tr: "BT40", en: "BT40" } },
          { label: L.spindleSpeed, value: { tr: "10.000 dev/dak", en: "10,000 rpm" } },
          { label: L.toolMag, value: { tr: "24 takım", en: "24 tools" } },
          { label: L.rapid, value: { tr: "36 m/dak", en: "36 m/min" } },
          { label: L.accuracy, value: { tr: "± 0,005 mm", en: "± 0.005 mm" } },
        ],
      },
      {
        slug: "bt-vmc1370",
        model: "BT-VMC1370",
        categorySlug: "cnc-dik-isleme-merkezleri",
        name: { tr: "BT-VMC1370 Büyük Tabla İşleme Merkezi", en: "BT-VMC1370 Large-Table Machining Center" },
        summary: {
          tr: "Büyük ve ağır parçalar için güçlü gövde ve geniş strok.",
          en: "Powerful frame and large travels for big, heavy workpieces.",
        },
        highlights: [
          { tr: "Box-way kızaklar, ağır talaş için rijitlik", en: "Box-way guides, rigidity for heavy cuts" },
          { tr: "Dişli kutulu iş mili, yüksek tork", en: "Geared spindle, high torque" },
          { tr: "4./5. eksen hazır altyapı", en: "4th/5th-axis ready infrastructure" },
        ],
        image: "/machines/vmc-2.svg",
        gallery: ["/machines/vmc-2.svg", "/machines/vmc.svg", "/machines/vmc-3.svg"],
        catalog: "/catalogs/bt-vmc1370.pdf",
        specs: [
          { label: L.control, value: { tr: "Siemens 828D", en: "Siemens 828D" } },
          { label: L.xTravel, value: { tr: "1.370 mm", en: "1,370 mm" } },
          { label: L.yTravel, value: { tr: "700 mm", en: "700 mm" } },
          { label: L.zTravel, value: { tr: "700 mm", en: "700 mm" } },
          { label: L.table, value: { tr: "1.500 × 700 mm", en: "1,500 × 700 mm" } },
          { label: L.taper, value: { tr: "BT50", en: "BT50" } },
          { label: L.spindleSpeed, value: { tr: "8.000 dev/dak", en: "8,000 rpm" } },
          { label: L.toolMag, value: { tr: "32 takım", en: "32 tools" } },
          { label: L.maxLoad, value: { tr: "1.200 kg", en: "1,200 kg" } },
          { label: L.weight, value: { tr: "9.500 kg", en: "9,500 kg" } },
        ],
      },
    ],
  },
  {
    slug: "cnc-yatay-isleme-merkezleri",
    icon: "hmc",
    name: { tr: "CNC Yatay İşleme Merkezleri", en: "CNC Horizontal Machining Centers" },
    tagline: {
      tr: "Paletli otomasyon ile kesintisiz üretim",
      en: "Uninterrupted production with pallet automation",
    },
    description: {
      tr: "Yüksek hacimli üretimde verimliliği maksimuma çıkaran, çift paletli yatay işleme merkezleri. Otomotiv ve seri parça üretiminde talaş tahliyesi ve çevrim süresi avantajı sağlar.",
      en: "Twin-pallet horizontal machining centers that maximize efficiency in high-volume production, with superior chip evacuation and cycle-time advantages.",
    },
    image: "/categories/yatay-isleme.svg",
    products: [
      {
        slug: "bt-hmc500",
        model: "BT-HMC500",
        categorySlug: "cnc-yatay-isleme-merkezleri",
        name: { tr: "BT-HMC500 Yatay İşleme Merkezi", en: "BT-HMC500 Horizontal Machining Center" },
        summary: {
          tr: "500 mm paletli, otomasyona hazır yatay işleme merkezi.",
          en: "500 mm pallet, automation-ready horizontal machining center.",
        },
        highlights: [
          { tr: "Çift palet, gizli çevrim süresi", en: "Twin pallet, hidden cycle time" },
          { tr: "1° döner tabla (B ekseni) standart", en: "1° rotary table (B-axis) standard" },
          { tr: "Yüksek basınçlı içten soğutma opsiyonu", en: "Optional high-pressure through-spindle coolant" },
        ],
        image: "/machines/hmc.svg",
        gallery: ["/machines/hmc.svg", "/machines/hmc-2.svg", "/machines/vmc-3.svg"],
        catalog: "/catalogs/bt-hmc500.pdf",
        specs: [
          { label: L.control, value: { tr: "Fanuc 31i-B", en: "Fanuc 31i-B" } },
          { label: L.xTravel, value: { tr: "730 mm", en: "730 mm" } },
          { label: L.yTravel, value: { tr: "730 mm", en: "730 mm" } },
          { label: L.zTravel, value: { tr: "760 mm", en: "760 mm" } },
          { label: L.table, value: { tr: "500 × 500 mm palet", en: "500 × 500 mm pallet" } },
          { label: L.taper, value: { tr: "BT50", en: "BT50" } },
          { label: L.spindleSpeed, value: { tr: "12.000 dev/dak", en: "12,000 rpm" } },
          { label: L.toolMag, value: { tr: "60 takım", en: "60 tools" } },
          { label: L.maxLoad, value: { tr: "700 kg / palet", en: "700 kg / pallet" } },
          { label: L.accuracy, value: { tr: "± 0,004 mm", en: "± 0.004 mm" } },
        ],
      },
    ],
  },
  {
    slug: "dik-tornalar",
    icon: "vtl",
    name: { tr: "Dik Tornalar", en: "Vertical Turning Lathes" },
    tagline: {
      tr: "Büyük çaplı, ağır parçalarda kararlı işleme",
      en: "Stable machining of large-diameter, heavy parts",
    },
    description: {
      tr: "Ağır ve büyük çaplı parçaların tornalanması için tasarlanmış dik tornalar (VTL). Yüksek tabla taşıma kapasitesi ve ATC opsiyonuyla tornalama ve frezelemeyi birleştirir.",
      en: "Vertical turning lathes (VTL) designed for turning heavy, large-diameter parts. High table load capacity and optional ATC combine turning and milling.",
    },
    image: "/categories/dik-torna.svg",
    products: [
      {
        slug: "bt-vl1600",
        model: "BT-VL1600",
        categorySlug: "dik-tornalar",
        name: { tr: "BT-VL1600 Dik Torna", en: "BT-VL1600 Vertical Turning Lathe" },
        summary: {
          tr: "1.600 mm tabla, ağır sanayi parçaları için yüksek rijitlik.",
          en: "1,600 mm table, high rigidity for heavy-industry parts.",
        },
        highlights: [
          { tr: "Ø 1.600 mm planşet, hidrostatik kızak", en: "Ø 1,600 mm faceplate, hydrostatic guide" },
          { tr: "ATC + tahrikli takım (C ekseni) opsiyonu", en: "Optional ATC + live tooling (C-axis)" },
          { tr: "Otomatik dengeleme ve yağlama", en: "Automatic balancing and lubrication" },
        ],
        image: "/machines/vtl.svg",
        gallery: ["/machines/vtl.svg", "/machines/vtl-2.svg", "/machines/cnc-torna-3.svg"],
        catalog: "/catalogs/bt-vl1600.pdf",
        specs: [
          { label: L.control, value: { tr: "Fanuc 0i-TF Plus", en: "Fanuc 0i-TF Plus" } },
          { label: L.maxTurnDia, value: { tr: "Ø 1.800 mm", en: "Ø 1,800 mm" } },
          { label: { tr: "Planşet Çapı", en: "Faceplate Diameter" }, value: { tr: "Ø 1.600 mm", en: "Ø 1,600 mm" } },
          { label: { tr: "Maks. Tornalama Yüksekliği", en: "Max. Turning Height" }, value: { tr: "1.250 mm", en: "1,250 mm" } },
          { label: L.spindleSpeed, value: { tr: "200 dev/dak", en: "200 rpm" } },
          { label: L.spindlePower, value: { tr: "37 kW", en: "37 kW" } },
          { label: L.maxLoad, value: { tr: "8.000 kg", en: "8,000 kg" } },
          { label: L.weight, value: { tr: "22.000 kg", en: "22,000 kg" } },
        ],
      },
    ],
  },
  {
    slug: "taslama-tezgahlari",
    icon: "grinder",
    name: { tr: "Taşlama Tezgahları", en: "Grinding Machines" },
    tagline: {
      tr: "Mikron seviyesinde yüzey kalitesi",
      en: "Micron-level surface quality",
    },
    description: {
      tr: "Silindirik, satıh ve iç çap taşlama uygulamaları için yüksek hassasiyetli taşlama tezgahları. Hassas parça finisajı ve tekrarlanabilir kalite gerektiren işler için idealdir.",
      en: "High-precision grinding machines for cylindrical, surface and internal-diameter applications. Ideal for precision finishing and repeatable quality requirements.",
    },
    image: "/categories/taslama.svg",
    products: [
      {
        slug: "bt-cg500",
        model: "BT-CG500",
        categorySlug: "taslama-tezgahlari",
        name: { tr: "BT-CG500 Silindirik Taşlama", en: "BT-CG500 Cylindrical Grinder" },
        summary: {
          tr: "CNC silindirik taşlama, hassas mil ve burç finisajı.",
          en: "CNC cylindrical grinding for precise shaft and bushing finishing.",
        },
        highlights: [
          { tr: "Granit benzeri rijit gövde, termal kararlılık", en: "Rigid base, thermal stability" },
          { tr: "Otomatik taş dengeleme sistemi", en: "Automatic wheel balancing system" },
          { tr: "Prob ile otomatik ölçüm opsiyonu", en: "Optional in-process gauging probe" },
        ],
        image: "/machines/grinder.svg",
        gallery: ["/machines/grinder.svg", "/machines/grinder-2.svg", "/machines/grinder-3.svg"],
        catalog: "/catalogs/bt-cg500.pdf",
        specs: [
          { label: L.control, value: { tr: "Siemens 828D", en: "Siemens 828D" } },
          { label: { tr: "Punta Mesafesi", en: "Distance Between Centers" }, value: { tr: "500 mm", en: "500 mm" } },
          { label: { tr: "Maks. Taşlama Çapı", en: "Max. Grinding Diameter" }, value: { tr: "Ø 250 mm", en: "Ø 250 mm" } },
          { label: L.wheelDia, value: { tr: "Ø 500 mm", en: "Ø 500 mm" } },
          { label: L.accuracy, value: { tr: "± 0,001 mm", en: "± 0.001 mm" } },
          { label: { tr: "Yüzey Pürüzlülüğü", en: "Surface Roughness" }, value: { tr: "Ra 0,2 µm", en: "Ra 0.2 µm" } },
          { label: L.weight, value: { tr: "4.500 kg", en: "4,500 kg" } },
        ],
      },
      {
        slug: "bt-sg60",
        model: "BT-SG60",
        categorySlug: "taslama-tezgahlari",
        name: { tr: "BT-SG60 Satıh Taşlama", en: "BT-SG60 Surface Grinder" },
        summary: {
          tr: "Düz yüzeyler için yüksek hassasiyetli satıh taşlama tezgahı.",
          en: "High-precision surface grinder for flat surfaces.",
        },
        highlights: [
          { tr: "Manyetik tabla standart", en: "Magnetic chuck as standard" },
          { tr: "Hassas lineer kızaklar", en: "Precision linear guideways" },
          { tr: "Otomatik dalma ve perdahlama çevrimi", en: "Automatic plunge and finishing cycle" },
        ],
        image: "/machines/grinder-2.svg",
        gallery: ["/machines/grinder-2.svg", "/machines/grinder.svg", "/machines/grinder-3.svg"],
        catalog: "/catalogs/bt-sg60.pdf",
        specs: [
          { label: L.control, value: { tr: "PLC + Dijital Kontrol", en: "PLC + Digital Control" } },
          { label: L.table, value: { tr: "600 × 300 mm", en: "600 × 300 mm" } },
          { label: { tr: "Maks. Taşlama Yüksekliği", en: "Max. Grinding Height" }, value: { tr: "400 mm", en: "400 mm" } },
          { label: L.wheelDia, value: { tr: "Ø 355 mm", en: "Ø 355 mm" } },
          { label: L.accuracy, value: { tr: "± 0,002 mm", en: "± 0.002 mm" } },
          { label: L.weight, value: { tr: "2.600 kg", en: "2,600 kg" } },
        ],
      },
    ],
  },
  {
    slug: "disli-profil-taslama",
    icon: "gear",
    name: { tr: "Dişli Profil Taşlama Tezgahları", en: "Gear & Profile Grinding Machines" },
    tagline: {
      tr: "Yüksek kaliteli dişli imalatında uzmanlık",
      en: "Expertise in high-quality gear manufacturing",
    },
    description: {
      tr: "Sertleştirilmiş dişlilerin profil taşlanması için özel olarak geliştirilmiş tezgahlar. Güç aktarım sistemleri, redüktör ve havacılık dişlilerinde DIN 3 sınıfı hassasiyet sağlar.",
      en: "Machines developed specifically for profile grinding of hardened gears, delivering DIN class 3 accuracy for power transmission, gearbox and aerospace gears.",
    },
    image: "/categories/disli-taslama.svg",
    products: [
      {
        slug: "bt-gp800",
        model: "BT-GP800",
        categorySlug: "disli-profil-taslama",
        name: { tr: "BT-GP800 Dişli Profil Taşlama", en: "BT-GP800 Gear Profile Grinder" },
        summary: {
          tr: "Büyük modüllü dişlilerde yüksek hassasiyetli profil taşlama.",
          en: "High-precision profile grinding for large-module gears.",
        },
        highlights: [
          { tr: "CNC kavisli profil düzeltme (dressing)", en: "CNC dressing for crowned profiles" },
          { tr: "Entegre dişli ölçüm istasyonu", en: "Integrated gear measurement station" },
          { tr: "DIN 3 sınıfı tekrarlanabilirlik", en: "DIN class 3 repeatability" },
        ],
        image: "/machines/gear.svg",
        gallery: ["/machines/gear.svg", "/machines/gear-2.svg", "/machines/grinder-3.svg"],
        catalog: "/catalogs/bt-gp800.pdf",
        specs: [
          { label: L.control, value: { tr: "Siemens 840D sl", en: "Siemens 840D sl" } },
          { label: { tr: "Maks. Dişli Çapı", en: "Max. Gear Diameter" }, value: { tr: "Ø 800 mm", en: "Ø 800 mm" } },
          { label: L.module, value: { tr: "1 – 16 modül", en: "1 – 16 module" } },
          { label: { tr: "Maks. Helis Açısı", en: "Max. Helix Angle" }, value: { tr: "± 45°", en: "± 45°" } },
          { label: { tr: "Taşlama Kalitesi", en: "Grinding Quality" }, value: { tr: "DIN 3", en: "DIN class 3" } },
          { label: L.weight, value: { tr: "14.000 kg", en: "14,000 kg" } },
        ],
      },
    ],
  },
  {
    slug: "cnc-kayar-otomatlar",
    icon: "swiss",
    name: { tr: "CNC Kayar Otomatlar", en: "CNC Swiss Type Lathes" },
    tagline: {
      tr: "Küçük çaplı parçalarda yüksek hız ve seri üretim",
      en: "High speed and serial production for small-diameter parts",
    },
    description: {
      tr: "Kılavuz burç teknolojisiyle ince ve uzun parçaları titreşimsiz, mikron hassasiyetinde işleyen kayar otomatlar. Tıbbi, elektronik, otomotiv ve bağlantı elemanı sektörlerinde tek bağlamada komple bitmiş parça üretir.",
      en: "Swiss-type lathes that machine thin, long parts vibration-free at micron accuracy with guide-bushing technology. They produce complete finished parts in a single setup for medical, electronics, automotive and fastener industries.",
    },
    image: "/categories/cnc-kayar-otomatlar.svg",
    products: [
      {
        slug: "ma25-6s",
        model: "MA25-6S",
        categorySlug: "cnc-kayar-otomatlar",
        name: {
          tr: "JIANKE - MA25-6S CNC Kayar Otomat",
          en: "JIANKE - MA25-6S Swiss Type Lathe",
        },
        summary: {
          tr: "Ø25 mm bar kapasiteli, 6 eksenli, çift iş milli (ana + karşı) yüksek hassasiyetli CNC kayar otomat. Tek bağlamada komple bitmiş parça üretir.",
          en: "Ø25 mm bar capacity, 6-axis, twin-spindle (main + sub) high-precision Swiss-type lathe. Produces a complete finished part in a single setup.",
        },
        highlights: [
          { tr: "6 eksen ve çift iş mili (ana + karşı) ile tek bağlamada komple işleme", en: "Complete machining in one setup with 6 axes and twin spindle (main + sub)" },
          { tr: "Built-in yağ soğutmalı iş mili, Japon NSK rulman — 10.000 dev/dak", en: "Built-in oil-cooled spindle with Japanese NSK bearings — 10,000 rpm" },
          { tr: "Patentli 6 eksenli takım tutucu: yüksek rijitlik ve geniş takım kapasitesi", en: "Patented 6-axis tool holder: high rigidity and expanded tool capacity" },
          { tr: "0,001 mm çözünürlük ve 0,001° iş mili indekslemesiyle mikron hassasiyet", en: "Micron accuracy with 0.001 mm resolution and 0.001° spindle indexing" },
        ],
        features: [
          { tr: "Guide bush ile veya guide bush'suz çalışma esnekliği; uzun ince parçalarda titreşimsiz işleme, kısa parçalarda malzeme tasarrufu", en: "Works with or without guide bush; vibration-free machining of long slender parts and material savings on short parts" },
          { tr: "Built-in yağ soğutmalı ana ve karşı iş mili — homojen ısı dağılımı, yüksek hızda kararlı hassasiyet (Japon NSK rulman)", en: "Built-in oil-cooled main and sub spindle — uniform heat distribution and stable high-speed accuracy (Japanese NSK bearings)" },
          { tr: "Patentli yüksek modüler 6 eksen takım tutucu — maksimum 6 yan + 6 alın yüzeyi canlı takıma kadar genişletme", en: "Patented highly modular 6-axis tool holder — expandable up to 6 side + 6 face live tools" },
          { tr: "Çift parça tahliye sistemi: kısa parçalar için konveyör bant, uzun parçalar için karşı iş milinden arka tahliye", en: "Dual parts-discharge: belt conveyor for short parts, rear ejection through the sub spindle for long parts" },
          { tr: "250 L yüksek kapasiteli kesme yağı tankı — sürekli sirkülasyon ve filtrasyon", en: "250 L high-capacity cutting-oil tank — continuous circulation and filtration" },
          { tr: "Tak-çıkar modüler genişletme: eksenel/radyal döner takım, diş girdaplama ve dişli frezeleme üniteleri", en: "Plug-in modular expansion: axial/radial rotary tooling, thread-whirling and gear-milling units" },
          { tr: "Premium bileşenler: Mitsubishi servo ve sürücü, THK kızak ve vida, NSK rulman", en: "Premium components: Mitsubishi servo and drives, THK guides and screws, NSK bearings" },
        ],
        image: "/machines/swiss-type/ma25-6s-1.png",
        gallery: [
          "/machines/swiss-type/ma25-6s-1.png",
          "/machines/swiss-type/ma25-6s-2.png",
          "/machines/swiss-type/ma25-6s-3.jpg",
          "/machines/swiss-type/ma25-6s-4.jpg",
        ],
        catalog: "/catalogs/swiss-type/ma25-6s.pdf",
        specs: [
          { label: L.control, value: { tr: "Syntec 210TB-A (Çift Kanal)", en: "Syntec 210TB-A (Dual Channel)" } },
          { label: { tr: "Maks. İşleme Çapı", en: "Max. Machining Diameter" }, value: { tr: "Ø 25 mm", en: "Ø 25 mm" } },
          { label: { tr: "Maks. Çubuk Besleme Boyu (Guide Bush)", en: "Max. Bar Feed Length (Guide Bush)" }, value: { tr: "195 mm", en: "195 mm" } },
          { label: L.axes, value: { tr: "6 eksen (X1, Y1, Z1, X2, Y2, Z2)", en: "6 axes (X1, Y1, Z1, X2, Y2, Z2)" } },
          { label: { tr: "İş Mili Tipi", en: "Spindle Type" }, value: { tr: "Built-in, iç yağ soğutmalı", en: "Built-in, internal oil-cooled" } },
          { label: { tr: "Ana / Karşı İş Mili Devri", en: "Main / Sub Spindle Speed" }, value: { tr: "10.000 / 10.000 dev/dak", en: "10,000 / 10,000 rpm" } },
          { label: { tr: "İş Mili İndeksleme", en: "Spindle Indexing" }, value: { tr: "0,001°", en: "0.001°" } },
          { label: { tr: "İş Mili Geçiş Deliği", en: "Spindle Through-Hole" }, value: { tr: "Ø 26 mm", en: "Ø 26 mm" } },
          { label: { tr: "Ana / Karşı İş Mili Gücü", en: "Main / Sub Spindle Power" }, value: { tr: "2,5 / 3,7 kW", en: "2.5 / 3.7 kW" } },
          { label: { tr: "Ana İş Mili Maks. Delme / Diş", en: "Main Spindle Max. Drill / Tap" }, value: { tr: "Ø 10 / M8", en: "Ø 10 / M8" } },
          { label: { tr: "Canlı Takım Maks. Delme / Diş", en: "Live Tool Max. Drill / Tap" }, value: { tr: "Ø 8 / M6", en: "Ø 8 / M6" } },
          { label: { tr: "Minimum Ayar Birimi", en: "Minimum Setting Unit" }, value: { tr: "0,001 mm", en: "0.001 mm" } },
          { label: L.rapid, value: { tr: "24 – 32 m/dak", en: "24 – 32 m/min" } },
          { label: { tr: "Kesme Yağı Tankı", en: "Cutting Oil Tank" }, value: { tr: "250 L", en: "250 L" } },
          { label: { tr: "Güç Kapasitesi", en: "Power Capacity" }, value: { tr: "15 kW", en: "15 kW" } },
          { label: { tr: "Makine Ölçüsü (U×G×Y)", en: "Machine Size (L×W×H)" }, value: { tr: "2,4 × 1,4 × 1,7 m", en: "2.4 × 1.4 × 1.7 m" } },
          { label: L.weight, value: { tr: "3.050 kg", en: "3,050 kg" } },
        ],
      },
      {
        slug: "ma25-5ii",
        model: "MA25-5 II",
        categorySlug: "cnc-kayar-otomatlar",
        name: {
          tr: "JIANKE - MA25-5 II CNC Kayar Otomat",
          en: "JIANKE - MA25-5 II Swiss Type Lathe",
        },
        summary: {
          tr: "Ø25 mm bar kapasiteli, 5 eksenli, çift iş milli (ana + karşı) kayar otomat. Zengin tahrikli takım kafasıyla tek bağlamada komple işleme.",
          en: "Ø25 mm bar capacity, 5-axis, twin-spindle (main + sub) Swiss-type lathe. Complete machining in a single setup with a rich driven-tool head.",
        },
        highlights: [
          { tr: "5 eksen ve çift iş mili (ana + karşı) ile tek bağlamada komple işleme", en: "Complete machining in one setup with 5 axes and twin spindle (main + sub)" },
          { tr: "Built-in yağ soğutmalı iş mili, Japon NSK rulman — 10.000 dev/dak", en: "Built-in oil-cooled spindle with Japanese NSK bearings — 10,000 rpm" },
          { tr: "Guide bush ile veya guide bush'suz çalışma; 0,001 mm / 0,001° mikron hassasiyet", en: "Operation with or without guide bush; 0.001 mm / 0.001° micron accuracy" },
          { tr: "Zengin tahrikli takım kafası: ER16 freze, whirling, çok açılı ve poligon üniteleri", en: "Rich driven-tool head: ER16 milling, whirling, multi-angle and polygon units" },
        ],
        features: [
          { tr: "Guide bush ile veya guide bush'suz çalışma esnekliği; uzun ince parçalarda titreşimsiz işleme, kısa parçalarda malzeme tasarrufu", en: "Works with or without guide bush; vibration-free machining of long slender parts and material savings on short parts" },
          { tr: "Built-in yağ soğutmalı ana ve karşı iş mili — homojen ısı dağılımı ve yüksek hızda kararlı hassasiyet (Japon NSK rulman)", en: "Built-in oil-cooled main and sub spindle — uniform heat distribution and stable high-speed accuracy (Japanese NSK bearings)" },
          { tr: "Standart 4 iş mili tahrikli kafa (opsiyonel 5 iş miline kadar), ER16 hızlı değiştirilebilir takım arayüzü", en: "Standard 4-spindle driven head (optionally up to 5 spindles), ER16 quick-change tool interface" },
          { tr: "Zengin tahrikli takım üniteleri: ER16 freze, whirling, çok açılı freze, poligon işleme, kanal freze, karşı tip delme ve yan kombine üniteler", en: "Rich driven-tool units: ER16 milling, whirling, multi-angle milling, polygon machining, slot milling, opposed drilling and side combination units" },
          { tr: "Çift parça tahliye sistemi: kısa parçalar için konveyör bant, uzun parçalar için karşı iş milinden arka tahliye", en: "Dual parts-discharge: belt conveyor for short parts, rear ejection through the sub spindle for long parts" },
          { tr: "250 L yüksek kapasiteli kesme yağı tankı — sürekli sirkülasyon ve filtrasyon", en: "250 L high-capacity cutting-oil tank — continuous circulation and filtration" },
          { tr: "Premium bileşenler: Mitsubishi servo ve sürücü, THK kızak ve vida, NSK rulman", en: "Premium components: Mitsubishi servo and drives, THK guides and screws, NSK bearings" },
        ],
        image: "/machines/swiss-type/ma25-5ii-1.png",
        gallery: [
          "/machines/swiss-type/ma25-5ii-1.png",
          "/machines/swiss-type/ma25-5ii-2.png",
          "/machines/swiss-type/ma25-5ii-3.jpg",
          "/machines/swiss-type/ma25-5ii-4.jpg",
        ],
        catalog: "/catalogs/swiss-type/ma25-5ii.pdf",
        specs: [
          { label: L.control, value: { tr: "Syntec 210TB-A (Çift Kanal)", en: "Syntec 210TB-A (Dual Channel)" } },
          { label: { tr: "Maks. İşleme Çapı", en: "Max. Machining Diameter" }, value: { tr: "Ø 25 mm", en: "Ø 25 mm" } },
          { label: { tr: "Maks. Çubuk Besleme Boyu (Guide Bush)", en: "Max. Bar Feed Length (Guide Bush)" }, value: { tr: "195 mm", en: "195 mm" } },
          { label: L.axes, value: { tr: "5 eksen (X1, Y1, Z1, X2, Z2)", en: "5 axes (X1, Y1, Z1, X2, Z2)" } },
          { label: { tr: "İş Mili Tipi", en: "Spindle Type" }, value: { tr: "Built-in, iç yağ soğutmalı", en: "Built-in, internal oil-cooled" } },
          { label: { tr: "Ana / Karşı İş Mili Devri", en: "Main / Sub Spindle Speed" }, value: { tr: "10.000 / 10.000 dev/dak", en: "10,000 / 10,000 rpm" } },
          { label: { tr: "İş Mili İndeksleme", en: "Spindle Indexing" }, value: { tr: "0,001°", en: "0.001°" } },
          { label: { tr: "İş Mili Geçiş Deliği", en: "Spindle Through-Hole" }, value: { tr: "Ø 26 mm", en: "Ø 26 mm" } },
          { label: { tr: "Ana / Karşı İş Mili Gücü", en: "Main / Sub Spindle Power" }, value: { tr: "2,5 / 3,7 kW", en: "2.5 / 3.7 kW" } },
          { label: { tr: "Ana İş Mili Maks. Delme / Diş", en: "Main Spindle Max. Drill / Tap" }, value: { tr: "Ø 10 / M8", en: "Ø 10 / M8" } },
          { label: { tr: "Canlı Takım Maks. Delme / Diş", en: "Live Tool Max. Drill / Tap" }, value: { tr: "Ø 8 / M6", en: "Ø 8 / M6" } },
          { label: { tr: "Yan Canlı Takım Hızı", en: "Side Live Tool Speed" }, value: { tr: "6.000 dev/dak", en: "6,000 rpm" } },
          { label: { tr: "Minimum Ayar Birimi", en: "Minimum Setting Unit" }, value: { tr: "0,001 mm", en: "0.001 mm" } },
          { label: L.rapid, value: { tr: "24 – 32 m/dak", en: "24 – 32 m/min" } },
          { label: { tr: "Kesme Yağı Tankı", en: "Cutting Oil Tank" }, value: { tr: "250 L", en: "250 L" } },
          { label: { tr: "Güç Kapasitesi", en: "Power Capacity" }, value: { tr: "15 kW", en: "15 kW" } },
          { label: { tr: "Makine Ölçüsü (U×G×Y)", en: "Machine Size (L×W×H)" }, value: { tr: "2,4 × 1,4 × 1,7 m", en: "2.4 × 1.4 × 1.7 m" } },
          { label: L.weight, value: { tr: "3.050 kg", en: "3,050 kg" } },
        ],
      },
      {
        slug: "bt-sw20",
        model: "BT-SW20",
        categorySlug: "cnc-kayar-otomatlar",
        name: { tr: "BT-SW20 CNC Kayar Otomat", en: "BT-SW20 Swiss Type Lathe" },
        summary: {
          tr: "Ø 20 mm bar kapasiteli yüksek hızlı kayar otomat. Tıbbi ve elektronik parçalar için ideal.",
          en: "Ø 20 mm bar capacity high-speed Swiss lathe. Ideal for medical and electronic parts.",
        },
        highlights: [
          { tr: "Kılavuz burçla uzun ince parçalarda titreşimsiz işleme", en: "Vibration-free machining of long, slender parts via guide bushing" },
          { tr: "Arka iş mili ile tek bağlamada komple bitmiş parça", en: "Complete finished part in one setup with back spindle" },
          { tr: "Otomatik parça yakalama ünitesi", en: "Automatic parts-catching unit" },
        ],
        features: [
          { tr: "Yüksek rijitlik ve termal kararlılık sağlayan döküm gövde", en: "Cast body delivering high rigidity and thermal stability" },
          { tr: "12.000 dev/dak ana iş mili ile yüksek kesme hızı", en: "High cutting speed with a 12,000 rpm main spindle" },
          { tr: "Tahrikli takımlar ve C ekseni ile frezeleme / delme", en: "Milling / drilling with live tools and C-axis" },
          { tr: "Entegre bar besleyici ile kesintisiz seri üretim", en: "Uninterrupted serial production with an integrated bar feeder" },
          { tr: "Parça yakalama ve arka işleme ünitesi standart", en: "Parts catcher and back-working unit as standard" },
          { tr: "Yüksek basınçlı soğutma ile uzun takım ömrü", en: "Long tool life with high-pressure coolant" },
        ],
        image: "/machines/swiss-type/bt-sw20-1.svg",
        gallery: [
          "/machines/swiss-type/bt-sw20-1.svg",
          "/machines/swiss-type/bt-sw20-2.svg",
          "/machines/swiss-type/bt-sw20-3.svg",
        ],
        catalog: "/catalogs/swiss-type/bt-sw20.pdf",
        specs: [
          { label: L.control, value: { tr: "Fanuc 32i-B", en: "Fanuc 32i-B" } },
          { label: L.barCapacity, value: { tr: "Ø 20 mm", en: "Ø 20 mm" } },
          { label: L.guideBushing, value: { tr: "Var (çıkarılabilir)", en: "Yes (removable)" } },
          { label: L.maxPartLen, value: { tr: "200 mm", en: "200 mm" } },
          { label: L.spindleSpeed, value: { tr: "12.000 dev/dak", en: "12,000 rpm" } },
          { label: L.backSpindleSpeed, value: { tr: "10.000 dev/dak", en: "10,000 rpm" } },
          { label: L.axes, value: { tr: "7 eksen", en: "7 axes" } },
          { label: L.toolStations, value: { tr: "20+ takım", en: "20+ tools" } },
          { label: L.liveTools, value: { tr: "Evet", en: "Yes" } },
          { label: L.accuracy, value: { tr: "± 0,002 mm", en: "± 0.002 mm" } },
          { label: L.weight, value: { tr: "2.600 kg", en: "2,600 kg" } },
        ],
      },
      {
        slug: "bt-sw32",
        model: "BT-SW32",
        categorySlug: "cnc-kayar-otomatlar",
        name: { tr: "BT-SW32 CNC Kayar Otomat", en: "BT-SW32 Swiss Type Lathe" },
        summary: {
          tr: "Ø 32 mm bar kapasiteli, güçlü kayar otomat. Daha büyük çaplı seri parçalar için.",
          en: "Ø 32 mm bar capacity, powerful Swiss lathe for larger-diameter serial parts.",
        },
        highlights: [
          { tr: "Kılavuz burçlu / burçsuz çalışma esnekliği", en: "Flexible operation with or without guide bushing" },
          { tr: "Güçlü ana ve arka iş mili ile ağır kesme", en: "Heavy cutting with powerful main and back spindles" },
          { tr: "Yüksek takım kapasiteli gang + taret yapısı", en: "High tool capacity gang + turret layout" },
        ],
        features: [
          { tr: "Geniş bar kapasitesiyle daha büyük parçalarda seri üretim", en: "Serial production of larger parts with wide bar capacity" },
          { tr: "Burçsuz moda geçiş ile malzeme tasarrufu", en: "Material savings by switching to bushing-less mode" },
          { tr: "Senkronize arka iş mili ile tam bitmiş parça", en: "Fully finished part with synchronized back spindle" },
          { tr: "Sağlam gövde ile uzun vadeli hassasiyet", en: "Long-term accuracy with a robust frame" },
          { tr: "Parça yakalama ünitesi ve konveyör entegrasyonu", en: "Parts-catcher unit and conveyor integration" },
        ],
        image: "/machines/swiss-type/bt-sw32-1.svg",
        gallery: [
          "/machines/swiss-type/bt-sw32-1.svg",
          "/machines/swiss-type/bt-sw20-2.svg",
          "/machines/swiss-type/bt-sw20-3.svg",
        ],
        catalog: "/catalogs/swiss-type/bt-sw32.pdf",
        specs: [
          { label: L.control, value: { tr: "Fanuc 32i-B", en: "Fanuc 32i-B" } },
          { label: L.barCapacity, value: { tr: "Ø 32 mm", en: "Ø 32 mm" } },
          { label: L.guideBushing, value: { tr: "Var (burçsuz moda uygun)", en: "Yes (bushing-less capable)" } },
          { label: L.maxPartLen, value: { tr: "320 mm", en: "320 mm" } },
          { label: L.spindleSpeed, value: { tr: "10.000 dev/dak", en: "10,000 rpm" } },
          { label: L.backSpindleSpeed, value: { tr: "8.000 dev/dak", en: "8,000 rpm" } },
          { label: L.axes, value: { tr: "8 eksen", en: "8 axes" } },
          { label: L.toolStations, value: { tr: "24+ takım", en: "24+ tools" } },
          { label: L.liveTools, value: { tr: "Evet", en: "Yes" } },
          { label: L.accuracy, value: { tr: "± 0,003 mm", en: "± 0.003 mm" } },
          { label: L.weight, value: { tr: "3.400 kg", en: "3,400 kg" } },
        ],
      },
    ],
  },
];

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getProduct(categorySlug: string, productSlug: string): Product | undefined {
  return getCategory(categorySlug)?.products.find((p) => p.slug === productSlug);
}

export function allProducts(): Product[] {
  return categories.flatMap((c) => c.products);
}

/** Convenience: resolve a localized field. */
export function t(value: Localized, locale: Locale): string {
  return value[locale];
}
