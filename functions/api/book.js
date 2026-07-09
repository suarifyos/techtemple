// Cloudflare Pages Function — POST /api/book
// Replaces the Next.js route handler (which can't be statically exported).
// Validates the booking form and forwards it to the webhook.

const DEFAULT_WEBHOOK = "https://kau.lol/webhook/tech-temple-bookimg";
const RATE = "$250 / hour"; // keep in sync with lib/site.js

export async function onRequestPost(context) {
  const { request, env } = context;
  const webhookUrl = env.BOOKING_WEBHOOK_URL || DEFAULT_WEBHOOK;

  try {
    const body = await request.json();
    const { name, email, date, topic, phone_number } = body ?? {};

    if (!name || !email || !date || !topic) {
      return json({ ok: false, error: "Missing required fields." }, 400);
    }

    const payload = {
      source: "tech-temple-landing",
      submittedAt: new Date().toISOString(),
      name,
      email,
      phone_number: phone_number || null,
      date,
      topic,
      rate: RATE,
    };

    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.error("[tech-temple] webhook failed:", res.status);
      return json({ ok: false, error: "Could not deliver booking." }, 502);
    }

    return json({ ok: true });
  } catch (err) {
    console.error("[tech-temple] booking error:", err);
    return json({ ok: false, error: "Invalid request." }, 400);
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
