import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { HeroAurora } from "@/components/effects/hero-aurora";

export function Hero({ eyebrow, title, description, home = false }: {
  eyebrow: string; title: ReactNode; description: string; home?: boolean;
}) {
  return <section className={`hero${home ? " hero--home" : ""}${eyebrow === "Contact" ? " hero--contact" : ""}`} data-journey-anchor="hero" id="hero">
    <HeroAurora />
    <div className="hero-orbits" aria-hidden="true" />
    <div className="container hero-inner">
      <div className="hero-copy"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="hero-description">{description}</p>
        {home && <div className="hero-actions"><Button href="/contact">Discuss your project</Button><Button href="/services" variant="secondary" arrow={false}>Explore services</Button></div>}
      </div>
      <a className="scroll-hint" href="#next-section">Scroll to follow the journey <span aria-hidden="true">↓</span></a>
    </div>
  </section>;
}
