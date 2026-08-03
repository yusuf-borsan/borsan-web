import re, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.lib.units import mm

pdfmetrics.registerFont(TTFont("Arial", "C:/Windows/Fonts/arial.ttf"))
pdfmetrics.registerFont(TTFont("ArialB", "C:/Windows/Fonts/arialbd.ttf"))

with open('C:/Users/Yusuf/Desktop/borsan-web/src/lib/products.ts', 'r', encoding='utf-8') as f:
    c = f.read()

idx = c.find('slug: "falco-ck61180"')
block = c[idx:idx+6000]

hl = re.search(r'highlights:\s*\[(.*?)\]', block, re.DOTALL)
hls = re.findall(r'\{\s*tr:\s*"([^"]*)"', hl.group(1)) if hl else []
IW = 595.28 - 2*14*mm
iw = IW * 0.53
rw = IW - iw - 6*mm
hl_w = rw - 5*mm
print(f"Highlights: {len(hls)}, max_w={hl_w:.0f}pt ({hl_w/mm:.0f}mm)")
for i, h in enumerate(hls):
    w = stringWidth(h, "Arial", 7)
    lines = max(1, -(-int(w) // int(hl_w)))
    print(f"  [{i}] {lines}L {w:.0f}pt: {h[:80]}")

si = block.find('specs: [')
depth, j = 1, si + 8
while j < len(block) and depth > 0:
    if block[j] == '[': depth += 1
    elif block[j] == ']': depth -= 1
    j += 1
specs = []
for sm in re.finditer(r'label:\s*\{\s*tr:\s*"([^"]*)"[^}]*\}[^}]*value:\s*\{\s*tr:\s*"([^"]*)"', block[si:j]):
    specs.append((sm.group(1), sm.group(2)))

cw = (IW - 4*mm) / 2
lw = cw * 0.48
vw = cw - lw - 1*mm
print(f"\nSpecs: {len(specs)}, rows={-(-len(specs)//2)}")
print(f"Col: lw={lw/mm:.1f}mm vw={vw/mm:.1f}mm")
over = 0
for i, (lb, vl) in enumerate(specs):
    vlw = stringWidth(vl, "ArialB", 6)
    lbw = stringWidth(lb, "Arial", 6)
    vl_max = vw - 2*mm
    lb_max = lw - 3*mm
    if vlw > vl_max or lbw > lb_max:
        over += 1
        print(f"  [{i}] L={lbw:.0f}/{lb_max:.0f} V={vlw:.0f}/{vl_max:.0f}: {lb[:35]} = {vl[:45]}")
print(f"Overflows at 6pt: {over}")
