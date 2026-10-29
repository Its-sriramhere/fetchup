"use client";

// FetchUp adaptation of React Bits SpotlightCard. Pointer-only, no ambient loop.
// Source and licence are recorded in THIRD_PARTY_NOTICES.md.
import { useRef, type HTMLAttributes, type PointerEvent } from "react";

export default function SpotlightCard({ children, className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement>(null);
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || document.documentElement.dataset.motion === "paused") return;
    const rect = event.currentTarget.getBoundingClientRect();
    ref.current?.style.setProperty("--spotlight-x", `${event.clientX - rect.left}px`);
    ref.current?.style.setProperty("--spotlight-y", `${event.clientY - rect.top}px`);
  };
  return <div ref={ref} className={`spotlight-card ${className}`} onPointerMove={onPointerMove} {...props}>{children}</div>;
}
