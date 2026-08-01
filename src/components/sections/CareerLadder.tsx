"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { experience } from "@/data/site";

/**
 * The career arc as a drawn ladder — intern at the bottom, founder at the top.
 *
 * Rungs come straight from `experience` (reversed), so the graphic can't fall
 * out of step with the timeline further down the page.
 */
export default function CareerLadder() {
  const root = useRef<HTMLDivElement>(null);

  // Oldest first, so the ladder climbs as you read down the page.
  const rungs = [...experience].reverse();

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: "top 82%", once: true },
      });

      tl.from(".ladder-spine", {
        scaleY: 0,
        duration: 1.1,
        ease: "power2.inOut",
        transformOrigin: "top center",
      })
        .from(
          ".ladder-dot",
          { scale: 0, duration: 0.5, ease: "back.out(2)", stagger: 0.09 },
          "-=0.75",
        )
        .from(
          ".ladder-row",
          { x: -14, autoAlpha: 0, duration: 0.6, ease: "expo.out", stagger: 0.09 },
          "<",
        );
    },
    { scope: root },
  );

  return (
    <div ref={root} className="relative mt-10 md:mt-12">
      {/* The line the rungs hang off */}
      <span
        aria-hidden
        className="bg-line ladder-spine absolute top-2 bottom-2 left-[3.35rem] w-px"
      />

      <ol className="space-y-0">
        {rungs.map((job, i) => {
          const isLast = i === rungs.length - 1;
          return (
            <li
              key={`${job.company}-${job.period}`}
              className="ladder-row relative flex items-center gap-4 py-2.5"
            >
              <span className="label w-10 shrink-0 tabular-nums">{job.startYear}</span>

              <span className="relative flex w-6 shrink-0 justify-center">
                <span
                  aria-hidden
                  className={`ladder-dot bg-ink relative z-10 rounded-full border transition-colors ${
                    isLast
                      ? "border-accent ring-accent/25 size-3 ring-4"
                      : "border-muted-2 size-2"
                  }`}
                />
              </span>

              <span className="min-w-0">
                <span
                  className={`block text-[14px] leading-tight ${
                    isLast ? "text-bone" : "text-muted"
                  }`}
                >
                  {job.shortRole}
                </span>
                <span className="text-muted-2 block text-[12px] leading-tight">
                  {job.company}
                </span>
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
