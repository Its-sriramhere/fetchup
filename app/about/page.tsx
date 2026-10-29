import type { Metadata } from "next";
import { Hero } from "@/components/sections/hero";
import { ProjectInvitation } from "@/components/sections/shared";
import { Reveal } from "@/components/effects/reveal";
import { principles } from "@/data/content";

export const metadata: Metadata = { title: "About", description: "Get to know FetchUp: thoughtful software, shared progress and a practical, people-centred approach to design and development.", alternates: { canonical: "/about" } };

export default function About() {
  return <><Hero eyebrow="About" title={<>Thoughtful software.<br />Shared progress.</>} description="FetchUp brings design and development around one purpose: helping businesses move forward through useful digital products." />
    <section className="section about-approach" data-journey-anchor="approach" id="next-section"><div className="container"><div className="content">
      <p className="eyebrow">Why we build</p><h2>Technology should<br />make things clearer.</h2>
      <div className="reading-copy reading-copy--wide"><p>Every business has its own way of working. We begin by understanding yours: the people, the challenges and the opportunities. Then we turn those insights into a practical plan for your digital product.</p>
      <p>Our name points forward. Our tagline makes the journey shared. Higher Together means working with you through the decisions that shape a useful product.</p></div>
    </div></div></section>
    <section className="section paper-section principles-section" data-journey-anchor="principles" id="principles"><div className="container"><div className="content">
      <h2 className="eyebrow">What guides us</h2><div className="principle-grid">{principles.map(principle => <Reveal className="principle" key={principle.title}><h3>{principle.title}</h3><p>{principle.description}</p></Reveal>)}</div>
    </div></div></section>
    <section className="section dark-section brand-section" data-journey-anchor="brand" id="brand-direction"><div className="container"><div className="content"><h2>One arrow.<br />A shared direction.</h2><p className="reading-copy reading-copy--wide">The two parts of the FetchUp arrow come together in one mark: a visual expression of Higher Together.</p></div></div></section>
    <ProjectInvitation />
  </>;
}
