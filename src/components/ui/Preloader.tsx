"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { person } from "@/data/site";

/**
 * Brief entry curtain: a 0–100 counter, then the panel wipes upward.
 *
 * Kept under two seconds — anything longer reads as a slow site rather than a
 * considered one. Skipped entirely under reduced motion.
 */
export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        setDone(true);
        document.body.style.overflow = "";
        return;
      }

      document.body.style.overflow = "hidden";

      const progress = { value: 0 };

      const tl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = "";
          setDone(true);
        },
      });

      tl.to(progress, {
        value: 100,
        duration: 1.15,
        ease: "power2.inOut",
        onUpdate: () => {
          if (counter.current) {
            counter.current.textContent = String(Math.round(progress.value)).padStart(3, "0");
          }
        },
      })
        .to(bar.current, { scaleX: 1, duration: 1.15, ease: "power2.inOut" }, 0)
        .to(".preloader-line", {
          yPercent: -110,
          duration: 0.7,
          ease: "expo.inOut",
          stagger: 0.05,
        })
        .to(
          root.current,
          { yPercent: -100, duration: 0.9, ease: "expo.inOut" },
          "-=0.35",
        );

      return () => {
        document.body.style.overflow = "";
      };
    },
    { scope: root },
  );

  if (done) return null;

  return (
    <div
      ref={root}
      aria-hidden
      className="bg-ink fixed inset-0 z-[100] flex flex-col justify-between p-5 md:p-10"
    >
      <div className="overflow-hidden">
        <div className="preloader-line label">Portfolio — 2026</div>
      </div>

      {/* Sized so "Vithurushan.M" and the counter share one line without
          wrapping at 320px — the name is 13 characters, not 11. */}
      <div className="flex items-end justify-between gap-4 md:gap-6">
        <div className="overflow-hidden">
          <div className="preloader-line display text-[9.5vw] leading-[0.85] md:text-[7.5vw]">
            {person.firstName}
            <span className="text-accent">.{person.lastName.charAt(0)}</span>
          </div>
        </div>
        <div className="overflow-hidden">
          <div className="preloader-line font-mono text-[6.5vw] leading-none md:text-[4.5vw]">
            <span ref={counter}>000</span>
          </div>
        </div>
      </div>

      <div className="bg-line mt-8 h-px w-full">
        <div ref={bar} className="bg-accent h-px w-full origin-left scale-x-0" />
      </div>
    </div>
  );
}
