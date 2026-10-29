import Image from "next/image";
import Link from "next/link";
import { services, process, concepts } from "@/data/content";
import { Button } from "@/components/ui/button";
import { ServiceCard } from "@/components/effects/service-card";
import { Reveal } from "@/components/effects/reveal";

export function ServiceGrid() {
  return <section className="section services-section" data-journey-anchor="services" id="next-section"><div className="container"><div className="content">
    <p className="eyebrow">What we do</p><h2>The right technology<br />for what comes next.</h2>
    <div className="service-grid">{services.map((service, i) => <ServiceCard key={service.id}>
      <span className="number">0{i + 1}</span><h3>{service.title}</h3><p>{service.description}</p>
      <Link className="text-link" href={`/contact?service=${service.id}#enquiry`}>Discuss this service <span aria-hidden="true">→</span></Link>
    </ServiceCard>)}</div>
  </div></div></section>;
}

export function Process() {
  return <section className="section process-section dark-section" data-journey-anchor="process" id="process"><div className="container"><div className="content">
    <p className="eyebrow">A shared direction</p><h2>A clear path from idea to launch.</h2>
    <div className="process-grid">{process.map((step, i) => <Reveal key={step.title} delay={i % 3 * .05}><span className="number">0{i + 1}</span><h3>{step.title}</h3><p>{step.description}</p></Reveal>)}</div>
  </div></div></section>;
}

export function ConceptFigure({ concept }: { concept: typeof concepts[number] }) {
  return <figure className="concept-figure">
    <picture><source media="(max-width: 767px)" srcSet={concept.image.replace(".svg", "-mobile.svg")} width={328} height={237} /><Image src={concept.image} alt={`Illustrative ${concept.title.toLowerCase()} interface with a purple progress chart`} width={552} height={237} className="concept-image" loading="eager" /></picture>
    <figcaption><p className="concept-label">Illustrative concept · Not client work</p><h3>{concept.title}</h3></figcaption>
  </figure>;
}

export function ConceptWork() {
  return <section className="section paper-section possibilities-section" data-journey-anchor="possibilities" id="possibilities"><div className="container"><div className="content">
    <p className="eyebrow">What we can build</p><h2>A glimpse of what’s possible.</h2><p className="section-description">Illustrative product studies to start a conversation, not completed client projects.</p>
    <div className="concept-grid">{concepts.slice(0, 2).map(concept => <Reveal key={concept.id}><ConceptFigure concept={concept} /></Reveal>)}</div>
    <Button href="/work" variant="outline">Explore concepts</Button>
  </div></div></section>;
}

export function HomeApproach() {
  return <section className="section approach-section" data-journey-anchor="approach" id="approach"><div className="container"><div className="content">
    <p className="eyebrow">Why FetchUp</p><h2>Good software starts<br />with understanding people.</h2>
    <p className="reading-copy">We start with the problem you want to solve, make the choices clear and build around the way your business works. Higher Together is our direction: thoughtful software and shared progress.</p>
    <Button href="/about" variant="outline">Meet FetchUp</Button>
  </div></div></section>;
}

export function ProjectInvitation() {
  return <section className="section invitation-section" data-journey-anchor="invitation" id="lets-build"><div className="container"><div className="content">
    <p className="eyebrow">The next step</p><h2>What would you like to build?</h2>
    <p className="reading-copy">Bring your idea, your challenge or the product you want to improve. We’ll work out the next step together.</p>
    <Button href="/contact">Discuss your project</Button>
  </div></div></section>;
}
