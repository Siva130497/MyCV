"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, SplitText, useGSAP, prefersReducedMotion } from "@/lib/gsap";

type RevealProps = {
  children: ReactNode;
  /** Element to render. Defaults to a div — pass "h2", "p", etc. */
  as?: ElementType;
  /** Granularity of the reveal. Chars are for short display type only. */
  type?: "lines" | "words" | "chars";
  className?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
  /** Fire on mount instead of when scrolled into view. */
  immediate?: boolean;
  /** How far into the viewport the element must be before it plays. */
  start?: string;
};

/** Fonts loading is best-effort — never leave text hidden waiting on it. */
const fontsReady = (): Promise<unknown> => {
  if (typeof document === "undefined" || !document.fonts) return Promise.resolve();
  if (document.fonts.status === "loaded") return Promise.resolve();
  return Promise.race([
    document.fonts.ready,
    new Promise((resolve) => setTimeout(resolve, 1500)),
  ]);
};

/**
 * Masked text reveal — each line (or word/char) slides up from behind a clip.
 *
 * Splitting waits for webfonts, otherwise line breaks get measured against the
 * fallback face and reflow when the real font swaps in. `autoSplit` re-splits
 * and replays on resize.
 *
 * The element ships hidden and is made visible at split time so there's no
 * flash of unrevealed text. Reduced motion and no-JS both fall back to plain
 * visible text.
 */
export default function Reveal({
  children,
  as: Tag = "div",
  type = "lines",
  className = "",
  delay = 0,
  stagger,
  duration = 1.1,
  immediate = false,
  start = "top 85%",
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      if (prefersReducedMotion()) {
        gsap.set(el, { visibility: "visible" });
        return;
      }

      const unit =
        type === "chars" ? "chars" : type === "words" ? "words" : "lines";
      const step =
        stagger ?? (unit === "chars" ? 0.022 : unit === "words" ? 0.045 : 0.09);

      let split: SplitText | undefined;
      let cancelled = false;

      fontsReady().then(() => {
        if (cancelled || !ref.current) return;

        split = SplitText.create(el, {
          type: unit === "lines" ? "lines" : `lines,${unit}`,
          mask: unit === "lines" ? "lines" : unit,
          autoSplit: true,
          linesClass: "split-line",
          onSplit: (self) => {
            const targets =
              unit === "chars"
                ? self.chars
                : unit === "words"
                  ? self.words
                  : self.lines;

            return gsap.from(targets, {
              yPercent: 110,
              duration,
              ease: "expo.out",
              stagger: step,
              delay,
              scrollTrigger: immediate
                ? undefined
                : { trigger: el, start, once: true },
            });
          },
        });

        // Masks are in place now, so revealing the element shows nothing yet.
        gsap.set(el, { visibility: "visible" });
      });

      return () => {
        cancelled = true;
        split?.revert();
      };
    },
    { scope: ref, dependencies: [type, immediate] },
  );

  return (
    <Tag ref={ref} className={`reveal-pending ${className}`}>
      {children}
    </Tag>
  );
}
