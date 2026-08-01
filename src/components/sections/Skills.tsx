"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import SectionHeader from "@/components/ui/SectionHeader";
import { marquee, skillGroups } from "@/data/site";

/** One infinite strip. The list is rendered twice so -50% loops seamlessly. */
function Marquee({
  items,
  reverse = false,
  speed = 28,
}: {
  items: readonly string[];
  reverse?: boolean;
  speed?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      // Both copies are identical, so -50% and 0% are visually the same frame:
      // the loop restarts without a seam whichever direction it runs.
      const tween = gsap.fromTo(
        ref.current,
        { xPercent: reverse ? -50 : 0 },
        {
          xPercent: reverse ? 0 : -50,
          ease: "none",
          duration: speed,
          repeat: -1,
        },
      );

      return () => tween.kill();
    },
    { scope: ref, dependencies: [reverse, speed] },
  );

  return (
    <div className="flex overflow-hidden" aria-hidden>
      <div ref={ref} className="flex shrink-0 will-change-transform">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center">
            {items.map((item) => (
              <span
                key={`${copy}-${item}`}
                className="display text-muted-2 flex shrink-0 items-center gap-8 px-8 text-[7vw] whitespace-nowrap md:text-[4vw]"
              >
                {item}
                <span className="bg-accent size-1.5 shrink-0 rounded-full" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Skills() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      gsap.from(".skill-group", {
        y: 28,
        autoAlpha: 0,
        duration: 0.9,
        ease: "expo.out",
        stagger: 0.09,
        scrollTrigger: { trigger: ".skill-grid", start: "top 82%", once: true },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="skills" className="scroll-mt-24 py-14 md:py-20">
      <div className="container-x">
        <SectionHeader
          index="03"
          title="Stack"
          aside="In production use, not just read about"
        />
      </div>

      <div className="marquee-band border-line mt-10 space-y-1 border-y py-6 md:mt-14 md:py-9">
        <Marquee items={marquee} speed={40} />
        <Marquee items={[...marquee].reverse()} reverse speed={46} />
      </div>

      {/* Eight groups: 4 columns divides evenly, so no row ends with a
          half-width rule hanging off an empty cell. */}
      <div className="container-x skill-grid mt-10 grid gap-px md:mt-14 md:grid-cols-2 xl:grid-cols-4">
        {skillGroups.map((group, i) => (
          <div
            key={group.title}
            className="skill-group border-line hover:bg-surface/60 border-t p-6 transition-colors duration-500 md:p-8"
          >
            <div className="mb-6 flex items-baseline gap-3">
              <span className="label text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-[15px] tracking-tight">{group.title}</h3>
            </div>

            <ul className="flex flex-wrap gap-x-2 gap-y-2">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="border-line text-muted hover:border-accent/50 hover:text-bone rounded-full border px-3 py-1.5 text-[13px] transition-colors duration-300"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
