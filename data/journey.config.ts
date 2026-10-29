export type JourneyPose = { scroll: number; x: number; y: number; rotation: number; scale: number };
export const journeyRoutes: Record<string, string[]> = {
  "/": ["hero", "services", "process", "possibilities", "approach", "invitation", "footer"],
  "/services": ["hero", "services", "process", "questions", "invitation", "footer"],
  "/about": ["hero", "approach", "principles", "brand", "invitation", "footer"],
  "/work": ["hero", "concepts", "invitation", "footer"],
  "/contact": ["hero", "enquiry", "footer"],
};

export const desktopPoses = [
  { rail: 0, y: .42, rotation: 0, scale: 1 },
  { rail: 1, y: .47, rotation: 16, scale: .72 },
  { rail: 0, y: .55, rotation: -12, scale: .78 },
  { rail: 1, y: .43, rotation: 12, scale: .7 },
  { rail: 0, y: .56, rotation: -14, scale: .76 },
  { rail: .65, y: .5, rotation: 10, scale: .8 },
  { rail: .1, y: .58, rotation: 0, scale: .72 },
];
export const mobilePoses = [
  { rail: 0, y: .36, rotation: 0, scale: 1 },
  { rail: 1, y: .43, rotation: 12, scale: .85 },
  { rail: 0, y: .52, rotation: -8, scale: .9 },
  { rail: 1, y: .44, rotation: 8, scale: .8 },
  { rail: 0, y: .54, rotation: -10, scale: .9 },
  { rail: .65, y: .48, rotation: 8, scale: .85 },
  { rail: .1, y: .56, rotation: 0, scale: .85 },
];
