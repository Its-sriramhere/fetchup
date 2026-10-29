import type { Enquiry } from "./enquiry-schema";

export class DeliveryError extends Error {}

export async function sendEnquiry(enquiry: Enquiry, idempotencyKey: string) {
  if (!process.env.RESEND_API_KEY || !process.env.ENQUIRY_TO_EMAIL || !process.env.ENQUIRY_FROM_EMAIL) {
    throw new DeliveryError("Enquiry delivery is being set up. Your details haven’t been sent; please try again later.");
  }
  // Plain text avoids HTML injection; user input never becomes a mail header.
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json", "Idempotency-Key": `fetchup-${idempotencyKey}` },
    body: JSON.stringify({
      from: process.env.ENQUIRY_FROM_EMAIL,
      to: [process.env.ENQUIRY_TO_EMAIL],
      reply_to: enquiry.email,
      subject: "New FetchUp project enquiry",
      text: [`Name: ${enquiry.name}`, `Email: ${enquiry.email}`, `Company: ${enquiry.company || "Not supplied"}`, `Interest: ${enquiry.service || "General enquiry"}`, "", "Project:", enquiry.message].join("\n"),
    }),
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new DeliveryError("We couldn’t deliver your enquiry just now. Your details are still here; please try again.");
  const result = await response.json();
  if (!result.id) throw new DeliveryError("Delivery couldn’t be confirmed. Please try again.");
  return result.id as string;
}
