"use client";

import { useEffect, useState } from "react";
import { person } from "@/data/site";

/** Live clock in the visitor's own timezone, alongside the build year. */
function LocalTime() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () =>
      setTime(
        new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Europe/London",
        }).format(new Date()),
      );

    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);

  // null until mounted so server and client markup match.
  return <span suppressHydrationWarning>{time ?? "--:--"} London</span>;
}

export default function Footer() {
  return (
    <footer className="container-x border-line border-t py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="label">
          © {new Date().getFullYear()} {person.fullName}
        </p>

        <p className="label">
          <LocalTime />
        </p>

        <p className="label">
          Built with Next.js, Tailwind &amp; GSAP
        </p>
      </div>
    </footer>
  );
}
