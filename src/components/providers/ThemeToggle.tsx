"use client";

import { useCallback, useSyncExternalStore } from "react";
import { THEME_KEY, type Theme } from "@/lib/theme";

/**
 * The `data-theme` attribute on <html> is the single source of truth — the
 * pre-paint script sets it before React exists, so React subscribes to it
 * rather than owning it. That keeps the two from disagreeing on first paint.
 */
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });

  // Follow the OS while the visitor hasn't made an explicit choice.
  const media = window.matchMedia("(prefers-color-scheme: light)");
  const onMedia = (event: MediaQueryListEvent) => {
    try {
      if (localStorage.getItem(THEME_KEY)) return;
    } catch {
      // Storage blocked — treat it as "no explicit choice".
    }
    document.documentElement.dataset.theme = event.matches ? "light" : "dark";
  };

  media.addEventListener("change", onMedia);

  return () => {
    observer.disconnect();
    media.removeEventListener("change", onMedia);
  };
}

const getSnapshot = (): Theme =>
  document.documentElement.dataset.theme === "light" ? "light" : "dark";

/** Server render has no DOM to read; hydration corrects it on the first pass. */
const getServerSnapshot = (): Theme => "dark";

/** Sun / moon marks. Both live in one svg so nothing shifts when they swap. */
function ThemeIcon({ theme }: { theme: Theme }) {
  return (
    <svg viewBox="0 0 20 20" className="size-4" aria-hidden>
      {/* Moon — shown in light mode, i.e. "switch to dark" */}
      <path
        d="M14.5 12.4A5.6 5.6 0 0 1 7.6 5.5a5.7 5.7 0 1 0 6.9 6.9Z"
        className="fill-current transition-opacity duration-300"
        style={{ opacity: theme === "light" ? 1 : 0 }}
      />
      {/* Sun — shown in dark mode, i.e. "switch to light" */}
      <g
        className="transition-opacity duration-300"
        style={{ opacity: theme === "dark" ? 1 : 0 }}
      >
        <circle cx="10" cy="10" r="3.4" className="fill-current" />
        <g className="stroke-current" strokeWidth="1.4" strokeLinecap="round">
          <path d="M10 1.7v1.7M10 16.6v1.7M18.3 10h-1.7M3.4 10H1.7" />
          <path d="M15.9 4.1l-1.2 1.2M5.3 14.7l-1.2 1.2M15.9 15.9l-1.2-1.2M5.3 5.3L4.1 4.1" />
        </g>
      </g>
    </svg>
  );
}

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = useCallback(() => {
    const root = document.documentElement;
    const next: Theme = root.dataset.theme === "light" ? "dark" : "light";

    // Enables a page-wide colour transition for the length of the swap only.
    root.classList.add("theme-transition");
    root.dataset.theme = next;

    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      // Private mode — the choice just won't persist.
    }

    window.setTimeout(() => root.classList.remove("theme-transition"), 450);
  }, []);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      title="Toggle theme"
      className={`border-line hover:border-accent hover:text-accent text-muted flex size-9 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${className}`}
    >
      <ThemeIcon theme={theme} />
    </button>
  );
}
