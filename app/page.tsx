import type { Metadata } from "next";
import { Hero } from "@/components/sections/hero";
import { ServiceGrid, Process, ConceptWork, HomeApproach, ProjectInvitation } from "@/components/sections/shared";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function Home() {
  return <><Hero home eyebrow="Software that moves you forward" title={<>Your next big idea.<br />Built into software.</>} description="FetchUp designs and develops websites, applications and custom software that help businesses move forward." />
    <ServiceGrid /><Process /><ConceptWork /><HomeApproach /><ProjectInvitation />
  </>;
}
