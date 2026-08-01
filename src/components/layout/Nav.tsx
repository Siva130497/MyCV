"use client";

import { useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { nav, person, socials } from "@/data/site";
import ThemeToggle from "@/components/providers/ThemeToggle";

/**
 * Fixed header that hides on scroll-down and returns on scroll-up, plus a
 * full-screen overlay menu on small screens.
 */
export default function Nav() {
  const header = useRef<HTMLElement>(null);
  const overlay = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  useGSAP(
    () => {
      const el = header.current;
      if (!el || prefersReducedMotion()) return;

      gsap.set(el, { y: 0 });

      const trigger = ScrollTrigger.create({
        trigger: document.body,
        start: "top -120",
        end: 99999,
        onUpdate: (self) => {
          // Never hide the bar while the mobile menu is open.
          if (overlay.current?.dataset.open === "true") return;
          gsap.to(el, {
            y: self.direction === 1 ? -110 : 0,
            duration: 0.55,
            ease: "power3.out",
            overwrite: true,
          });
        },
        // Colour lives in CSS so it follows a theme switch; GSAP only decides
        // *when* the scrolled state applies, never what colour it is.
        onToggle: (self) => el.classList.toggle("is-scrolled", self.isActive),
      });

      // Highlight whichever section is currently under the header.
      //
      // Deliberately one updater rather than a ScrollTrigger per section: with
      // per-section triggers the initial refresh fires them in document order
      // and the last one to report active wins, so the page loads with the
      // final section highlighted. Reading positions directly is unambiguous.
      const sections = nav
        .map((item) => document.querySelector<HTMLElement>(item.href))
        .filter((el): el is HTMLElement => Boolean(el));

      let last: string | null = null;

      const spy = ScrollTrigger.create({
        trigger: document.body,
        start: 0,
        end: "max",
        onUpdate: () => {
          const line = window.innerHeight * 0.35;
          let current: string | null = null;

          for (const section of sections) {
            if (section.getBoundingClientRect().top <= line) {
              current = `#${section.id}`;
            }
          }

          // Only re-render when the answer actually changes.
          if (current !== last) {
            last = current;
            setActive(current);
          }
        },
      });

      return () => {
        trigger.kill();
        spy.kill();
      };
    },
    { scope: header },
  );

  // Animate the overlay panel and its links whenever `open` flips.
  useGSAP(
    () => {
      const el = overlay.current;
      if (!el) return;

      el.dataset.open = String(open);

      if (prefersReducedMotion()) {
        gsap.set(el, { autoAlpha: open ? 1 : 0, yPercent: 0 });
        return;
      }

      if (open) {
        gsap
          .timeline()
          .set(el, { autoAlpha: 1 })
          .fromTo(el, { yPercent: -100 }, { yPercent: 0, duration: 0.7, ease: "expo.inOut" })
          .fromTo(
            ".menu-item",
            { yPercent: 110 },
            { yPercent: 0, duration: 0.8, ease: "expo.out", stagger: 0.06 },
            "-=0.3",
          )
          .fromTo(".menu-foot", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, "-=0.4");
      } else {
        gsap.to(el, {
          yPercent: -100,
          duration: 0.6,
          ease: "expo.inOut",
          onComplete: () => gsap.set(el, { autoAlpha: 0 }),
        });
      }
    },
    { scope: overlay, dependencies: [open] },
  );

  // Lock the page behind the overlay.
  useGSAP(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        ref={header}
        className="site-nav fixed inset-x-0 top-0 z-50 border-b"
      >
        <div className="container-x flex h-16 items-center justify-between md:h-20">
          <a
            href="#top"
            className="group flex items-center gap-2.5"
            aria-label="Back to top"
          >
            <span className="bg-accent size-1.5 rounded-full transition-transform duration-500 group-hover:scale-150" />
            <span className="font-mono text-[13.5px] tracking-[0.13em] uppercase">
              {person.firstName}
              <span className="text-muted">.dev</span>
            </span>
          </a>

          <nav className="hidden items-center gap-7 md:flex" aria-label="Sections">
            {nav.map((item) => {
              const isActive = active === item.href;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "true" : undefined}
                  className={`relative text-[15px] tracking-tight transition-colors duration-300 ${
                    isActive ? "text-bone" : "text-muted hover:text-bone"
                  }`}
                >
                  {item.label}
                  <span
                    aria-hidden
                    className={`bg-accent absolute -bottom-1.5 left-0 h-px w-full origin-left transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      isActive ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            {person.available && (
              <span className="mr-1 hidden items-center gap-2 lg:flex">
                <span className="relative flex size-1.5">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-70" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
                </span>
                <span className="label !text-bone">Available</span>
              </span>
            )}

            <ThemeToggle className="relative z-[61]" />

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="border-line hover:border-bone relative z-[61] flex size-9 items-center justify-center rounded-full border transition-colors duration-300 md:hidden"
            >
              <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
              <span className="relative block h-3 w-4">
                <span
                  className={`bg-bone absolute left-0 block h-px w-4 transition-all duration-300 ${
                    open ? "top-1.5 rotate-45" : "top-0.5"
                  }`}
                />
                <span
                  className={`bg-bone absolute left-0 block h-px w-4 transition-all duration-300 ${
                    open ? "top-1.5 -rotate-45" : "top-2.5"
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      <div
        ref={overlay}
        id="mobile-menu"
        className="bg-ink-2 invisible fixed inset-0 z-[55] flex flex-col justify-between px-5 pt-24 pb-8 opacity-0 md:hidden"
      >
        <nav className="flex flex-col gap-1" aria-label="Sections">
          {nav.map((item) => (
            <span key={item.href} className="overflow-hidden">
              <a
                href={item.href}
                onClick={() => setOpen(false)}
                className="menu-item flex items-baseline gap-4 py-2"
              >
                <span className="label">{item.index}</span>
                <span className="display text-[13vw] leading-none">{item.label}</span>
              </a>
            </span>
          ))}
        </nav>

        <div className="menu-foot border-line space-y-3 border-t pt-6">
          <a href={`mailto:${person.email}`} className="link-wipe block text-sm">
            {person.email}
          </a>
          <div className="flex gap-5">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer noopener"
                className="label hover:text-bone transition-colors"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
