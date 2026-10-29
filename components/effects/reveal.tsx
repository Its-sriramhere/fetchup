"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { animate } from "motion/react";
import { useMotionPreference } from "@/components/journey/arrow-journey";

// Small entry enhancement with visible server-rendered fallback.
export function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { paused, reduced } = useMotionPreference();
  useEffect(() => {
    const element = ref.current;
    if (!element || paused || reduced) return;
    let animation: ReturnType<typeof animate> | undefined;
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        animation = animate(element, { transform: ["translateY(14px)", "translateY(0px)"], opacity: [.7, 1] }, { duration: .45, delay, ease: [.22, 1, .36, 1] });
        observer.disconnect();
      }
    }, { threshold: .12 });
    observer.observe(element);
    return () => { observer.disconnect(); animation?.stop(); element.style.opacity = "1"; element.style.transform = "none"; };
  }, [paused, reduced, delay]);
  return <div ref={ref} className={className}>{children}</div>;
}
