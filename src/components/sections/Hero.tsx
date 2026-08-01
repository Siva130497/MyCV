"use client";

import { useRef } from "react";
import {
  gsap,
  SplitText,
  useGSAP,
  prefersReducedMotion,
  INTRO_DELAY,
} from "@/lib/gsap";
import { person, yearsOfExperience, CAREER_START_YEAR } from "@/data/site";

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduced = prefersReducedMotion();

      // Everything starts hidden via CSS class; make it visible before tweening.
      gsap.set(".hero-fade, .hero-name", { visibility: "visible" });

      if (reduced) return;

      const splits = gsap.utils
        .toArray<HTMLElement>(".hero-name")
        .map((el) =>
          SplitText.create(el, { type: "chars", mask: "chars", autoSplit: true }),
        );

      const tl = gsap.timeline({ delay: INTRO_DELAY });

      tl.from(
        splits.flatMap((s) => s.chars),
        {
          yPercent: 115,
          duration: 1.25,
          ease: "expo.out",
          stagger: { each: 0.028, from: "start" },
        },
      )
        .from(
          ".hero-rule",
          { scaleX: 0, duration: 1.1, ease: "expo.inOut", transformOrigin: "left center" },
          "-=0.85",
        )
        .from(
          ".hero-fade",
          { y: 24, autoAlpha: 0, duration: 0.9, stagger: 0.08, ease: "expo.out" },
          "-=0.8",
        )
        .from(".hero-glow", { autoAlpha: 0, scale: 0.6, duration: 1.6 }, 0);

      // Drift the headline up and fade the whole block as the page scrolls off.
      gsap.to(".hero-parallax", {
        yPercent: -18,
        autoAlpha: 0.15,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(".hero-glow", {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      return () => splits.forEach((s) => s.revert());
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="top"
      className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden pt-24 pb-8 md:pt-28 md:pb-12"
    >
      {/* Faint grid, then ambient light on top of it */}
      <div
        aria-hidden
        className="hero-grid pointer-events-none absolute inset-0 -z-20"
      />
      <div
        aria-hidden
        className="hero-glow pointer-events-none absolute top-[-20%] left-1/2 -z-10 h-[70vh] w-[110vw] -translate-x-1/2 rounded-full opacity-60 blur-[120px]"
        style={{
          background:
            "radial-gradient(closest-side, var(--glow), var(--glow-soft) 60%, transparent)",
        }}
      />

      <div className="container-x hero-parallax flex flex-1 flex-col justify-between gap-10 md:gap-12">
        {/* Top meta row */}
        <div className="flex flex-wrap items-start justify-between gap-6">
          <p className="hero-fade label reveal-pending leading-relaxed">
            {person.role}
            <br />
            <span className="text-muted-2">{person.location} · UK</span>
          </p>

          <p className="hero-fade label reveal-pending hidden text-right sm:block">
            {CAREER_START_YEAR} — Present
            <br />
            <span className="text-muted-2">{yearsOfExperience()} years in</span>
          </p>
        </div>

        {/* The name */}
        <div>
          <h1 className="sr-only">
            {person.fullName} — {person.role}
          </h1>

          {/* Sized so the longer of the two names still fits on one line —
              "Meeneswaran" is the constraint, not "Vithurushan". */}
          <div aria-hidden className="display text-[12.6vw] leading-[0.86] md:text-[11.2vw]">
            <div className="hero-name reveal-pending">{person.firstName}</div>
            <div className="hero-name text-outline reveal-pending">{person.lastName}</div>
          </div>
        </div>

        {/* Bottom row */}
        <div>
          <div className="hero-rule rule mb-7" />

          <div className="grid gap-8 sm:grid-cols-12 sm:items-end">
            <p className="hero-fade reveal-pending text-muted max-w-md text-[15px] leading-relaxed sm:col-span-6 md:col-span-5">
              I build <span className="text-bone">agentic AI systems</span> — LLM
              orchestration, multi-agent runtimes, and the{" "}
              <span className="serif-accent text-bone">
                permission, cost and safety
              </span>{" "}
              layers that let them run without supervision.
            </p>

            <div className="hero-fade reveal-pending sm:col-span-3 md:col-span-4">
              <p className="label mb-2">Currently</p>
              <p className="text-[15px] leading-snug">
                Founder &amp; {person.role}
                <br />
                <span className="text-muted">at {person.company}</span>
              </p>
            </div>

            <div className="hero-fade reveal-pending sm:col-span-3 sm:text-right">
              <a
                href="#work"
                data-cursor="Scroll"
                className="group border-line hover:border-accent inline-flex items-center gap-3 rounded-full border py-2.5 pr-2.5 pl-5 text-[13px] transition-colors duration-500"
              >
                Selected work
                <span className="bg-accent flex size-7 items-center justify-center rounded-full transition-transform duration-500 group-hover:translate-y-0.5">
                  <svg viewBox="0 0 12 12" className="size-3 fill-none stroke-white stroke-[1.5]">
                    <path d="M6 1.5v9M2 7l4 4 4-4" />
                  </svg>
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
