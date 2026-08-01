"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

/**
 * Two-part cursor: a dot pinned to the pointer, and a ring that trails it.
 *
 * Any element carrying `data-cursor` grows the ring on hover; the attribute's
 * value, if set, is rendered inside it (e.g. data-cursor="View").
 *
 * The markup is always rendered so the refs stay stable — on coarse pointers
 * and under reduced motion no listeners attach, so both nodes stay at
 * opacity 0 and never appear.
 */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");

  useGSAP(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine || prefersReducedMotion()) return;

    document.documentElement.classList.add("has-custom-cursor");

    const dot = dotRef.current!;
    const ring = ringRef.current!;

    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, opacity: 0 });

    const moveDotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3" });
    const moveDotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3" });
    const moveRingX = gsap.quickTo(ring, "x", { duration: 0.5, ease: "power3" });
    const moveRingY = gsap.quickTo(ring, "y", { duration: 0.5, ease: "power3" });

    let visible = false;

    const onMove = (event: PointerEvent) => {
      if (!visible) {
        visible = true;
        gsap.to([dot, ring], { opacity: 1, duration: 0.3 });
      }
      moveDotX(event.clientX);
      moveDotY(event.clientY);
      moveRingX(event.clientX);
      moveRingY(event.clientY);
    };

    const onLeave = () => {
      visible = false;
      gsap.to([dot, ring], { opacity: 0, duration: 0.2 });
    };

    // Delegated so sections that mount later are covered automatically.
    const onOver = (event: PointerEvent) => {
      const target = (event.target as HTMLElement | null)?.closest?.(
        "[data-cursor], a, button",
      ) as HTMLElement | null;

      // Border colour is a CSS class so it follows a theme switch; GSAP only
      // ever drives the scale here.
      if (!target) {
        ring.classList.remove("is-active");
        gsap.to(ring, { scale: 1, duration: 0.4 });
        gsap.to(dot, { scale: 1, duration: 0.4 });
        setLabel("");
        return;
      }

      const text = target.dataset.cursor;
      const hasText = Boolean(text) && text !== "true";
      setLabel(hasText ? text! : "");

      ring.classList.add("is-active");
      gsap.to(ring, {
        scale: hasText ? 2.4 : 1.7,
        duration: 0.45,
        ease: "expo.out",
      });
      gsap.to(dot, { scale: 0, duration: 0.3 });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerleave", onLeave);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  return (
    <div aria-hidden className="max-lg:hidden">
      <div
        ref={dotRef}
        style={{ opacity: 0 }}
        className="pointer-events-none fixed top-0 left-0 z-[70] size-1.5 rounded-full bg-accent"
      />
      <div
        ref={ringRef}
        style={{ opacity: 0 }}
        className="cursor-ring pointer-events-none fixed top-0 left-0 z-[70] flex size-10 items-center justify-center rounded-full border"
      >
        <span className="text-bone font-mono text-[7px] tracking-[0.14em] uppercase">
          {label}
        </span>
      </div>
    </div>
  );
}
