"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import type { ArchitectureLayer } from "@/data/site";

/**
 * Layered service topology for the featured project.
 *
 * Rendered rather than screenshotted: it shows the shape of the system without
 * exposing product UI, and it survives the product changing underneath it.
 */
export default function ArchitectureDiagram({
  layers,
}: {
  layers: ArchitectureLayer[];
}) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      gsap.from(".arch-row", {
        y: 24,
        autoAlpha: 0,
        duration: 0.7,
        ease: "expo.out",
        stagger: 0.12,
        scrollTrigger: { trigger: root.current, start: "top 78%", once: true },
      });

      // A pulse runs down the spine, tracing the path one request takes
      // through the system. Fades in and out so the loop has no hard cut.
      gsap
        .timeline({
          repeat: -1,
          repeatDelay: 1.6,
          delay: 1.2,
          scrollTrigger: { trigger: root.current, start: "top 80%" },
        })
        .fromTo(
          ".arch-pulse",
          { top: "0%", opacity: 0 },
          { opacity: 1, duration: 0.35 },
        )
        .to(".arch-pulse", { top: "100%", duration: 2.4, ease: "none" }, 0)
        .to(".arch-pulse", { opacity: 0, duration: 0.35 }, 2.05);
    },
    { scope: root },
  );

  return (
    <div ref={root} className="relative">
      {/* The spine the pulse travels down */}
      <div
        aria-hidden
        className="bg-line absolute top-0 bottom-0 left-[calc(0.5rem-0.5px)] hidden w-px md:block"
      >
        <div
          className="arch-pulse bg-accent absolute h-16 w-px"
          style={{ boxShadow: "0 0 12px 2px var(--color-accent)" }}
        />
      </div>

      <ol className="space-y-3">
        {layers.map((layer, i) => (
          <li key={layer.label} className="arch-row relative md:pl-12">
            {/* Node marker on the spine */}
            <span
              aria-hidden
              className="bg-ink border-accent/60 absolute top-6 left-0 hidden size-4 rounded-full border md:block"
            />

            <div className="border-line bg-ink-2/50 hover:border-line-soft rounded-lg border p-4 transition-colors duration-500 md:p-5">
              <div className="mb-3 flex items-baseline gap-3">
                <span className="label text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="label !text-bone">{layer.label}</span>
              </div>

              <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                {layer.nodes.map((node) => (
                  <div
                    key={node.name}
                    className="border-line bg-surface/60 rounded-md border px-3 py-2.5"
                  >
                    <p className="font-mono text-[12px] tracking-tight">{node.name}</p>
                    <p className="text-muted mt-1 text-[12px] leading-snug">
                      {node.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
