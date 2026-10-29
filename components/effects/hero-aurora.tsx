"use client";

import dynamic from "next/dynamic";
import { useMotionPreference } from "@/components/journey/arrow-journey";

const Aurora = dynamic(() => import("./react-bits/Aurora"), { ssr: false });

export function HeroAurora() {
  const { paused, reduced } = useMotionPreference();
  return <div className="hero-aurora" aria-hidden="true">{!paused && !reduced && <Aurora />}</div>;
}
