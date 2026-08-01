"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import SectionHeader from "@/components/ui/SectionHeader";
import Reveal from "@/components/ui/Reveal";
import ArchitectureDiagram from "@/components/sections/ArchitectureDiagram";
import { projects, sideProjects, type Project } from "@/data/site";

/** Number + rule + year, shared by every project layout. */
function ProjectIndex({ index, year }: { index: number; year: string }) {
  return (
    <div className="mb-6 flex items-center gap-4">
      <span className="label text-accent">{String(index + 1).padStart(2, "0")}</span>
      <span className="bg-line h-px flex-1" />
      <span className="label">{year}</span>
    </div>
  );
}

function StackList({ stack }: { stack: string[] }) {
  return (
    <dd className="flex flex-wrap gap-2">
      {stack.map((tech) => (
        <span
          key={tech}
          className="border-line text-muted rounded-full border px-2.5 py-1 font-mono text-[10px] tracking-wide uppercase"
        >
          {tech}
        </span>
      ))}
    </dd>
  );
}

function VisitLink({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      data-cursor="Visit"
      className="group border-line hover:border-accent mt-9 inline-flex items-center gap-3 rounded-full border py-2.5 pr-2.5 pl-5 text-[13px] transition-colors duration-500"
    >
      Visit live site
      <span className="bg-accent flex size-7 items-center justify-center rounded-full transition-transform duration-500 group-hover:translate-x-0.5">
        <svg viewBox="0 0 12 12" className="size-3 fill-none stroke-white stroke-[1.5]">
          <path d="M2.5 9.5 9.5 2.5M4 2.5h5.5V8" />
        </svg>
      </span>
    </a>
  );
}

/**
 * The flagship. Gets the full width, an architecture diagram instead of a
 * screenshot, and room for the engineering notes that make the case.
 */
