import type { Metadata } from "next";
import { Hero } from "@/components/sections/hero";
import { ServiceGrid, Process, ProjectInvitation } from "@/components/sections/shared";
import { questions } from "@/data/content";

export const metadata: Metadata = { title: "Services", description: "Web development, mobile applications, custom software, UI/UX design and ongoing support, shaped around your business.", alternates: { canonical: "/services" } };

export default function Services() {
  return <><Hero eyebrow="Services" title={<>From an idea<br />to what comes next.</>} description="Design, development and ongoing care, shaped around your business and the people who use your product." />
    <ServiceGrid /><Process />
    <section className="section paper-section questions-section" data-journey-anchor="questions" id="questions"><div className="container"><div className="content">
      <p className="eyebrow">Before we begin</p><div className="questions">{questions.map(question => <article key={question.title}><h3>{question.title}</h3><p>{question.answer}</p></article>)}</div>
    </div></div></section><ProjectInvitation />
  </>;
}
