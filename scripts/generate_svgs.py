# -*- coding: utf-8 -*-
"""Generate cohesive 'engineering blueprint on steel' placeholder SVGs.
Run with the project's Python. Output goes to ../public/{categories,machines,hero}.
Replace these with real photography later (same paths or update data/products.ts).
"""
import os, math

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
PUB = os.path.join(ROOT, "public")

BLUE = "#3f6fc0"        # accent (lighter than logo so it reads on dark)
BLUE_DK = "#1f4488"
STEEL = "#aab2bd"
STEEL_DK = "#6b7079"
LINE = "#3a4150"

def frame(w, h, body, label_top="BORSAN TEKNOLOJİ", label_bottom="", code=""):
    grid = (
        f'<pattern id="g" width="48" height="48" patternUnits="userSpaceOnUse">'
        f'<path d="M48 0H0V48" fill="none" stroke="#ffffff" stroke-opacity="0.045" stroke-width="1"/>'
        f'</pattern>'
    )
    ticks = ""
    m = 26
    for (x, y, dx, dy) in [(m, m, 1, 1), (w - m, m, -1, 1), (m, h - m, 1, -1), (w - m, h - m, -1, -1)]:
        ticks += (f'<path d="M{x} {y}h{18*dx}M{x} {y}v{18*dy}" stroke="{STEEL_DK}" '
                  f'stroke-width="2" stroke-linecap="round" opacity="0.8"/>')
    top = (f'<text x="{m+6}" y="{m+10}" fill="{STEEL_DK}" font-family="Arial" font-size="15" '
           f'letter-spacing="3" opacity="0.85">{label_top}</text>')
    code_t = (f'<text x="{w-m-6}" y="{m+10}" text-anchor="end" fill="{BLUE}" font-family="Arial" '
              f'font-size="15" font-weight="700" letter-spacing="1">{code}</text>') if code else ""
    bottom = (f'<text x="{m+6}" y="{h-m-4}" fill="{STEEL}" font-family="Arial" font-size="22" '
              f'font-weight="700" letter-spacing="1">{label_bottom}</text>') if label_bottom else ""
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}" role="img">
<defs>
<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="#171b22"/><stop offset="0.55" stop-color="#12151b"/><stop offset="1" stop-color="#0c0e13"/>
</linearGradient>
<radialGradient id="glow" cx="0.62" cy="0.4" r="0.7">
<stop offset="0" stop-color="{BLUE_DK}" stop-opacity="0.35"/><stop offset="1" stop-color="{BLUE_DK}" stop-opacity="0"/>
</radialGradient>
{grid}
</defs>
<rect width="{w}" height="{h}" fill="url(#bg)"/>
<rect width="{w}" height="{h}" fill="url(#glow)"/>
<rect width="{w}" height="{h}" fill="url(#g)"/>
{body}
{ticks}{top}{code_t}{bottom}
</svg>'''

def floor(w, y):
    hatch = ""
    for x in range(80, w - 40, 34):
        hatch += f'<path d="M{x} {y} l-16 16" stroke="{LINE}" stroke-width="1.4" opacity="0.7"/>'
    return f'<path d="M40 {y}H{w-40}" stroke="{STEEL_DK}" stroke-width="2.5"/>{hatch}'

def dim(x1, x2, y, txt):
    return (f'<path d="M{x1} {y}h{x2-x1}" stroke="{BLUE}" stroke-width="1.4" opacity="0.8"/>'
            f'<path d="M{x1} {y-6}v12M{x2} {y-6}v12" stroke="{BLUE}" stroke-width="1.4" opacity="0.8"/>'
            f'<text x="{(x1+x2)//2}" y="{y-10}" text-anchor="middle" fill="{BLUE}" font-family="Arial" '
            f'font-size="14" opacity="0.9">{txt}</text>')

# ---- schematics (drawn around a 1200x900 frame, floor at y=720) ----
S = dict(stroke=STEEL, sw=4, fill="none")
def P(d, color=STEEL, w=4, fill="none", extra=""):
    return f'<path d="{d}" fill="{fill}" stroke="{color}" stroke-width="{w}" stroke-linejoin="round" stroke-linecap="round" {extra}/>'
def R(x, y, ww, hh, color=STEEL, w=4, fill="none", rx=6):
    return f'<rect x="{x}" y="{y}" width="{ww}" height="{hh}" rx="{rx}" fill="{fill}" stroke="{color}" stroke-width="{w}"/>'
def C(cx, cy, r, color=STEEL, w=4, fill="none"):
    return f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{fill}" stroke="{color}" stroke-width="{w}"/>'

def sch_lathe(accent=BLUE):
    b = floor(1200, 720)
    b += R(250, 560, 700, 60, STEEL, 4)              # bed
    b += P("M330 620v90M870 620v90", STEEL, 5)        # legs
    b += R(250, 430, 150, 130, STEEL, 4)              # headstock
    b += C(400, 495, 46, accent, 5)                   # chuck
    b += C(400, 495, 16, accent, 4)
    b += R(820, 470, 110, 90, STEEL, 4)               # tailstock
    b += P("M820 515h-70", STEEL, 4)                  # quill
    b += R(440, 470, 300, 50, STEEL_DK, 4, "#20242c") # workpiece
    b += P("M560 520v40h70v-40", accent, 5)           # turret/tool
    b += dim(250, 950, 760, "Ø 540 × 1050 mm")
    return b
def sch_vmc(accent=BLUE):
    b = floor(1200, 720)
    b += R(720, 200, 150, 460, STEEL, 4)              # column
    b += R(430, 250, 300, 110, STEEL, 4)              # spindle head
    b += P("M560 360v70", accent, 6)                  # quill
    b += P("M540 430h40l-20 34z", accent, 5, "#20242c")# tool
    b += R(330, 560, 420, 60, STEEL, 4)               # table
    for x in range(380, 720, 60):
        b += P(f"M{x} 560v60", LINE, 2)               # t-slots
    b += R(360, 620, 360, 90, STEEL, 5)               # base
    b += dim(330, 750, 760, "850 × 500 mm")
    return b
def sch_hmc(accent=BLUE):
    b = floor(1200, 720)
    b += R(250, 200, 150, 460, STEEL, 4)              # column
    b += C(440, 410, 40, accent, 5)                   # horiz spindle
    b += P("M480 410h70", accent, 6)
    b += R(560, 380, 70, 60, accent, 5, "#20242c")    # tool
    b += R(640, 470, 240, 150, STEEL, 4)              # workpiece
    b += R(600, 620, 320, 50, STEEL, 5)               # pallet
    b += dim(600, 920, 760, "500 × 500 mm")
    return b
def sch_vtl(accent=BLUE):
    b = floor(1200, 720)
    b += R(300, 180, 90, 480, STEEL, 4)               # left column
    b += R(810, 180, 90, 480, STEEL, 4)               # right column
    b += R(300, 180, 600, 70, STEEL, 4)               # crossrail
    b += P("M600 250v150", accent, 6)                 # ram
    b += P("M580 400h40v40h-40z", accent, 5, "#20242c")# tool head
    b += f'<ellipse cx="600" cy="600" rx="240" ry="56" fill="none" stroke="{STEEL}" stroke-width="5"/>'
    b += f'<ellipse cx="600" cy="600" rx="150" ry="34" fill="none" stroke="{accent}" stroke-width="4"/>'
    b += R(470, 470, 260, 120, STEEL_DK, 4, "#20242c")# workpiece
    b += dim(360, 840, 760, "Ø 1600 mm")
    return b
def sch_grinder(accent=BLUE):
    b = floor(1200, 720)
    b += C(440, 420, 110, accent, 6)                  # wheel
    b += C(440, 420, 30, accent, 5)
    b += P("M440 310v-90M330 420h-80", STEEL, 4)      # mounts
    b += R(540, 560, 460, 50, STEEL, 4)               # table
    b += R(560, 500, 360, 60, STEEL_DK, 4, "#20242c") # workpiece
    b += C(560, 530, 14, STEEL, 4)                    # center
    b += R(900, 500, 80, 70, STEEL, 4)                # tailstock
    b += dim(540, 1000, 760, "500 mm")
    return b
def sch_gear(accent=BLUE):
    cx, cy, r = 470, 470, 150
    teeth = ""
    for i in range(20):
        a = i * math.pi / 10
        x1 = cx + math.cos(a) * r; y1 = cy + math.sin(a) * r
        x2 = cx + math.cos(a) * (r + 26); y2 = cy + math.sin(a) * (r + 26)
        teeth += f'<path d="M{x1:.0f} {y1:.0f}L{x2:.0f} {y2:.0f}" stroke="{STEEL}" stroke-width="6" stroke-linecap="round"/>'
    b = floor(1200, 720)
    b += C(cx, cy, r, STEEL, 5) + teeth
    b += C(cx, cy, 44, accent, 5)
    b += P(f"M{cx} {cy-r-26}v-120", STEEL, 4)         # grinding arm
    b += R(cx-70, cy-r-150, 140, 50, accent, 5, "#20242c")  # grinding head
    b += dim(cx-r, cx+r, 760, "Ø 800 mm · m16")
    return b

SCHEM = {"lathe": sch_lathe, "vmc": sch_vmc, "hmc": sch_hmc, "vtl": sch_vtl,
         "grinder": sch_grinder, "gear": sch_gear}

def write(path, content):
    full = os.path.join(PUB, path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, "w", encoding="utf-8") as fp:
        fp.write(content)
    print("wrote", path)

# Category banners (wider 1200x760)
CATS = [
    ("cnc-tornalar.svg", "lathe", "CNC TORNALAR", "CNC-T"),
    ("dik-isleme.svg", "vmc", "DİK İŞLEME MERKEZLERİ", "VMC"),
    ("yatay-isleme.svg", "hmc", "YATAY İŞLEME MERKEZLERİ", "HMC"),
    ("dik-torna.svg", "vtl", "DİK TORNALAR", "VTL"),
    ("taslama.svg", "grinder", "TAŞLAMA TEZGAHLARI", "GR"),
    ("disli-taslama.svg", "gear", "DİŞLİ PROFİL TAŞLAMA", "GP"),
]
for fn, kind, label, code in CATS:
    body = SCHEM[kind](BLUE)
    write(f"categories/{fn}", frame(1200, 760, body, label_bottom=label, code=code))

# Machine images + variants
MACH = [
    ("cnc-torna", "lathe", "BT-L250"), ("cnc-torna-2", "lathe", "BT-L400M"), ("cnc-torna-3", "lathe", "BT-L SERIES"),
    ("vmc", "vmc", "BT-VMC850"), ("vmc-2", "vmc", "BT-VMC1370"), ("vmc-3", "vmc", "BT-VMC"),
    ("hmc", "hmc", "BT-HMC500"), ("hmc-2", "hmc", "BT-HMC"),
    ("vtl", "vtl", "BT-VL1600"), ("vtl-2", "vtl", "BT-VL"),
    ("grinder", "grinder", "BT-CG500"), ("grinder-2", "grinder", "BT-SG60"), ("grinder-3", "grinder", "BT-G SERIES"),
    ("gear", "gear", "BT-GP800"), ("gear-2", "gear", "BT-GP"),
]
for i, (fn, kind, code) in enumerate(MACH):
    accent = BLUE if i % 2 == 0 else "#5a86d0"
    body = SCHEM[kind](accent)
    write(f"machines/{fn}.svg", frame(1200, 900, body, code=code))

# Hero (wide)
hero_body = sch_vmc(BLUE)
# nudge hero: add extra ambient ticks
write("hero/hero.svg", frame(1600, 1000, sch_vmc(BLUE), label_bottom="", code="BT-VMC850"))
print("ALL DONE")
