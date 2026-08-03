"""Verify CK61180 PDF — check text positions for overlaps."""
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import stringWidth
pdfmetrics.registerFont(TTFont("Arial", "C:/Windows/Fonts/arial.ttf"))
pdfmetrics.registerFont(TTFont("ArialB", "C:/Windows/Fonts/arialbd.ttf"))

def wrap(text, font, sz, maxw):
    if not text: return [""]
    words = text.split(); lines = []; cur = ""
    for w in words:
        t = (cur + " " + w).strip()
        if stringWidth(t, font, sz) <= maxw:
            cur = t
        else:
            if cur: lines.append(cur)
            cur = w
    if cur: lines.append(cur)
    return lines or [""]

# Simulate the layout for CK61180
IW = 595.28 - 2*14*mm
SIDE = 14*mm
W = 595.28; H = 841.89

# Simulated values from CK61180
highlights = [
    "Ø1800mm maks. yatak üzeri çevirme çapı, 1100mm süper ağır tip kızak genişliği, yekpare monoblok gövde — çok büyük çaplı döküm ve enerji sektörü parçaları için tasarlanmış güçlü yapı",
    "22 kW iş mili motor gücü, ISO A2-15 iş mili koniği, Ø130mm iş mili delik çapı — büyük çaplı bar ve mil geçişi kapasitesi",
    "3.15–315 dev/dak iş mili devir aralığı, manuel 4 kademe + kademe içi kademesiz hız yapısı — geniş kesme parametresi kontrolü",
    "7 yatak uzunluğu seçeneği (1500–8000mm) + 20.000mm'ye kadar özel uzatma — ağır sanayi tipi uzun mil/şaft tornalama kapasitesi",
    "300×300 mm dikey 4 istasyonlu taret, 40×40 mm dış tornalama kalemi — süper ağır tip kesme takım kapasitesi",
    "Ø1400 mm 4 çeneli manuel ayna — çok büyük çaplı ağır flanş, tambur ve boru bağlama kapasitesi",
]

iw = IW * 0.50
rw = IW - iw - 5*mm
hl_w = rw - 4*mm

print("=== HIGHLIGHT WRAP TEST ===")
HL_FONT = 6.5; HL_LINE = 2.8*mm
total_hl_h = 0
for i, h in enumerate(highlights):
    lines = wrap(h, "Arial", HL_FONT, hl_w)
    h_mm = len(lines)*HL_LINE + 2*mm
    total_hl_h += h_mm
    print(f"  [{i}] {len(lines)} lines, {h_mm/mm:.1f}mm")
print(f"  Total highlight height: {total_hl_h/mm:.1f}mm")

# Image height
ih = iw / 1.79  # approximate
print(f"\n=== SPACE CHECK ===")
print(f"  Image height: {ih/mm:.1f}mm")
print(f"  Highlights total: {total_hl_h/mm:.1f}mm + header 14mm = {(total_hl_h+14*mm)/mm:.1f}mm")
print(f"  Image bottom vs highlights bottom offset: {(ih - total_hl_h - 14*mm)/mm:.1f}mm")

# Summary starts after max(image_bottom, highlights_bottom)
hero_section = max(ih, total_hl_h + 14*mm)
print(f"  Hero section total: {hero_section/mm:.1f}mm")

# Page budget
budget = 841.89 - 12*mm - 30*mm - 5*mm  # top - logo - separator
print(f"  Available after header: {budget/mm:.1f}mm")
print(f"  After hero+summary: {(budget - hero_section - 15*mm)/mm:.1f}mm for table+footer")

specs = 18  # CK61180 has 18 specs = 9 rows
rows = 9
min_row_h = 4.5*mm
print(f"  Table needs ~{rows*min_row_h/mm:.0f}mm min for {rows} rows + {26}mm footer")
print(f"  Total table+footer: {(rows*min_row_h + 26*mm)/mm:.0f}mm")

remain = budget - hero_section - 15*mm
table_footer = rows * min_row_h + 26*mm
print(f"\n  FITS: {'YES' if remain >= table_footer else 'NO'} (remain={remain/mm:.0f}mm, need={table_footer/mm:.0f}mm)")
