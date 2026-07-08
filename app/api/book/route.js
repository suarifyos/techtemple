import { NextResponse } from "next/server";
import { site } from "@/lib/site";

// Where bookings are delivered. Override with BOOKING_WEBHOOK_URL if needed.
const WEBHOOK_URL =
  process.env.BOOKING_WEBHOOK_URL || "https://kau.lol/webhook/tech-temple-bookimg";

// Booking endpoint: validates the form and forwards it to the webhook.
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, date, topic, phone_number } = body ?? {};

    if (!name || !email || !date || !topic) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields." },
        { status: 400 }
      );
    }

    // Payload sent to the webhook.
    const payload = {
      source: "tech-temple-landing",
      submittedAt: new Date().toISOString(),
      name,
      email,
      phone_number: phone_number || null, // optional
      date, // preferred session date (YYYY-MM-DD)
      topic, // "what haunts you" free text
      rate: `${site.rate.amount} ${site.rate.unit}`.trim(),
    };

    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.error("[tech-temple] webhook failed:", res.status);
      return NextResponse.json(
        { ok: false, error: "Could not deliver booking." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[tech-temple] booking error:", err);
    return NextResponse.json(
      { ok: false, error: "Invalid request." },
      { status: 400 }
    );
  }
}
