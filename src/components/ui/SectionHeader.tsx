"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

/**
 * Shared section marker: index, title, and a rule that draws itself in.
 */
export default function SectionHeader({
  index,
  title,
  aside,
  className = "",
}: {
  index: string;
  title: string;
  aside?: string;
  className?: string;
}) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      gsap
        .timeline({
          scrollTrigger: { trigger: root.current, start: "top 88%", once: true },
        })
        .from(".section-rule", {
          scaleX: 0,
          duration: 1.2,
          ease: "expo.inOut",
          transformOrigin: "left center",
        })
        .from(
          ".section-meta",
          { y: 18, autoAlpha: 0, duration: 0.8, stagger: 0.08, ease: "expo.out" },
          "-=0.9",
        );
    },
    { scope: root },
  );

  return (
    <div ref={root} className={className}>
      <div className="section-rule rule mb-4" />
      <div className="flex items-baseline justify-between gap-6">
        <div className="flex items-baseline gap-3 md:gap-5">
          <span className="section-meta label text-accent">{index}</span>
          <h2 className="section-meta text-[16px] tracking-tight md:text-[17px]">
            {title}
          </h2>
        </div>
        {/* max-w is wide enough that the shorter asides hold one line at the
            new caption size; the two long ones wrap to two, which is fine. */}
        {aside && (
          <span className="section-meta label hidden max-w-[25rem] text-right leading-relaxed sm:block">
            {aside}
          </span>
        )}
      </div>
    </div>
  );
}
