import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** Favicon: the accent-coloured monogram on the site's own black. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0b",
          color: "#4f7cff",
          fontSize: 44,
          fontWeight: 700,
          letterSpacing: "-0.06em",
        }}
      >
        V
      </div>
    ),
    size,
  );
}
