"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import type { LenisOptions } from "lenis";

const OPTIONS: LenisOptions = {
  duration: 1.15,
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  // 1.0 is the safe default; 1.4 was too aggressive on touch devices
  touchMultiplier: 1.0,
  infinite: false,
};

const FALLBACK_HEADER = 70;

/** Read the header height from the single-source CSS variable (--header-height). */
function getHeaderHeight(): number {
  if (typeof window === "undefined") return FALLBACK_HEADER;
  const raw = getComputedStyle(document.documentElement).getPropertyValue("--header-height");
  const n = parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : FALLBACK_HEADER;
}

function LenisController() {
  const lenis = useLenis();
  const pathname = usePathname();

  // Expose the Lenis instance for the e2e scroll regression tests
  // (scripts/scroll-verify.mjs, anchor-verify.mjs) and ad-hoc debugging.
  // Harmless: it is only the scroll controller, no sensitive state.
  useEffect(() => {
    if (lenis) (window as unknown as { __lenis?: unknown }).__lenis = lenis;
  }, [lenis]);

  // Reset scroll position on every page navigation.
  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true });
  }, [pathname, lenis]);

  // Reduced motion: stop Lenis so scrolling is the plain native experience.
  useEffect(() => {
    if (!lenis) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => (mq.matches ? lenis.stop() : lenis.start());
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [lenis]);

  // ── Keep Lenis dimensions in sync with the REAL document ──
  //
  // Root cause of the reported "can't scroll to the bottom / anchor lands
  // mid-page / first wheel-up does nothing" bugs: Lenis' autoResize can latch
  // onto a measurement taken mid-hydration where the wrapper height reads 0.
  // Because limit = scrollHeight - height, a height of 0 leaves
  // limit == scrollHeight (measured ~14791 vs a real max of ~4522). The scroll
  // target can then run far past the real bottom, so anchors clamp wrong and
  // reversing direction spends several wheel deltas unwinding phantom distance.
  // A physical monitor / DPR change fires resize and accidentally corrects it;
  // here we drive lenis.resize() deliberately from every source that can change
  // layout, debounced to once per frame and after layout has settled.
  // Re-runs on route change so the new page's images/content are re-scanned.
  useEffect(() => {
    if (!lenis) return;

    let raf1 = 0;
    let raf2 = 0;
    let queued = false;

    const run = () => {
      queued = false;
      lenis.resize();
      // Re-sync Lenis' internal scroll to the real (browser-clamped) position,
      // preserving where the user is — never jump to the top, never mid-gesture.
      if (!lenis.isScrolling) {
        const native = window.scrollY;
        if (Math.abs(lenis.animatedScroll - native) > 2) {
          lenis.scrollTo(native, { immediate: true, force: true });
        }
      }
    };

    // Debounce to a single run per frame, and wait two frames so layout
    // (fonts / images / reflow) has settled before measuring.
    const refresh = () => {
      if (queued) return;
      queued = true;
      raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(run);
      });
    };

    // Content-height changes: fonts swapping in, images loading, dynamic
    // components mounting, responsive reflow at breakpoints.
    const ro = new ResizeObserver(refresh);
    ro.observe(document.body);

    window.addEventListener("resize", refresh);
    window.addEventListener("orientationchange", refresh);
    window.addEventListener("load", refresh);
    const vv = window.visualViewport;
    vv?.addEventListener("resize", refresh);

    // Returning to a backgrounded tab: rAF was paused while hidden, so
    // re-measure once it is foregrounded again.
    const onVisible = () => {
      if (!document.hidden) refresh();
    };
    document.addEventListener("visibilitychange", onVisible);

    // devicePixelRatio change (monitor swap / OS display scaling). matchMedia is
    // keyed to the current DPR, so it must be re-created after each change.
    let dprMq: MediaQueryList | null = null;
    const onDpr = () => {
      refresh();
      dprMq?.removeEventListener("change", onDpr);
      bindDpr();
    };
    const bindDpr = () => {
      dprMq = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
      dprMq.addEventListener("change", onDpr);
    };
    bindDpr();

    // Fonts change line-box heights after they load.
    document.fonts?.ready.then(refresh).catch(() => {});

    // Lazy / late-loading images grow the page after the first measurement.
    // Tie a refresh to each image that hasn't finished yet.
    const imgCleanups: Array<() => void> = [];
    for (const img of Array.from(document.images)) {
      if (img.complete) continue;
      const onImg = () => refresh();
      img.addEventListener("load", onImg, { once: true });
      img.addEventListener("error", onImg, { once: true });
      imgCleanups.push(() => {
        img.removeEventListener("load", onImg);
        img.removeEventListener("error", onImg);
      });
    }

    // Safety net for anything that settles asynchronously without firing the
    // observers above (e.g. an image with reserved space swapping its source).
    const settleTimers = [150, 450, 1000, 2000].map((t) => window.setTimeout(refresh, t));

    // Initial correction once mounted.
    refresh();

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      ro.disconnect();
      window.removeEventListener("resize", refresh);
      window.removeEventListener("orientationchange", refresh);
      window.removeEventListener("load", refresh);
      vv?.removeEventListener("resize", refresh);
      document.removeEventListener("visibilitychange", onVisible);
      dprMq?.removeEventListener("change", onDpr);
      imgCleanups.forEach((fn) => fn());
      settleTimers.forEach((id) => clearTimeout(id));
    };
  }, [lenis, pathname]);

  // Intercept in-page anchor clicks. Refresh dimensions first so both the
  // target position and the scroll limit are current at click time, then let
  // Lenis animate with the header offset (read from the CSS variable).
  useEffect(() => {
    if (!lenis) return;

    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!anchor) return;

      const hash = anchor.getAttribute("href");
      if (!hash || hash === "#") return;

      const target = document.querySelector(hash);
      if (!target) return;

      e.preventDefault();
      // Refresh measurements, then scroll to a NUMERIC target computed from the
      // element's current absolute position minus the header. This avoids
      // Lenis' element-offset math interacting with scroll-margin-top (which
      // was landing the target ~140px too high).
      lenis.resize();
      const absTop = window.scrollY + (target as HTMLElement).getBoundingClientRect().top;
      const targetY = Math.max(0, absTop - getHeaderHeight());
      lenis.scrollTo(targetY, { duration: 1.2 });
      history.pushState(null, "", hash);
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [lenis]);

  // If the URL already contains a hash on arrival (direct link or browser
  // forward/back), scroll to the target once Lenis and the page are ready.
  useEffect(() => {
    if (!lenis) return;
    const hash = window.location.hash;
    if (!hash) return;

    const timerId = setTimeout(() => {
      const target = document.querySelector(hash);
      if (!target) return;
      lenis.resize();
      const absTop = window.scrollY + (target as HTMLElement).getBoundingClientRect().top;
      lenis.scrollTo(Math.max(0, absTop - getHeaderHeight()), { duration: 1.2 });
    }, 300);

    return () => clearTimeout(timerId);
  }, [pathname, lenis]);

  return null;
}

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root options={OPTIONS}>
      <LenisController />
      {children}
    </ReactLenis>
  );
}
