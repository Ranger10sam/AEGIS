/** HTML email rendering. Light, email-safe inline styles (matches the light theme). */

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export interface EmailContent {
  heading: string;
  intro: string;
  lines?: string[];
  ctaText: string;
  ctaHref: string;
}

export function renderEmail({
  heading,
  intro,
  lines = [],
  ctaText,
  ctaHref,
}: EmailContent): string {
  const items = lines
    .map(
      (l) =>
        `<p style="margin:0 0 8px;color:#555560;font-size:14px;line-height:1.5;">${esc(l)}</p>`,
    )
    .join("");
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;background:#fafaf8;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
  <div style="max-width:480px;margin:0 auto;padding:32px 24px;">
    <div style="font-family:Georgia,'Times New Roman',serif;font-size:22px;color:#1a1a1a;margin-bottom:24px;">Aegis</div>
    <h1 style="font-size:20px;color:#1a1a1a;margin:0 0 12px;font-weight:600;">${esc(heading)}</h1>
    <p style="margin:0 0 16px;color:#555560;font-size:15px;line-height:1.6;">${esc(intro)}</p>
    ${items}
    <a href="${ctaHref}" style="display:inline-block;margin-top:16px;background:#a6802e;color:#fafaf8;text-decoration:none;padding:11px 18px;border-radius:8px;font-size:14px;font-weight:600;">${esc(ctaText)}</a>
    <p style="margin-top:28px;color:#8a8a92;font-size:12px;line-height:1.5;">You're getting this because email nudges are on in Aegis.</p>
  </div>
</body></html>`;
}
