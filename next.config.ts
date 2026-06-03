import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // The prototype ships first-party SVG placeholders under /public.
    // Replace with real photography later; remove this if no SVGs are served.
    dangerouslyAllowSVG: true,
    contentDispositionType: "inline",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
