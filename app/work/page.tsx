import type { Metadata } from "next";
import { Hero } from "@/components/sections/hero";
import { ConceptFigure, ProjectInvitation } from "@/components/sections/shared";
import { Reveal } from "@/components/effects/reveal";
import { Button } from "@/components/ui/button";
import { concepts } from "@/data/content";

export const metadata: Metadata = { title: "Work & Product Concepts", description: "Explore illustrative product concepts for an operations workspace, customer portal and booking experience. Starting points for your next product.", alternates: { canonical: "/work" } };

export default function Work() {
  return <><Hero eyebrow="Work" title={<>What could your<br />next product look like?</>} description="Illustrative product concepts showing possible directions. These are not completed client engagements." />
    <section className="section work-section" data-journey-anchor="concepts" id="next-section"><div className="container"><div className="content">
      <p className="eyebrow">Illustrative concepts</p><h2>Starting points for a conversation.</h2>
      <div className="work-list">{concepts.map(concept => <Reveal className="work-row" key={concept.id}>
        <ConceptFigure concept={concept} /><div className="concept-explanation"><h3>{concept.description}</h3><p>The final feature set and interface would be shaped around your users and business needs.</p><Button href={`/contact?concept=${concept.id}#enquiry`} variant="outline">Discuss a similar idea</Button></div>
      </Reveal>)}</div>
    </div></div></section><ProjectInvitation />
  </>;
}
