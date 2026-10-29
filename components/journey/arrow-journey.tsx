"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { animate, motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { desktopPoses, mobilePoses, journeyRoutes, type JourneyPose } from "@/data/journey.config";
import { clamp, interpolateJourney, normalizeCheckpoints } from "@/lib/journey";

const MotionContext = createContext({ paused: false, reduced: false, toggle: () => {} });
export const useMotionPreference = () => useContext(MotionContext);

export function MotionControl() {
  const { paused, reduced, toggle } = useMotionPreference();
  return <button className="motion-control" onClick={toggle} aria-pressed={paused || reduced} disabled={reduced} title={reduced ? "Reduced motion follows your device preference" : undefined}>
    <span className="motion-control-dot" aria-hidden="true" />{reduced ? "Reduced motion" : paused ? "Motion paused" : "Pause motion"}
  </button>;
}

export function ArrowJourneyProvider({ children }: { children: ReactNode }) {
  const [paused, setPaused] = useState(false);
  const reduced = !!useReducedMotion();
  useEffect(() => { try { setPaused(localStorage.getItem("fetchup-motion-paused") === "true"); } catch {} }, []);
  const toggle = useCallback(() => setPaused(value => {
    try { localStorage.setItem("fetchup-motion-paused", String(!value)); } catch {}
    return !value;
  }), []);
  useEffect(() => { document.documentElement.dataset.motion = paused || reduced ? "paused" : "active"; }, [paused, reduced]);
  return <MotionContext.Provider value={{ paused, reduced, toggle }}>{children}<ArrowJourney /></MotionContext.Provider>;
}

function ArrowJourney() {
  const pathname = usePathname();
  const { paused, reduced } = useMotionPreference();
  const stopped = paused || reduced;
  const { scrollY } = useScroll();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotation = useMotionValue(0);
  const scale = useMotionValue(1);
  const points = useRef<JourneyPose[]>([]);
  const animations = useRef<{ stop: () => void }[]>([]);
  const initialized = useRef(false);
  const lastRoute = useRef(pathname);
  const [rail, setRail] = useState<{ points: JourneyPose[]; width: number; height: number; mobile: boolean } | null>(null);

  const cancel = useCallback(() => { animations.current.forEach(animation => animation.stop()); animations.current = []; }, []);
  const apply = useCallback((pose: JourneyPose, transition = false) => {
    cancel();
    const values = [[x, pose.x], [y, pose.y], [rotation, pose.rotation], [scale, pose.scale]] as const;
    values.forEach(([value, destination]) => {
      if (transition) animations.current.push(animate(value, destination, { duration: .28, ease: [.22, 1, .36, 1] }));
      else value.set(destination);
    });
  }, [x, y, rotation, scale, cancel]);

  useMotionValueEvent(scrollY, "change", value => {
    if (stopped) return;
    const pose = interpolateJourney(points.current, value);
    if (pose) apply(pose);
  });

  useEffect(() => {
    let frame = 0;
    let disposed = false;
    const measure = () => {
      if (disposed) return;
      const width = document.documentElement.clientWidth;
      const height = window.innerHeight;
      const mobile = width < 768;
      const size = mobile ? 27 : 85;
      // Exclude the previous absolute rail from the new measurement on shrink.
      const documentHeight = Math.max(height, document.body.offsetHeight);
      const maxScroll = Math.max(0, documentHeight - height);
      const margin = Math.max(24, (width - Math.min(1248, width - clamp(width * .133333, 48, 192))) / 2);
      const railBase = mobile ? width - 19 : width - margin - 60;
      const settings = mobile ? mobilePoses : desktopPoses;
      const ids = journeyRoutes[pathname] || ["hero", "footer"];
      const measured: JourneyPose[] = [];
      ids.forEach((id, i) => {
        const anchor = document.querySelector<HTMLElement>(`[data-journey-anchor="${id}"]`);
        if (!anchor) return;
        const setting = settings[i % settings.length];
        const anchorTop = anchor.getBoundingClientRect().top + window.scrollY;
        const scroll = i === 0 ? 0 : i === ids.length - 1 ? maxScroll : anchorTop - height * .32;
        const centerX = clamp(railBase + setting.rail * (mobile ? 4 : 36), size / 2 + 4, width - size / 2 - 4);
        const entryY = pathname === "/" ? 324 : pathname === "/contact" ? 284 : 300;
        measured.push({ scroll, x: centerX - size / 2, y: clamp(i === 0 && !mobile ? entryY : height * setting.y, 100, height - size - 24), rotation: setting.rotation, scale: setting.scale });
      });
      points.current = normalizeCheckpoints(measured, maxScroll);
      setRail({ points: points.current, width, height: documentHeight, mobile });
      const target = interpolateJourney(points.current, window.scrollY);
      const routeChanged = lastRoute.current !== pathname;
      if (target) {
        const rest = { ...target, y: height - size - 32, rotation: 0, scale: mobile ? .85 : .65 };
        apply(stopped ? rest : target, initialized.current && routeChanged && !stopped);
      }
      initialized.current = true;
      lastRoute.current = pathname;
    };
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(measure); };
    // Measurements are cached; scroll frames only interpolate transforms.
    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);
    const main = document.getElementById("main-content");
    if (main) observer.observe(main);
    window.addEventListener("resize", schedule);
    window.addEventListener("pageshow", schedule);
    document.fonts.ready.then(schedule);
    schedule();
    return () => { disposed = true; cancelAnimationFrame(frame); observer.disconnect(); window.removeEventListener("resize", schedule); window.removeEventListener("pageshow", schedule); cancel(); };
  }, [pathname, stopped, apply, cancel]);

  const trajectory = rail?.points.map(point => ({ x: point.x + (rail.mobile ? 13.5 : 42.5), y: point.scroll + point.y + (rail.mobile ? 7 : 23) })) || [];
  const path = trajectory.map((point, i) => i === 0 ? `M ${point.x} ${point.y}` : `C ${trajectory[i - 1].x + (rail?.mobile ? 4 : 70)} ${(trajectory[i - 1].y + point.y) / 2}, ${point.x + (rail?.mobile ? 4 : 70)} ${(trajectory[i - 1].y + point.y) / 2}, ${point.x} ${point.y}`).join(" ");

  return <>
    {rail && <svg className="journey-rail" width={rail.width} height={rail.height} viewBox={`0 0 ${rail.width} ${rail.height}`} aria-hidden="true"><path d={path} fill="none" stroke="#B391E8" strokeWidth="1.2" strokeDasharray="4 12" opacity=".36" />{trajectory.map((point, i) => <circle key={i} cx={point.x} cy={point.y} r={rail.mobile ? 1.8 : 3} fill="#B391E8" />)}</svg>}
    <motion.div data-travelling-arrow className="journey-arrow" aria-hidden="true" style={{ x, y, rotate: rotation, scale, opacity: rail ? 1 : 0 }}>
      {/* Approved two-part vector exported from Figma; separate from static logo artwork. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/journey-arrow.svg" width="85" height="47" alt="" draggable="false" />
    </motion.div>
  </>;
}
