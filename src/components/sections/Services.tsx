"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import SectionHeader from "@/components/ui/SectionHeader";
import { services } from "@/data/site";

export default function Services() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      gsap.from(".service-row", {
        y: 30,
        autoAlpha: 0,
        duration: 0.9,
        ease: "expo.out",
        stagger: 0.07,
        scrollTrigger: { trigger: ".service-list", start: "top 82%", once: true },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="services" className="container-x scroll-mt-24 py-14 md:py-20">
      <SectionHeader
        index="05"
        title="What I do"
        aside="From architecture through to the code that ships"
      />

      <div className="service-list mt-10 md:mt-14">
        {services.map((service, i) => (
          <article
            key={service.title}
            className="service-row group border-line relative grid gap-4 border-t py-8 md:grid-cols-12 md:gap-10 md:py-10"
          >
            {/* Hover wash */}
            <span
              aria-hidden
              className="from-accent/[0.07] pointer-events-none absolute inset-x-[-1.25rem] inset-y-0 -z-10 bg-gradient-to-r to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 md:inset-x-[-2.5rem]"
            />

            <span className="label group-hover:text-accent transition-colors duration-500 md:col-span-1">
              {String(i + 1).padStart(2, "0")}
            </span>

            <h3 className="text-[22px] leading-tight tracking-tight md:col-span-5 md:text-[26px]">
              {service.title}
            </h3>

            <p className="text-muted max-w-xl text-[15px] leading-relaxed md:col-span-6">
              {service.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
