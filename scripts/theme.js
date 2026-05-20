(function () {
  const STORAGE_KEY = "tech-updates-theme";
  const root = document.documentElement;

  const THEME_COLOR_LIGHT = "#F7F4EF";
  const THEME_COLOR_DARK = "#111113";

  let saved = null;
  try {
    saved = localStorage.getItem(STORAGE_KEY);
  } catch (e) {
    saved = null;
  }

  const systemDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = saved || (systemDark ? "dark" : "light");

  root.setAttribute("data-theme", theme);
  syncThemeColor(theme);

  document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("theme-toggle");
    if (!btn) return;

    updateToggleIcon(root.getAttribute("data-theme"));

    btn.addEventListener("click", () => {
      const current = root.getAttribute("data-theme");
      const next = current === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch (e) {}
      updateToggleIcon(next);
      syncThemeColor(next);
    });
  });

  function syncThemeColor(t) {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (!meta || !t) return;
    meta.setAttribute(
      "content",
      t === "dark" ? THEME_COLOR_DARK : THEME_COLOR_LIGHT,
    );
  }

  function updateToggleIcon(theme) {
    const sun = document.querySelector(".icon-sun");
    const moon = document.querySelector(".icon-moon");
    if (!sun || !moon) return;
    sun.style.display = theme === "dark" ? "block" : "none";
    moon.style.display = theme === "light" ? "block" : "none";
  }
})();
