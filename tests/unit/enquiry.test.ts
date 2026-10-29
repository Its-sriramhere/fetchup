import { beforeEach, describe, expect, it, vi } from "vitest";
import { enquirySchema } from "@/lib/enquiry-schema";
import { DeliveryError, sendEnquiry } from "@/lib/email";

const valid = { name: "Alex Taylor", email: "alex@example.com", company: "", message: "We would like to build a new booking experience.", service: "Web development", website: "" };

describe("enquiry validation", () => {
  it("accepts a useful enquiry and trims input", () => {
    expect(enquirySchema.parse({ ...valid, name: "  Alex Taylor  " }).name).toBe("Alex Taylor");
  });
  it.each([{ email: "broken" }, { name: "" }, { message: "Short" }, { message: "x".repeat(5001) }, { email: "a@example.com\r\nBcc:bad@example.com" }])("rejects invalid input %j", change => {
    expect(enquirySchema.safeParse({ ...valid, ...change }).success).toBe(false);
  });
});

describe("delivery acceptance", () => {
  beforeEach(() => {
    vi.stubEnv("RESEND_API_KEY", "test-key");
    vi.stubEnv("ENQUIRY_TO_EMAIL", "inbox@example.com");
    vi.stubEnv("ENQUIRY_FROM_EMAIL", "website@example.com");
  });
  it("fails honestly when delivery is not configured", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    await expect(sendEnquiry(valid, "test-id-123")).rejects.toBeInstanceOf(DeliveryError);
  });
  it("does not turn provider errors into success", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("{}", { status: 503 })));
    await expect(sendEnquiry(valid, "test-id-123")).rejects.toBeInstanceOf(DeliveryError);
  });
  it("requires a provider delivery identifier and sends plain text", async () => {
    const fetcher = vi.fn().mockResolvedValue(Response.json({ id: "accepted-123" }));
    vi.stubGlobal("fetch", fetcher);
    await expect(sendEnquiry({ ...valid, message: "<script>alert('test')</script>" }, "test-id-123")).resolves.toBe("accepted-123");
    const payload = JSON.parse(fetcher.mock.calls[0][1].body);
    expect(payload.html).toBeUndefined();
    expect(payload.text).toContain("<script>");
    expect(payload.to).toEqual(["inbox@example.com"]);
  });
});
