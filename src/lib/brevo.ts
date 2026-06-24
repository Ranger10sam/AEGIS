import "server-only";

export function isEmailConfigured(): boolean {
  return Boolean(process.env.BREVO_API_KEY && process.env.BREVO_SENDER_EMAIL);
}

export interface SendEmailArgs {
  to: string;
  subject: string;
  html: string;
}

/** Send a transactional email via Brevo (CLAUDE.md §2 — free tier, 300/day). */
export async function sendEmail({
  to,
  subject,
  html,
}: SendEmailArgs): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY;
  const sender = process.env.BREVO_SENDER_EMAIL;
  if (!apiKey || !sender) {
    throw new Error(
      "Brevo is not configured (BREVO_API_KEY / BREVO_SENDER_EMAIL).",
    );
  }

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      sender: { email: sender, name: "Aegis" },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Brevo send failed: ${res.status} ${detail}`);
  }
}
