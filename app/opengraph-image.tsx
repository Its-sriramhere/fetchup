import { ImageResponse } from "next/og";

export const alt = "FetchUp — Thoughtful software. Shared progress.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(<div style={{ width: "100%", height: "100%", padding: "72px", background: "#080F25", color: "white", display: "flex", flexDirection: "column", justifyContent: "space-between", fontFamily: "sans-serif" }}>
    <div style={{ display: "flex", fontSize: 38, alignItems: "center", gap: 16 }}><span style={{ color: "#7020F5", fontSize: 54 }}>↗</span> FetchUp</div>
    <div style={{ display: "flex", flexDirection: "column", fontSize: 76, fontWeight: 700, letterSpacing: -3, lineHeight: 1.1 }}><span>Thoughtful software.</span><span>Shared progress.</span></div>
    <div style={{ display: "flex", color: "#C0B7D4", fontSize: 25 }}>Higher Together</div>
  </div>, size);
}
