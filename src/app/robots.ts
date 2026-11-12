import type { MetadataRoute } from "next";
import { profile } from "@/content";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: new URL("/sitemap.xml", profile.url).toString(),
  };
}
