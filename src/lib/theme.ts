export type Theme = "light" | "dark";

export const THEME_KEY = "vm-theme";

/**
 * Runs before first paint via a blocking inline script in the root layout, so
 * the resolved theme is on <html> before anything renders and there's no flash
 * of the wrong palette.
 *
 * Because this always stamps an explicit `data-theme`, the CSS never needs a
 * `prefers-color-scheme` fallback — the preference is resolved here once.
 *
 * Kept in a plain module (not the client component) so the root layout can
 * import the string without pulling a client boundary into the server tree.
 */
export const THEME_INIT_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem(${JSON.stringify(THEME_KEY)});
    var theme = stored === "light" || stored === "dark"
      ? stored
      : (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
    document.documentElement.dataset.theme = theme;
  } catch (e) {
    document.documentElement.dataset.theme = "dark";
  }
  document.documentElement.classList.remove("no-js");
})();
`;
