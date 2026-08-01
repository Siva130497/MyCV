import { ImageResponse } from "next/og";
import { person, yearsOfExperience } from "@/data/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${person.fullName} — ${person.role}`;

/** Link preview card. Mirrors the hero: name solid, surname outlined. */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0a0b",
          color: "#e9e9e6",
          padding: "64px 72px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 20,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "#86868f",
          }}
        >
          <span>{person.role}</span>
          <span>
            {person.location} · {yearsOfExperience()} yrs
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 124,
              fontWeight: 700,
              letterSpacing: "-0.05em",
              lineHeight: 0.9,
            }}
          >
            {person.firstName}
          </div>
          <div
            style={{
              fontSize: 124,
              fontWeight: 700,
              letterSpacing: "-0.05em",
              lineHeight: 0.9,
              // Satori has no text-stroke, so the hero's outlined surname
              // becomes a dim fill here instead of an invisible one.
              color: "#41414a",
            }}
          >
            {person.lastName}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            fontSize: 24,
            color: "#86868f",
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 999,
              background: "#4f7cff",
              display: "flex",
            }}
          />
          LangGraph · Rust · TypeScript · Python · Next.js
        </div>
      </div>
    ),
    size,
  );
}
