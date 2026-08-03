"""
Borsan Teknoloji — Datasheet PDF Generator (v11 — OVERFLOW-SAFE)

Her bölüm öncekinin GERÇEK bitiş Y'sinden başlar.
wrap_text() ile tüm metinler güvenli sarılır.
Hiçbir metin üst üste binmez. Hiçbir veri taşmaz.
"""

import os, re, sys, io
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor, white
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import stringWidth

pdfmetrics.registerFont(TTFont("Arial", "C:/Windows/Fonts/arial.ttf"))
pdfmetrics.registerFont(TTFont("ArialB", "C:/Windows/Fonts/arialbd.ttf"))

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUBLIC = os.path.join(BASE, "public")
LOGO = os.path.join(PUBLIC, "branding", "borsan-logo-pdf.png")
PRODUCTS_TS = os.path.join(BASE, "src", "lib", "products.ts")

BLUE = HexColor("#1F4488"); BLUE_D = HexColor("#152E5C")
DARK = HexColor("#1a1a1a"); GRAY = HexColor("#6B7280"); GRAY_L = HexColor("#9CA3AF")
ROW_BG = HexColor("#F0F3F7"); LINE_C = HexColor("#CCCCCC")
W, H = A4; SIDE = 14*mm; IW = W - 2*SIDE
SKIP = {"cnc-aksesuarlari"}


def phi(s): return s.replace("Φ", "Ø").replace("φ", "Ø")


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


def fit1(c, text, font, maxsz, minsz, maxw, x, y):
    for s in range(int(maxsz*10), int(minsz*10)-1, -1):
        fs = s/10.0
        if stringWidth(text, font, fs) <= maxw:
            c.setFont(font, fs); c.drawString(x, y, text); return fs
    c.setFont(font, minsz); c.drawString(x, y, text); return minsz


def split_title(name, model):
    """Split product name into (brand+model, machine_type) using the model field.
    Tries the model string and common normalizations to find exactly where the
    model ends in the name, then splits there."""
    candidates = [model]
    if "-" in model:
        last = model.rsplit("-", 1)
        candidates.append(last[0] + " " + last[1])   # last hyphen → space (FL-1600-ATC → FL-1600 ATC)
        candidates.append(model.replace("-", " "))     # all hyphens → spaces
        candidates.append(last[0])                     # up to last hyphen (fallback)
    for cand in candidates:
        idx = name.find(cand)
        if idx >= 0:
            end = idx + len(cand)
            t1 = name[:end].strip()
            t2 = name[end:].strip()
            if t1 and t2:
                return (t1, t2)
    # Last resort: first 2 words = brand+model, rest = type
    words = name.split()
    return (" ".join(words[:2]), " ".join(words[2:])) if len(words) > 2 else (name, "")


def parse_products():
    with open(PRODUCTS_TS, "r", encoding="utf-8") as f:
        content = f.read()
    products = []
    slugs = [(m.start(), m.group(1)) for m in re.finditer(r'slug:\s*"([^"]+)"', content)]
    for si, (pos, slug) in enumerate(slugs):
        end = slugs[si+1][0] if si+1 < len(slugs) else pos+6000
        blk = content[pos:end]
        cat_m = re.search(r'categorySlug:\s*"([^"]+)"', blk)
        if not cat_m or cat_m.group(1) in SKIP: continue
        mod_m = re.search(r'model:\s*"([^"]+)"', blk)
        nm_m = re.search(r'name:\s*\{[^}]*tr:\s*"([^"]+)"', blk)
        sm_m = re.search(r'summary:\s*\{[^}]*tr:\s*"([^"]+)"', blk)
        img_m = re.search(r'image:\s*"([^"]+)"', blk)
        if not mod_m or not nm_m: continue
        hl_b = re.search(r'highlights:\s*\[(.*?)\]', blk, re.DOTALL)
        hls = re.findall(r'\{\s*tr:\s*"([^"]*)"', hl_b.group(1))[:6] if hl_b else []
        specs = []
        si2 = blk.find('specs: [')
        if si2 >= 0:
            d, j = 1, si2+8
            while j < len(blk) and d > 0:
                if blk[j] == '[': d += 1
                elif blk[j] == ']': d -= 1
                j += 1
            for sm in re.finditer(r'label:\s*\{\s*tr:\s*"([^"]*)"[^}]*\}[^}]*value:\s*\{\s*tr:\s*"([^"]*)"', blk[si2:j]):
                specs.append((phi(sm.group(1)), phi(sm.group(2))))
        name = nm_m.group(1)
        parts = split_title(name, mod_m.group(1))
        mid = (len(specs)+1)//2
        products.append({"slug":slug,"title1":parts[0],"title2":parts[1],
            "image":os.path.join(PUBLIC,(img_m.group(1) if img_m else "").lstrip("/")),
            "summary":phi(sm_m.group(1)) if sm_m else "",
            "highlights":[phi(h) for h in hls],
            "specs_left":specs[:mid],"specs_right":specs[mid:]})
    return products


