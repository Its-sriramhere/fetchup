"use client";

import type { ReactNode } from "react";
import SpotlightCard from "./react-bits/SpotlightCard";

export function ServiceCard({ children }: { children: ReactNode }) {
  return <SpotlightCard className="service-card">{children}</SpotlightCard>;
}
