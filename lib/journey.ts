import type { JourneyPose } from "@/data/journey.config";

export function clamp(value: number, min: number, max: number) { return Math.min(max, Math.max(min, value)); }

export function normalizeCheckpoints(points: JourneyPose[], maxScroll: number): JourneyPose[] {
  const result: JourneyPose[] = [];
  for (const point of points) {
    const next = { ...point, scroll: clamp(point.scroll, 0, Math.max(0, maxScroll)) };
    const previous = result[result.length - 1];
    if (previous && next.scroll <= previous.scroll) {
      // Keep the entry pose on a page with no usable scroll range.
      if (next.scroll > 0) result[result.length - 1] = next;
    } else result.push(next);
  }
  return result;
}

export function interpolateJourney(points: JourneyPose[], scroll: number): JourneyPose | null {
  if (!points.length) return null;
  if (scroll <= points[0].scroll) return points[0];
  const last = points[points.length - 1];
  if (scroll >= last.scroll) return last;
  const end = points.findIndex(point => point.scroll > scroll);
  const from = points[end - 1];
  const to = points[end];
  const progress = clamp((scroll - from.scroll) / Math.max(1, to.scroll - from.scroll), 0, 1);
  const t = progress * progress * (3 - 2 * progress);
  const lerp = (a: number, b: number) => a + (b - a) * t;
  return { scroll, x: lerp(from.x, to.x), y: lerp(from.y, to.y), rotation: lerp(from.rotation, to.rotation), scale: lerp(from.scale, to.scale) };
}
