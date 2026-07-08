import { NextResponse } from "next/server";

// Booking endpoint. Currently logs the request server-side and returns success.
// To actually deliver bookings, wire one of these in the marked spot below:
//   - Email:   Resend / Nodemailer / Postmark
//   - Webhook: Slack / Discord incoming webhook
//   - Store:   a DB row, Airtable, Google Sheet, etc.
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, date, topic } = body ?? {};

    if (!name || !email || !date || !topic) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields." },
        { status: 400 }
      );
    }

    // --- WIRE DELIVERY HERE -------------------------------------------------
    // Example (Slack webhook):
    //   await fetch(process.env.SLACK_WEBHOOK_URL, {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ text: `New Tech Temple booking from ${name} <${email}> on ${date}: ${topic}` }),
    //   });
    // ------------------------------------------------------------------------

    console.log("[tech-temple] booking request:", {
      name,
      email,
      date,
      topic,
      at: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request." },
      { status: 400 }
    );
  }
}
