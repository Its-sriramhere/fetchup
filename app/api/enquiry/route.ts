import { NextRequest, NextResponse } from "next/server";
import { enquirySchema, enquiryErrors } from "@/lib/enquiry-schema";
import { DeliveryError, sendEnquiry } from "@/lib/email";
import { limitEnquiry } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  const allowed = process.env.SITE_URL ? new URL(process.env.SITE_URL).origin : request.nextUrl.origin;
  if (origin && origin !== allowed) return NextResponse.json({ error: "Please submit your enquiry from the FetchUp website." }, { status: 403 });
  if (!request.headers.get("content-type")?.includes("application/json")) return NextResponse.json({ error: "Please send a JSON enquiry." }, { status: 415 });
  const length = Number(request.headers.get("content-length") || 0);
  if (length > 20000) return NextResponse.json({ error: "Your enquiry is too long." }, { status: 413 });
  let raw: unknown;
  try {
    // Bound the actual body too, including chunked requests without Content-Length.
    const reader = request.body?.getReader();
    if (!reader) throw new Error("Empty request");
    const chunks: Uint8Array[] = [];
    let total = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > 20000) { await reader.cancel(); return NextResponse.json({ error: "Your enquiry is too long." }, { status: 413 }); }
      chunks.push(value);
    }
    raw = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch { return NextResponse.json({ error: "Your enquiry couldn’t be read. Please try again." }, { status: 400 }); }
  const parsed = enquirySchema.safeParse(raw);
  if (!parsed.success) return NextResponse.json({ error: "Please check the highlighted fields.", errors: enquiryErrors(parsed.error) }, { status: 400 });
  if (parsed.data.website) return NextResponse.json({ error: "Your enquiry couldn’t be accepted." }, { status: 400 });
  const key = request.headers.get("idempotency-key") || crypto.randomUUID();
  if (!/^[a-zA-Z0-9-]{10,100}$/.test(key)) return NextResponse.json({ error: "Please refresh the page and try again." }, { status: 400 });
  if (!process.env.RESEND_API_KEY || !process.env.ENQUIRY_TO_EMAIL || !process.env.ENQUIRY_FROM_EMAIL) return NextResponse.json({ error: "Enquiry delivery is being set up. Your details haven’t been sent; please try again later." }, { status: 503 });
  try {
    const ip = request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
    if (!await limitEnquiry(ip)) return NextResponse.json({ error: "You’ve sent several enquiries. Please wait a few minutes before trying again." }, { status: 429, headers: { "Retry-After": "600" } });
    await sendEnquiry(parsed.data, key);
    return NextResponse.json({ accepted: true }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof DeliveryError ? error.message : "Enquiry delivery is temporarily unavailable. Your details are still here; please try again later." }, { status: 503 });
  }
}
