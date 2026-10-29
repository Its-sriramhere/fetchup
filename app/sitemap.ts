import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const url = process.env.SITE_URL || "http://localhost:3000";
  return ["", "/services", "/about", "/work", "/contact"].map(path => ({ url: `${url.replace(/\/$/, "")}${path}`, changeFrequency: "monthly", priority: path ? .7 : 1 }));
}
