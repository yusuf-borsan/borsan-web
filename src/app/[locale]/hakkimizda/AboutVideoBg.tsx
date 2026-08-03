"use client";

import { useEffect, useState } from "react";

/**
 * Background video for the About HERO only. It is only mounted on ≥768px
 * viewports and when the user has NOT requested reduced motion — so phones and
 * reduced-motion users never download or play it and simply fall back to the
 * navy gradient. If the file fails to load, the element paints nothing and the
 * navy hero background shows through, so the page never breaks.
 *
 * object-cover fills the hero edge-to-edge (no left/right pillarbox); a small
 * scale hides any black edges baked into the source. The video never leaves the
 * hero (the hero clips overflow).
 */
export function AboutVideoBg() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wideEnough = window.matchMedia("(min-width: 768px)").matches;
    setShow(wideEnough && !reduced);
  }, []);

  if (!show) return null;

  return (
    <video
      className="pointer-events-none absolute inset-0 h-full w-full scale-[1.02] object-cover object-center"
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
    >
      <source src="/videos/borsan-hakkimizda-video.mp4" type="video/mp4" />
    </video>
  );
}
