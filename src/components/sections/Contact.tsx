"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import SectionHeader from "@/components/ui/SectionHeader";
import Magnetic from "@/components/ui/Magnetic";
import Reveal from "@/components/ui/Reveal";
import { person, socials } from "@/data/site";

export default function Contact() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      gsap.from(".contact-detail", {
        y: 24,
        autoAlpha: 0,
        duration: 0.9,
        ease: "expo.out",
        stagger: 0.08,
        scrollTrigger: { trigger: ".contact-details", start: "top 88%", once: true },
      });

      gsap.to(".contact-glow", {
        yPercent: -25,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top bottom",
          end: "bottom bottom",
          scrub: true,
        },
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="contact"
      className="relative scroll-mt-24 overflow-hidden pt-14 pb-14 md:pt-20 md:pb-16"
    >
      <div
        aria-hidden
        className="contact-glow pointer-events-none absolute bottom-[-30%] left-1/2 -z-10 h-[60vh] w-[120vw] -translate-x-1/2 rounded-full blur-[130px]"
        style={{
          background: "radial-gradient(closest-side, var(--glow-soft), transparent 70%)",
        }}
      />

      <div className="container-x">
        <SectionHeader index="06" title="Contact" aside={person.availabilityNote} />

        <Reveal
          as="p"
          className="display mt-10 max-w-4xl text-[9vw] leading-[1.0] sm:text-[5.4vw] md:mt-14 md:text-[4vw]"
        >
          Got something worth building?
        </Reveal>

        <p className="text-muted mt-6 max-w-xl text-[15px] leading-relaxed">
          AI leadership roles, agent and platform consulting, or a team that needs
          its LLM features to survive contact with real users. I usually reply
          within a day.
        </p>

        {/* Secondary action — the full CV for anyone who wants the detail */}
        <a
          href={person.cvPath}
          download={person.cvFileName}
          data-cursor="PDF"
          className="group border-line hover:border-accent mt-8 inline-flex items-center gap-3 rounded-full border py-2.5 pr-2.5 pl-5 text-[13px] transition-colors duration-500"
        >
          Download CV
          <span className="bg-accent flex size-7 items-center justify-center rounded-full transition-transform duration-500 group-hover:translate-y-0.5">
            <svg viewBox="0 0 12 12" className="size-3 fill-none stroke-white stroke-[1.5]">
              <path d="M6 1.5v7M2.5 5.5 6 9l3.5-3.5M2 10.5h8" />
            </svg>
          </span>
        </a>

        {/* The main call to action */}
        <div className="mt-10 md:mt-14">
          <Magnetic strength={0.18}>
            <a
              href={`mailto:${person.email}`}
              data-cursor="Email"
              className="group inline-block"
            >
              <span className="display hover:text-accent block text-[8.4vw] leading-none break-all transition-colors duration-500 md:text-[5.6vw]">
                {person.email}
              </span>
              <span className="bg-accent mt-4 block h-px w-0 transition-[width] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full" />
            </a>
          </Magnetic>
        </div>

        {/* Details */}
        <div className="contact-details border-line mt-12 grid gap-10 border-t pt-10 md:mt-16 md:grid-cols-4">
          <div className="contact-detail">
            <p className="label mb-3">Phone</p>
            <a href={`tel:${person.phoneHref}`} className="link-wipe text-[15px]">
              {person.phone}
            </a>
          </div>

          <div className="contact-detail">
            <p className="label mb-3">Based in</p>
            <p className="text-[15px] leading-relaxed">
              {person.location}
              <br />
              <span className="text-muted">{person.country}</span>
            </p>
          </div>

          <div className="contact-detail">
            <p className="label mb-3">Address</p>
            <address className="text-muted text-[15px] leading-relaxed not-italic">
              {person.addressLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
          </div>

          <div className="contact-detail">
            <p className="label mb-3">Elsewhere</p>
            <ul className="space-y-2">
              {socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target={social.href.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer noopener"
                    className="link-wipe text-[15px]"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