function FeaturedProject({ project, index }: { project: Project; index: number }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      gsap.from(".featured-meta > *", {
        y: 22,
        autoAlpha: 0,
        duration: 0.9,
        ease: "expo.out",
        stagger: 0.07,
        scrollTrigger: { trigger: root.current, start: "top 75%", once: true },
      });

      gsap.from(".featured-note", {
        y: 20,
        autoAlpha: 0,
        duration: 0.8,
        ease: "expo.out",
        stagger: 0.08,
        scrollTrigger: { trigger: ".featured-notes", start: "top 85%", once: true },
      });
    },
    { scope: root },
  );

  return (
    <article
      ref={root}
      className="border-line border-t py-11 md:py-16"
      aria-labelledby={`project-${project.slug}`}
    >
      <ProjectIndex index={index} year={project.year} />

      <div className="featured-meta grid gap-8 md:grid-cols-12 md:gap-14">
        <div className="md:col-span-6">
          <div className="mb-4 flex items-center gap-3">
            <span className="bg-accent size-1.5 rounded-full" />
            <span className="label !text-bone">Current focus</span>
          </div>

          <h3
            id={`project-${project.slug}`}
            className="display text-[13vw] leading-[0.9] sm:text-[8vw] md:text-[4.6rem]"
          >
            {project.name}
          </h3>

          <p className="label mt-4">{project.category}</p>
        </div>

        <div className="md:col-span-6">
          <p className="text-bone max-w-xl text-[17px] leading-[1.6]">
            {project.summary}
          </p>
          <p className="text-muted mt-5 max-w-xl text-[15px] leading-[1.75]">
            {project.description}
          </p>

          <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
            <div>
              <dt className="label mb-2">Role</dt>
              <dd className="text-[14px]">{project.role}</dd>
            </div>
            <div>
              <dt className="label mb-2">Built with</dt>
              <StackList stack={project.stack} />
            </div>
          </dl>
        </div>
      </div>

      {project.architecture && (
        <div className="mt-10 md:mt-14">
          <p className="label mb-6">System topology</p>
          <ArchitectureDiagram layers={project.architecture} />
        </div>
      )}

      {project.notes && (
        <div className="featured-notes mt-10 md:mt-14">
          <p className="label mb-6">Engineering decisions</p>
          <ul className="grid gap-px md:grid-cols-2">
            {project.notes.map((note, i) => (
              <li
                key={note}
                className="featured-note border-line hover:bg-surface/50 border-t p-6 transition-colors duration-500 md:p-7"
              >
                <span className="label text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-muted mt-3 text-[14.5px] leading-relaxed">{note}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}

/** Standard block: screenshot on one side, detail on the other, alternating. */
function ProjectBlock({ project, index }: { project: Project; index: number }) {
  const root = useRef<HTMLElement>(null);
  const flipped = index % 2 === 1;
  const hasImage = project.images.length > 0;

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      if (hasImage) {
        // Frame wipes open, and the image inside drifts against the scroll so
        // the crop keeps changing as the block travels up the viewport.
        gsap.from(".project-frame", {
          clipPath: "inset(0% 0% 100% 0%)",
          duration: 1.4,
          ease: "expo.out",
          scrollTrigger: { trigger: root.current, start: "top 80%", once: true },
        });

        gsap.fromTo(
          ".project-img",
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );

        if (root.current?.querySelector(".project-inset")) {
          gsap.from(".project-inset", {
            y: 40,
            autoAlpha: 0,
            duration: 1.1,
            ease: "expo.out",
            scrollTrigger: { trigger: root.current, start: "top 62%", once: true },
          });
        }
      } else {
        gsap.from(".project-spec-row", {
          y: 18,
          autoAlpha: 0,
          duration: 0.8,
          ease: "expo.out",
          stagger: 0.07,
          scrollTrigger: { trigger: root.current, start: "top 80%", once: true },
        });
      }

      gsap.from(".project-meta > *", {
        y: 22,
        autoAlpha: 0,
        duration: 0.9,
        ease: "expo.out",
        stagger: 0.07,
        scrollTrigger: { trigger: root.current, start: "top 72%", once: true },
      });
    },
    { scope: root, dependencies: [hasImage] },
  );

  const visual = hasImage ? (
    <div className="relative">
      <div className="project-frame border-line bg-surface relative aspect-[16/10] overflow-hidden rounded-lg border">
        <Image
          src={project.images[0]}
          alt={`${project.name} — ${project.summary}`}
          fill
          sizes="(max-width: 768px) 92vw, 52vw"
          className="project-img scale-[1.12] object-cover object-top"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t via-transparent to-transparent"
          style={{ backgroundImage: "linear-gradient(to top, var(--img-scrim), transparent 55%)" }}
        />
      </div>

      {/* Second screenshot, tucked under the first */}
      {project.images[1] && (
        <div
          style={{ boxShadow: "var(--card-shadow)" }}
          className={`project-inset border-line bg-surface absolute -bottom-10 hidden aspect-[16/10] w-[42%] overflow-hidden rounded-lg border lg:block ${
            flipped ? "-left-8" : "-right-8"
          }`}
        >
          <Image
            src={project.images[1]}
            alt={`${project.name} — secondary view`}
            fill
            sizes="24vw"
            className="object-cover object-top"
          />
        </div>
      )}
    </div>
  ) : (
    // No screenshot to show — a spec panel carries the block instead of a
    // placeholder image, and gives the engineering note somewhere to live.
    <div className="border-line bg-ink-2/50 rounded-lg border">
      <div className="border-line flex items-center justify-between border-b px-5 py-3">
        <span className="label">{project.slug}</span>
        <span className="flex gap-1.5" aria-hidden>
          <span className="bg-line size-2 rounded-full" />
          <span className="bg-line size-2 rounded-full" />
          <span className="bg-accent/70 size-2 rounded-full" />
        </span>
      </div>

      <dl className="p-5 md:p-6">
        {[
          ["Type", project.category],
          ["Year", project.year],
          ["Role", project.role],
        ].map(([term, value]) => (
          <div
            key={term}
            className="project-spec-row border-line-soft grid grid-cols-[6rem_1fr] gap-4 border-b py-3 first:pt-0"
          >
            <dt className="label">{term}</dt>
            <dd className="text-[14px]">{value}</dd>
          </div>
        ))}

        <div className="project-spec-row grid grid-cols-[6rem_1fr] gap-4 py-3">
          <dt className="label">Stack</dt>
          <StackList stack={project.stack} />
        </div>

        {project.notes?.[0] && (
          <p className="project-spec-row text-muted border-line-soft mt-2 border-t pt-4 text-[13.5px] leading-relaxed">
            {project.notes[0]}
          </p>
        )}
      </dl>
    </div>
  );

  return (
    <article
      ref={root}
      className="border-line grid items-center gap-10 border-t py-16 md:grid-cols-12 md:gap-14 md:py-24 lg:gap-20"
      aria-labelledby={`project-${project.slug}`}
    >
      <div className={`md:col-span-7 ${flipped ? "md:order-2 md:col-start-6" : ""}`}>
        {visual}
      </div>

      <div
        className={`project-meta md:col-span-5 ${flipped ? "md:order-1 md:col-start-1" : ""}`}
      >
        <ProjectIndex index={index} year={project.year} />

        <h3
          id={`project-${project.slug}`}
          className="display text-[10vw] leading-[0.92] sm:text-[6vw] md:text-[2.6rem] lg:text-[3.2rem]"
        >
          {project.name}
        </h3>

        <p className="label mt-4">{project.category}</p>

        <p className="text-muted mt-6 max-w-lg text-[15px] leading-[1.75]">
          {project.description}
        </p>

        {hasImage && (
          <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
            <div>
              <dt className="label mb-2">Role</dt>
              <dd className="text-[14px]">{project.role}</dd>
            </div>
            <div>
              <dt className="label mb-2">Built with</dt>
              <StackList stack={project.stack} />
            </div>
          </dl>
        )}

        {project.href && <VisitLink href={project.href} />}
      </div>
    </article>
  );
}

export default function Projects() {
  return (
    <section id="work" className="container-x scroll-mt-24 py-14 md:py-20">
      <SectionHeader
        index="04"
        title="Selected work"
        aside="AI platform work, and the products that came before it"
      />

      <Reveal
        as="p"
        className="display mt-16 max-w-3xl text-[7vw] leading-[1.05] sm:text-[4.2vw] md:mt-24 md:text-[3rem]"
      >
        An AI operating system, two tools built for people on shift, and the
        client platforms that taught me how to ship.
      </Reveal>

      <div className="mt-10 md:mt-14">
        {projects.map((project, i) =>
          project.featured ? (
            <FeaturedProject key={project.slug} project={project} index={i} />
          ) : (
            <ProjectBlock key={project.slug} project={project} index={i} />
          ),
        )}
      </div>

      <SideProjects />
    </section>
  );
}

/** Earlier hardware and utility builds — shown, but not given a full block. */
function SideProjects() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      gsap.from(".side-project", {
        y: 22,
        autoAlpha: 0,
        duration: 0.85,
        ease: "expo.out",
        stagger: 0.1,
        scrollTrigger: { trigger: root.current, start: "top 85%", once: true },
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="border-line border-t pt-10 md:pt-14">
      <p className="label mb-8">Also built</p>

      <div className="grid gap-px md:grid-cols-2">
        {sideProjects.map((project) => (
          <article
            key={project.name}
            className="side-project border-line hover:bg-surface/50 border-t p-6 transition-colors duration-500 md:p-8"
          >
            <h3 className="text-[20px] leading-tight tracking-tight md:text-[22px]">
              {project.name}
            </h3>
            <p className="label mt-3">{project.category}</p>
            <p className="text-muted mt-5 max-w-lg text-[14.5px] leading-relaxed">
              {project.description}
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {project.stack.map((tech) => (
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
      </div>
    </div>
  );
}