def generate_pdf(p):
    out = os.path.join(PUBLIC, "datasheets", f"{p['slug']}.pdf")
    os.makedirs(os.path.dirname(out), exist_ok=True)
    c = canvas.Canvas(out, pagesize=A4)
    c.setTitle(f"{p['title1']} {p['title2']} Datasheet")

    FOOTER_H = 26*mm  # reserved for footer
    PAGE_BOTTOM = FOOTER_H

    y = H - 12*mm  # page top cursor

    # ──────── LOGO + TITLE ────────
    logo_w = 90*mm; logo_h = logo_w / 2.94
    if os.path.exists(LOGO):
        try:
            c.drawImage(ImageReader(LOGO), SIDE, y - logo_h,
                        width=logo_w, height=logo_h,
                        preserveAspectRatio=False, mask="auto")
        except: pass

    tx = SIDE + logo_w + 4*mm
    tmaxw = W - SIDE - tx
    c.setFillColor(BLUE)
    fit1(c, p["title1"], "ArialB", 32, 16, tmaxw, tx, y - 15*mm)
    fit1(c, p["title2"], "ArialB", 17, 10, tmaxw, tx, y - 24*mm)

    y -= logo_h + 6*mm
    c.setStrokeColor(LINE_C); c.setLineWidth(0.5)
    c.line(SIDE, y, W-SIDE, y)
    y -= 5*mm

    # ──────── HERO: image left + highlights right ────────
    hero_top = y
    iw = IW * 0.50  # image width
    ih = iw / 1.79
    img = p.get("image","")
    if img and os.path.exists(img):
        try:
            from PIL import Image as PI
            pi = PI.open(img); ih = iw/(pi.size[0]/pi.size[1]); pi.close()
        except: pass
        try:
            c.drawImage(ImageReader(img), SIDE, hero_top - ih,
                        width=iw, height=ih, preserveAspectRatio=False, mask="auto")
        except: pass

    image_bottom = hero_top - ih

    # Highlights — right column
    rx = SIDE + iw + 5*mm
    rw = IW - iw - 5*mm
    hl_w = rw - 4*mm
    hy = hero_top - 6*mm

    c.setFillColor(BLUE); c.setFont("ArialB", 9.5)
    c.drawString(rx, hy, "ÖNE ÇIKAN ÖZELLİKLER")
    hy -= 3*mm
    c.setStrokeColor(BLUE); c.setLineWidth(0.8)
    c.line(rx, hy, rx + min(38*mm, rw-2*mm), hy)
    hy -= 4.5*mm

    HL_FONT = 6.5
    HL_LINE = 2.8*mm
    hl_x = rx + 3*mm
    for h in p["highlights"]:
        lines = wrap(h, "Arial", HL_FONT, hl_w)
        c.setFillColor(BLUE)
        c.rect(rx, hy + 0.3*mm, 1*mm, 1*mm, fill=1, stroke=0)
        c.setFillColor(DARK); c.setFont("Arial", HL_FONT)
        for li, ln in enumerate(lines):
            c.drawString(hl_x, hy - li*HL_LINE, ln)
        hy -= len(lines)*HL_LINE + 2*mm

    highlights_bottom = hy

    # Summary — below image
    sy = image_bottom - 6*mm
    c.setFillColor(GRAY); c.setFont("Arial", 7.5)
    for ln in wrap(p["summary"], "Arial", 7.5, IW)[:3]:
        c.drawString(SIDE, sy, ln); sy -= 3.5*mm
    summary_bottom = sy

    # Next section starts after BOTH columns are done
    y = min(summary_bottom, highlights_bottom) - 6*mm

    # ──────── TEKNİK ÖZELLİKLER ────────
    c.setFillColor(BLUE); c.setFont("ArialB", 10.5)
    c.drawString(SIDE, y, "TEKNİK ÖZELLİKLER")
    y -= 2.5*mm
    c.setStrokeColor(BLUE); c.setLineWidth(1)
    c.line(SIDE, y, W-SIDE, y)
    y -= 1*mm

    gap = 3.5*mm
    cw = (IW - gap) / 2
    # Wider value column to handle long values
    lw = cw * 0.42
    vw = cw - lw

    # Determine table font size based on available space
    sl = p["specs_left"]; sr = p["specs_right"]
    mr = max(len(sl), len(sr))
    avail = y - PAGE_BOTTOM - 8*mm  # space for headers + rows

    # Try font sizes until table fits
    for TF in [6, 5.5, 5, 4.5]:
        TLH = TF * 1.4  # baseline-to-baseline distance (pt)
        # Measure all rows
        total_h = 6*mm  # column header bar
        for i in range(mr):
            max_lines = 1
            for specs in [sl, sr]:
                if i < len(specs):
                    lb, vl = specs[i]
                    nl = max(len(wrap(lb, "Arial", TF, lw-2*mm)),
                             len(wrap(vl, "ArialB", TF, vw-2*mm)))
                    if nl > max_lines: max_lines = nl
            total_h += max_lines * TLH + 2*mm
        if total_h <= avail:
            break

    # Column headers
    y -= 4.5*mm
    bh = 4.5*mm
    c.setFillColor(BLUE)
    c.rect(SIDE, y-0.5*mm, cw, bh, fill=1, stroke=0)
    c.rect(SIDE+cw+gap, y-0.5*mm, cw, bh, fill=1, stroke=0)
    c.setFillColor(white); c.setFont("ArialB", min(TF+0.5, 6.5))
    c.drawString(SIDE+2*mm, y+0.5*mm, "GENEL ÖZELLİKLER")
    c.drawString(SIDE+cw+gap+2*mm, y+0.5*mm, "HAREKET VE DONANIM")
    y -= bh + 0.5*mm

    # Draw rows
    for i in range(mr):
        # Measure this row
        max_lines = 1
        row_cells = []
        for specs, xb in [(sl, SIDE), (sr, SIDE+cw+gap)]:
            if i < len(specs):
                lb, vl = specs[i]
                lb_l = wrap(lb, "Arial", TF, lw-2*mm)
                vl_l = wrap(vl, "ArialB", TF, vw-2*mm)
                nl = max(len(lb_l), len(vl_l))
                if nl > max_lines: max_lines = nl
                row_cells.append((lb_l, vl_l, xb))
            else:
                row_cells.append(None)

        rh = max_lines * TLH + 2*mm

        if y - rh < PAGE_BOTTOM:
            break  # stop, don't overflow

        # Background
        if i % 2 == 0:
            c.setFillColor(ROW_BG)
            c.rect(SIDE, y-rh, cw, rh, fill=1, stroke=0)
            c.rect(SIDE+cw+gap, y-rh, cw, rh, fill=1, stroke=0)

        # Border
        c.setStrokeColor(HexColor("#E5E7EB")); c.setLineWidth(0.15)
        c.line(SIDE, y-rh, SIDE+cw, y-rh)
        c.line(SIDE+cw+gap, y-rh, W-SIDE, y-rh)

        # Text — top-aligned within cell
        ty = y - 2.5*mm  # first line baseline

        for cell in row_cells:
            if not cell: continue
            lb_l, vl_l, xb = cell
            c.setFillColor(DARK)
            for li, ln in enumerate(lb_l):
                c.setFont("Arial", TF)
                c.drawString(xb + 1.5*mm, ty - li*TLH, ln)
            for li, ln in enumerate(vl_l):
                c.setFont("ArialB", TF)
                c.drawString(xb + lw + 0.5*mm, ty - li*TLH, ln)

        y -= rh

    # ──────── FOOTER (pinned to bottom) ────────
    fy = 12*mm
    c.setStrokeColor(LINE_C); c.setLineWidth(0.3)
    c.line(SIDE, fy+2*mm, W-SIDE, fy+2*mm)
    c.setFillColor(DARK); c.setFont("ArialB", 7)
    c.drawString(SIDE, fy-2*mm, "BORSAN TEKNOLOJİ VE MAKİNA TİCARETİ A.Ş.")
    c.setFillColor(GRAY); c.setFont("Arial", 5.5)
    c.drawString(SIDE, fy-5*mm,
        "Topçular Mah. Maltepe Cd. No: 4/1 D 18 Eyüpsultan - İstanbul  |  info@borsanteknoloji.com  |  www.borsanteknoloji.com")
    c.setFillColor(GRAY_L); c.setFont("Arial", 5)
    c.drawString(SIDE, fy-8*mm,
        "Teknik özellikler üretici katalog verilerine göre hazırlanmıştır. Haber verilmeksizin değiştirilebilir.")

    c.save()
    return out


def add_catalog_links(products):
    with open(PRODUCTS_TS, "r", encoding="utf-8") as f:
        content = f.read()
    changed = False
    for p in products:
        s = p["slug"]; cp = f"/datasheets/{s}.pdf"
        idx = content.find(f'slug: "{s}"')
        if idx == -1: continue
        be = content.find("name:", idx)
        if be == -1: continue
        if "catalog:" in content[idx:be]: continue
        cl = content.find("categorySlug:", idx)
        if cl == -1: continue
        eol = content.find(",\n", cl)
        if eol == -1: continue
        ip = eol + 2
        content = content[:ip] + f'        catalog: "{cp}",\n' + content[ip:]
        changed = True
    if changed:
        with open(PRODUCTS_TS, "w", encoding="utf-8") as f: f.write(content)
    return changed


if __name__ == "__main__":
    products = parse_products()
    print(f"Found {len(products)} machine products")
    ok, err = 0, 0
    for p in products:
        try:
            generate_pdf(p); ok += 1
            print(f"  OK: {p['slug']}")
        except Exception as e:
            err += 1; print(f"  ERR: {p['slug']} -> {e}")
    print(f"\nGenerated: {ok}, Errors: {err}")
    add_catalog_links(products)
    print("Done.")
