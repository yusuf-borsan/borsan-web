import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const FIELD_LABELS: Record<string, string> = {
  name: "Ad Soyad",
  company: "Firma",
  email: "E-posta",
  country_code: "Ülke Kodu",
  phone: "Telefon",
  product: "İlgilenilen Ürün",
  topic: "Konu",
  topic_other: "Konu Açıklaması",
  product_category: "Makine Kategorisi",
  product_model: "İlgilenilen Ürün",
  selected_options: "Seçili Opsiyonlar",
  message: "Mesaj",
  request_type: "Talep Türü",
  country: "Ülke",
  machine_type: "Makine Tipi",
  project_scope: "Hibe/Proje Kapsamı",
};

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const body: Record<string, string> = await req.json();

    if (body._honey) {
      return NextResponse.json({ ok: true });
    }

    const name = body.name?.trim() ?? "";
    const email = body.email?.trim() ?? "";

    if (!name || !email) {
      return NextResponse.json({ error: "missing_fields" }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "invalid_email" }, { status: 400 });
    }

    const rows = Object.entries(body)
      .filter(([k, v]) => k !== "_honey" && v)
      .map(
        ([k, v]) => `<tr>
          <td style="padding:6px 12px;background:#f5f7fa;font-weight:600;white-space:nowrap;border-bottom:1px solid #e8eaf0">${esc(FIELD_LABELS[k] ?? k)}</td>
          <td style="padding:6px 12px;border-bottom:1px solid #e8eaf0">${esc(v)}</td>
        </tr>`,
      )
      .join("");

    const html = `<!DOCTYPE html>
<html lang="tr">
<head><meta charset="utf-8"><title>Borsan Form</title></head>
<body style="font-family:Arial,sans-serif;color:#1a202c;background:#ffffff;margin:0;padding:32px">
  <table style="max-width:600px;width:100%;margin:0 auto">
    <tr>
      <td style="padding-bottom:24px">
        <h2 style="margin:0;color:#1F4488;font-size:20px">Borsan Teknoloji</h2>
        <p style="margin:4px 0 0;color:#6b7280;font-size:14px">Yeni form başvurusu</p>
      </td>
    </tr>
    <tr>
      <td>
        <table style="width:100%;border-collapse:collapse;border:1px solid #e8eaf0;font-size:14px">
          ${rows}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    const to = (process.env.CONTACT_MAIL_TO ?? "info@borsanteknoloji.com,yusuf@borsanteknoloji.com")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const from = process.env.CONTACT_MAIL_FROM ?? "Borsan Teknoloji <form@borsanteknoloji.com>";

    await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `Yeni başvuru — ${esc(name)}`,
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] form submission error:", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
