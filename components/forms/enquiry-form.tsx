"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { concepts, services } from "@/data/content";
import { enquirySchema, enquiryErrors, type FieldErrors } from "@/lib/enquiry-schema";
import { Button } from "@/components/ui/button";

export function EnquiryForm() {
  const search = useSearchParams();
  const selected = services.find(item => item.id === search.get("service")) || concepts.find(item => item.id === search.get("concept"));
  const [errors, setErrors] = useState<FieldErrors>({});
  const [failure, setFailure] = useState("");
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState(false);
  const form = useRef<HTMLFormElement>(null);
  const confirmation = useRef<HTMLDivElement>(null);
  const idempotency = useRef("");
  useEffect(() => { idempotency.current = crypto.randomUUID(); }, []);
  useEffect(() => { if (success) confirmation.current?.focus(); }, [success]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const result = enquirySchema.safeParse(data);
    setFailure("");
    if (!result.success) {
      const next = enquiryErrors(result.error);
      setErrors(next);
      const first = Object.keys(next)[0];
      form.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setErrors({}); setPending(true);
    try {
      const response = await fetch("/api/enquiry", {
        method: "POST", headers: { "Content-Type": "application/json", "Idempotency-Key": idempotency.current }, body: JSON.stringify(result.data),
      });
      const body = await response.json();
      if (!response.ok || !body.accepted) {
        if (body.errors) setErrors(body.errors);
        throw new Error(body.error || "Your enquiry couldn’t be sent. Please try again.");
      }
      setSuccess(true);
    } catch (error) {
      setFailure(error instanceof Error ? error.message : "We couldn’t connect. Your details are still here; please try again.");
    } finally { setPending(false); }
  }

  if (success) return <div ref={confirmation} className="enquiry-form form-success" id="enquiry" tabIndex={-1} role="status">
    <span className="success-mark" aria-hidden="true">✓</span><h3>Thanks for getting in touch.</h3><p>Your enquiry is on its way. We’ll review your project and get back to you about the next step.</p><Button href="/" variant="outline">Back to home</Button>
  </div>;

  return <form className="enquiry-form" id="enquiry" ref={form} onSubmit={submit} onChange={() => { idempotency.current = crypto.randomUUID(); }} noValidate aria-busy={pending}>
    <h3>About you and your project</h3>
    {selected && <p className="selection-note">Let’s talk about: <strong>{selected.title}</strong></p>}
    <input type="hidden" name="service" value={selected?.title || ""} />
    <div className="honeypot" aria-hidden="true"><label htmlFor="website">Website</label><input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" /></div>
    <div className="form-fields">
      <div className="field"><label htmlFor="name">Your name <span aria-hidden="true">*</span></label><input id="name" name="name" placeholder="Full name" autoComplete="name" maxLength={100} required aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} />{errors.name && <span id="name-error" className="field-error">{errors.name}</span>}</div>
      <div className="field"><label htmlFor="email">Work email <span aria-hidden="true">*</span></label><input id="email" name="email" type="email" placeholder="you@company.com" autoComplete="email" maxLength={254} required aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} />{errors.email && <span id="email-error" className="field-error">{errors.email}</span>}</div>
      <div className="field"><label htmlFor="company">Company <span className="optional">(optional)</span></label><input id="company" name="company" placeholder="Company name" autoComplete="organization" maxLength={150} aria-invalid={!!errors.company} aria-describedby={errors.company ? "company-error" : undefined} />{errors.company && <span id="company-error" className="field-error">{errors.company}</span>}</div>
      <div className="field"><label htmlFor="message">What would you like to build? <span aria-hidden="true">*</span></label><textarea id="message" name="message" placeholder="Tell us about your idea or challenge." minLength={20} maxLength={5000} required aria-invalid={!!errors.message} aria-describedby={errors.message ? "message-error" : undefined} />{errors.message && <span id="message-error" className="field-error">{errors.message}</span>}</div>
    </div>
    <p className="form-privacy">We’ll use these details to respond to your enquiry.</p>
    {failure && <p className="form-error" role="alert">{failure}</p>}
    <button className="button button--primary" type="submit" disabled={pending}>{pending ? "Sending enquiry…" : <>Send enquiry <span aria-hidden="true">→</span></>}</button>
    <noscript><p className="form-error">Please enable JavaScript to send your enquiry.</p></noscript>
  </form>;
}
