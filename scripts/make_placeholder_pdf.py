# -*- coding: utf-8 -*-
"""Create minimal but valid placeholder PDFs (so catalog links resolve until the
real catalogs are added). Correct xref offsets are computed for validity."""
import os

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))


def build_pdf(title: str) -> bytes:
    text = f"BORSAN TEKNOLOJI - {title} (placeholder - katalog yakinda eklenecek)"
    objs = [
        b"<< /Type /Catalog /Pages 2 0 R >>",
        b"<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
        b"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] "
        b"/Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>",
        b"<< /Length %d >>\nstream\nBT /F1 16 Tf 60 760 Td (%s) Tj ET\nendstream"
        % (len(text) + 30, text.encode("latin-1", "replace")),
        b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    ]
    out = b"%PDF-1.4\n"
    offsets = []
    for i, body in enumerate(objs, start=1):
        offsets.append(len(out))
        out += b"%d 0 obj\n" % i + body + b"\nendobj\n"
    xref_pos = len(out)
    out += b"xref\n0 %d\n" % (len(objs) + 1)
    out += b"0000000000 65535 f \n"
    for off in offsets:
        out += b"%010d 00000 n \n" % off
    out += b"trailer\n<< /Size %d /Root 1 0 R >>\n" % (len(objs) + 1)
    out += b"startxref\n%d\n%%%%EOF" % xref_pos
    return out


targets = {
    "public/catalogs/swiss-type/bt-sw20.pdf": "BT-SW20 CNC Kayar Otomat",
    "public/catalogs/swiss-type/bt-sw32.pdf": "BT-SW32 CNC Kayar Otomat",
}
for rel, title in targets.items():
    full = os.path.join(ROOT, rel)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, "wb") as f:
        f.write(build_pdf(title))
    print("wrote", rel, os.path.getsize(full), "bytes")
print("DONE")
