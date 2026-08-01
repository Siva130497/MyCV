"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import SectionHeader from "@/components/ui/SectionHeader";
import Reveal from "@/components/ui/Reveal";
import CareerLadder from "@/components/sections/CareerLadder";
import { about, education, interests, languages, stats } from "@/data/site";

export default function About() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      // Lead statement: words brighten from dim to full as it scrolls past.
      const lead = root.current?.querySelector<HTMLElement>(".about-lead");
      let split: SplitText | undefined;

      if (lead) {
        split = SplitText.create(lead, { type: "words" });
        gsap.set(split.words, { opacity: 0.16 });
        gsap.to(split.words, {
          opacity: 1,
          ease: "none",
          stagger: 0.4,
          scrollTrigger: {
            trigger: lead,
            start: "top 78%",
            end: "bottom 55%",
            scrub: true,
          },
        });
      }

      gsap.from(".about-stat", {
        y: 26,
        autoAlpha: 0,
        duration: 0.9,
        ease: "expo.out",
        stagger: 0.08,
        scrollTrigger: { trigger: ".about-stats", start: "top 85%", once: true },
      });

      // Count each figure up from 1. The markup ships with the final value so
      // it's correct without JS; we reset to 1 here, before the trigger fires,
      // so there's no flash of the answer followed by a jump back.
      gsap.utils.toArray<HTMLElement>(".stat-value").forEach((el) => {
        const target = Number(el.dataset.value);
        const suffix = el.dataset.suffix ?? "";
        if (!Number.isFinite(target)) return;

        const counter = { value: 1 };
        el.textContent = `1${suffix}`;

        gsap.to(counter, {
          value: target,
          duration: 1.5,
          ease: "power2.out",
          scrollTrigger: { trigger: ".about-stats", start: "top 85%", once: true },
          onUpdate: () => {
            el.textContent = `${Math.round(counter.value)}${suffix}`;
          },
        });
      });

      gsap.from(".about-row", {
        y: 20,
        autoAlpha: 0,
        duration: 0.8,
        ease: "expo.out",
        stagger: 0.07,
        scrollTrigger: { trigger: ".about-rows", start: "top 85%", once: true },
      });

      return () => split?.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="about" className="container-x scroll-mt-24 py-14 md:py-20">
      <SectionHeader
        index="01"
        title="About"
        aside="Full-stack for seven years, AI systems now"
      />

      <div className="mt-10 md:mt-14">
        <p className="about-lead display max-w-4xl text-[7vw] leading-[1.02] sm:text-[4.6vw] md:text-[3.4vw]">
          {about.lead}
        </p>
      </div>

      <div className="mt-10 grid gap-x-16 gap-y-8 md:mt-14 md:grid-cols-12">
        <div className="md:col-span-4 md:sticky md:top-28 md:self-start">
          <p className="label mb-4">Profile</p>
          <p className="serif-accent text-muted-2 text-2xl leading-snug">
            Intern to tech lead,
            <br />
            then founder.
          </p>

          <CareerLadder />
        </div>

        <div className="space-y-5 md:col-span-7 md:col-start-6">
          {about.paragraphs.map((text, i) => (
            <Reveal
              key={i}
              as="p"
              className="text-muted max-w-2xl text-[15px] leading-[1.75] md:text-base"
              start="top 90%"
            >
              {text}
            </Reveal>
          ))}
        </div>
      </div>

      {/* Numbers — values count up from 1 when the row scrolls into view */}
      <div className="about-stats border-line mt-12 grid grid-cols-2 gap-px border-t md:mt-14 md:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="about-stat border-line flex flex-col items-center border-b border-r px-4 py-8 text-center last:border-r-0 md:py-10"
          >
            <div
              className="stat-value display text-[13vw] leading-none tabular-nums sm:text-[7vw] md:text-[4.2vw]"
              data-value={stat.value}
              data-suffix={stat.suffix}
            >
              {stat.value}
              {stat.suffix}
            </div>
            <div className="label mt-3 max-w-[14rem] leading-relaxed">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Education + interests */}
      <div className="about-rows mt-12 grid gap-12 md:mt-16 md:grid-cols-12">
        <div className="md:col-span-7">
          <p className="label mb-8">Education</p>
          <ul>
            {education.map((item) => (
              <li
                key={item.qualification}
                className="about-row border-line grid grid-cols-1 gap-1 border-t py-5 sm:grid-cols-[1fr_auto] sm:items-baseline sm:gap-8"
              >
                <div>
                  <p className="text-[15px] leading-snug">{item.qualification}</p>
                  <p className="text-muted mt-1 text-[13px]">
                    {item.institution} · {item.location}
                  </p>
                </div>
                {item.period !== "—" && (
                  <span className="label shrink-0 sm:text-right">{item.period}</span>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-4 md:col-start-9">
          <p className="label mb-8">Beyond the editor</p>
          <ul>
            {interests.map((item) => (
              <li
                key={item}
                className="about-row border-line flex items-baseline gap-3 border-t py-4 text-[15px]"
              >
                <span className="bg-accent mt-2 size-1 shrink-0 rounded-full" />
                {item}
              </li>
            ))}
          </ul>

          <p className="label mt-12 mb-4">Languages</p>
          <ul className="about-row flex flex-wrap gap-2">
            {languages.map((language) => (
              <li
                key={language}
                className="border-line text-muted rounded-full border px-3 py-1.5 text-[13px]"
              >
                {language}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
