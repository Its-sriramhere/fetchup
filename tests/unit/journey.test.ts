import { describe, expect, it } from "vitest";
import { interpolateJourney, normalizeCheckpoints } from "@/lib/journey";
import type { JourneyPose } from "@/data/journey.config";

const first: JourneyPose = { scroll: 0, x: 100, y: 200, rotation: 0, scale: 1 };
const last: JourneyPose = { scroll: 1000, x: 200, y: 400, rotation: 30, scale: .5 };

describe("scroll journey", () => {
  it("interpolates reversibly with no timer or input-direction dependence", () => {
    const points = [first, last];
    expect(interpolateJourney(points, 500)).toEqual({ scroll: 500, x: 150, y: 300, rotation: 15, scale: .75 });
    const forward = interpolateJourney(points, 300);
    interpolateJourney(points, 800);
    expect(interpolateJourney(points, 300)).toEqual(forward);
  });
  it("clamps negative scroll and overscroll", () => {
    expect(interpolateJourney([first, last], -100)).toEqual(first);
    expect(interpolateJourney([first, last], 1200)).toEqual(last);
  });
  it("merges duplicate checkpoint positions after clamping", () => {
    const points = normalizeCheckpoints([first, { ...last, scroll: 800 }, { ...last, scroll: 1000 }], 500);
    expect(points).toHaveLength(2);
    expect(points[1].scroll).toBe(500);
  });
  it("keeps a safe entry pose on a non-scrolling page", () => {
    expect(normalizeCheckpoints([first, last], 0)).toEqual([first]);
    expect(interpolateJourney([], 0)).toBeNull();
  });
});
