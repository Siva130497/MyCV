"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

// Register once, on the client only. Importing this module anywhere in a
// client component guarantees the plugins are available before any tween runs.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

  gsap.defaults({ ease: "power3.out", duration: 1 });

  // ScrollTrigger recalculates on resize; on mobile the URL bar collapsing
  // fires resize constantly, so ignore height-only changes.
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export { gsap, ScrollTrigger, SplitText, useGSAP };

/** True when the visitor has asked for reduced motion. */
export const prefersReducedMotion = (): boolean =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Standard easing curve used across the site. */
export const EASE = "expo.out" as const;

/**
 * Seconds the hero waits before playing, so its reveal starts as the
 * preloader curtain lifts rather than behind it. Matches the preloader
 * timeline length in components/ui/Preloader.tsx — change both together.
 */
export const INTRO_DELAY = 1.9;
