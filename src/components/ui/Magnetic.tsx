"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

/**
 * Pulls its child toward the pointer while hovered, then springs back.
 *
 * `strength` is the fraction of the distance from centre to pointer the
 * element travels — 0.3 is a nudge, 0.8 is comical.
 */
export default function Magnetic({
  children,
  strength = 0.35,
  className = "",
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      if (!fine || prefersReducedMotion()) return;

      const moveX = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3" });
      const moveY = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3" });

      const onMove = (event: PointerEvent) => {
        const rect = el.getBoundingClientRect();
        moveX((event.clientX - (rect.left + rect.width / 2)) * strength);
        moveY((event.clientY - (rect.top + rect.height / 2)) * strength);
      };

      const onLeave = () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.4)" });
      };

      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", onLeave);

      return () => {
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerleave", onLeave);
      };
    },
    { scope: ref, dependencies: [strength] },
  );

  return (
    <span ref={ref} className={`inline-block will-change-transform ${className}`}>
      {children}
    </span>
  );
}
