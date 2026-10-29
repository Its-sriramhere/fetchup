import type { Metadata } from "next";
import { Suspense } from "react";
import { Hero } from "@/components/sections/hero";
import { EnquiryForm } from "@/components/forms/enquiry-form";

export const metadata: Metadata = { title: "Contact", description: "Tell FetchUp about your next website, mobile application or software project. Let’s work out the next step together.", alternates: { canonical: "/contact" } };

export default function Contact() {
  return <><Hero eyebrow="Contact" title={<>Tell us what<br />you have in mind.</>} description="A new product, a better workflow or a fresh direction. Tell us where you want to go." />
    <section className="section enquiry-section" data-journey-anchor="enquiry" id="next-section"><div className="container"><div className="content enquiry-layout">
      <div className="enquiry-intro"><h2>A useful first<br className="desktop-break" /> conversation.</h2><ol>
        <li><span className="number">01</span><p>Tell us about your goals and the challenge.</p></li>
        <li><span className="number">02</span><p>We’ll clarify the scope and what matters most.</p></li>
        <li><span className="number">03</span><p>Together, decide a practical next step.</p></li>
      </ol></div>
      <Suspense fallback={<div className="form-skeleton" aria-busy="true">Loading enquiry form…</div>}><EnquiryForm /></Suspense>
    </div></div></section>
  </>;
}
