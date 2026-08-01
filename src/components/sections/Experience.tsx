"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import SectionHeader from "@/components/ui/SectionHeader";
import { experience } from "@/data/site";

export default function Experience() {
  const root = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Neither condition matches under reduced motion, so the callback never
      // runs and the cards are left alone — CSS reverts them to a plain stack.
      mm.add(
        {
          isDesktop: "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
          isMobile: "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const { isDesktop } = context.conditions as { isDesktop: boolean };

          if (!isDesktop) {
            gsap.from(".xp-card", {
              y: 30,
              autoAlpha: 0,
              duration: 0.8,
              ease: "expo.out",
              stagger: 0.1,
              scrollTrigger: { trigger: pin.current, start: "top 80%", once: true },
            });
            return;
          }

          const el = track.current!;
          const distance = () => Math.max(0, el.scrollWidth - window.innerWidth);

          const tween = gsap.to(el, {
            x: () => -distance(),
            ease: "none",
            scrollTrigger: {
              trigger: pin.current,
              pin: true,
              scrub: 0.8,
              start: "top top",
              end: () => `+=${distance()}`,
              invalidateOnRefresh: true,
              anticipatePin: 1,
            },
          });

          // Progress rail tracks the same scroll range.
          gsap.to(".xp-progress", {
            scaleX: 1,
            ease: "none",
            transformOrigin: "left center",
            scrollTrigger: {
              trigger: pin.current,
              scrub: true,
              start: "top top",
              end: () => `+=${distance()}`,
              invalidateOnRefresh: true,
            },
          });

          return () => {
            tween.scrollTrigger?.kill();
            tween.kill();
          };
        },
      );

      // Cards mount at different widths across breakpoints — recompute once
      // layout settles so the pin distance is measured against final widths.
      const id = window.setTimeout(() => ScrollTrigger.refresh(), 200);

      return () => {
        window.clearTimeout(id);
        mm.revert();
      };
    },
    { scope: root },
  );

  return (
    <section ref={root} id="experience" className="scroll-mt-24 py-14 md:py-20">
      <div className="container-x">
        <SectionHeader
          index="02"
          title="Experience"
          aside="Intern to tech lead to founder, 2019 — present"
        />
      </div>

      <div
        ref={pin}
        className="xp-pin relative mt-10 md:mt-0 md:flex md:h-screen md:items-center md:overflow-hidden"
      >
        <div
          ref={track}
          className="xp-track container-x flex flex-col gap-5 md:h-auto md:w-max md:flex-row md:items-stretch md:gap-6"
        >
          {experience.map((job, i) => (
            <article
              key={`${job.company}-${job.period}`}
              className={`xp-card group border-line relative flex flex-col justify-between rounded-lg border p-6 transition-colors duration-500 md:w-[min(30rem,78vw)] md:shrink-0 md:p-9 ${
                job.current
                  ? "bg-surface hover:border-accent/60"
                  : "bg-ink-2/40 hover:border-line-soft hover:bg-surface"
              }`}
            >
              <div>
                <div className="mb-8 flex items-start justify-between gap-4">
                  {/* Ascends with the scroll direction, matching every other
                      numbered section. The cards run newest-first, so 01 is
                      the current role rather than the earliest one. */}
                  <span className="label text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {job.current && (
                    <span className="flex items-center gap-2">
                      <span className="size-1.5 rounded-full bg-emerald-500" />
                      <span className="label !text-bone">Now</span>
                    </span>
                  )}

                  {/* Prodigit and DigiFront overlap on purpose — both remote,
                      different countries. The badge says so up front. */}
                  {job.concurrent && (
                    <span className="border-line text-muted rounded-full border px-2.5 py-1 font-mono text-[9px] tracking-[0.12em] uppercase">
                      Concurrent
                    </span>
                  )}
                </div>

                <p className="label mb-3">{job.period}</p>

                <h3 className="display text-[8vw] leading-[0.95] sm:text-[5vw] md:text-[2.3rem]">
                  {job.role}
                </h3>

                <p className="mt-3 text-[15px]">
                  {job.company}
                  <span className="text-muted"> · {job.location}</span>
                </p>

                <p className="text-muted mt-6 max-w-md text-[14px] leading-relaxed">
                  {job.summary}
                </p>

                <ul className="mt-6 space-y-2.5">
                  {job.highlights.map((point) => (
                    <li
                      key={point}
                      className="text-muted flex gap-3 text-[13.5px] leading-relaxed"
                    >
                      <span className="bg-muted-2 mt-2 size-1 shrink-0 rounded-full" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              <ul className="border-line mt-8 flex flex-wrap gap-2 border-t pt-6">
                {job.stack.map((tech) => (
                  <li
                    key={tech}
                    className="border-line text-muted rounded-full border px-2.5 py-1 font-mono text-[10px] tracking-wide uppercase"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </article>
          ))}

          {/* Trailing gutter. A real element rather than padding-right, so it
              counts toward scrollWidth and the last card doesn't finish flush
              against the viewport edge. */}
          <div aria-hidden className="hidden w-[10vw] shrink-0 md:block" />
        </div>

        {/* Horizontal progress rail */}
        <div className="bg-line absolute inset-x-0 bottom-16 mx-10 hidden h-px md:block xl:mx-16">
          <div className="xp-progress bg-accent h-px w-full origin-left scale-x-0" />
        </div>
      </div>
    </section>
  );
}
