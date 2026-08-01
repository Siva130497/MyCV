"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/**
 * Drives inertial scrolling with Lenis and keeps ScrollTrigger in step with it.
 *
 * Lenis is driven off gsap.ticker rather than its own rAF loop so scroll
 * position and every scrubbed tween update on the same frame — otherwise
 * pinned sections visibly lag the page by a frame.
 */
export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Honour reduced motion: fall back to the browser's native scrolling.
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
      // Native scrolling on touch feels better than emulated inertia.
      syncTouch: false,
    });

    window.__lenis = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Anchor links inside the page should ride the same inertia.
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest?.(
        'a[href^="#"]',
      ) as HTMLAnchorElement | null;
      if (!anchor) return;

      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;

      const target = document.querySelector(id);
      if (!target) return;

      event.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: 0, duration: 1.4 });
    };

    document.addEventListener("click", onClick);

    // Images finishing late shift every trigger below them.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);

    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("load", refresh);
      gsap.ticker.remove(raf);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  return <>{children}</>;
}
