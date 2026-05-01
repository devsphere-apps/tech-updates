(function () {
  var THEME_KEY = "tech-updates-theme";

  function applyTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    try {
      localStorage.setItem(THEME_KEY, t);
    } catch (e) {}
  }

  function initTheme() {
    var stored = null;
    try {
      stored = localStorage.getItem(THEME_KEY);
    } catch (e) {}
    if (stored === "dark" || stored === "light") {
      applyTheme(stored);
      return;
    }
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      applyTheme("dark");
    } else {
      applyTheme("light");
    }
  }

  function wireThemeToggle() {
    document.querySelectorAll("[data-theme-toggle]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var next =
          document.documentElement.getAttribute("data-theme") === "dark"
            ? "light"
            : "dark";
        applyTheme(next);
      });
    });
  }

  function fmtRelative(iso) {
    var d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    var sec = Math.floor((Date.now() - d.getTime()) / 1000);
    if (sec < 45) return "just now";
    if (sec < 3600) return Math.floor(sec / 60) + "m ago";
    if (sec < 86400) return Math.floor(sec / 3600) + "h ago";
    if (sec < 604800) return Math.floor(sec / 86400) + "d ago";
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  }

  function escHtml(s) {
    if (s == null) return "";
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/"/g, "&quot;");
  }

  function escAttr(s) {
    return escHtml(s).replace(/'/g, "&#39;");
  }

  function clipDesc(s, n) {
    if (!s) return "";
    var t = String(s).replace(/\s+/g, " ").trim();
    if (t.length <= n) return t;
    return t.slice(0, n - 1) + "…";
  }

  function updateRelativeTimes() {
    document.querySelectorAll(".js-relative-time").forEach(function (el) {
      var dt = el.getAttribute("datetime");
      if (dt) {
        var r = fmtRelative(dt);
        if (r) el.textContent = r;
      }
    });
  }

  function loadFeedPreview() {
    var grid = document.getElementById("preview-grid");
    if (!grid) return;
    fetch("feed/cache.json")
      .then(function (r) {
        if (!r.ok) throw new Error("bad status");
        return r.json();
      })
      .then(function (data) {
        var items = [];
        (data.sources || []).forEach(function (s) {
          (s.articles || []).forEach(function (a) {
            items.push({
              title: a.title,
              link: a.link,
              description: clipDesc(a.description, 220),
              imageUrl: a.imageUrl,
              sourceTitle: s.title,
              publishedOn: a.publishedOn,
            });
          });
        });
        items.sort(function (a, b) {
          return new Date(b.publishedOn) - new Date(a.publishedOn);
        });
        var top = items.slice(0, 5);
        grid.innerHTML = "";
        top.forEach(function (item) {
          var rel = fmtRelative(item.publishedOn) || "—";
          var thumb = item.imageUrl
            ? '<div class="ds-feed-card__thumb"><img src="' +
              escAttr(item.imageUrl) +
              '" alt="" loading="lazy" decoding="async" /></div>'
            : '<div class="ds-feed-card__thumb" aria-hidden="true"></div>';
          var card =
            '<a class="ds-link ds-card ds-card--interactive ds-feed-card ds-feed-card--stack ds-preview-item" href="' +
            escAttr(item.link) +
            '" target="_blank" rel="noopener noreferrer">' +
            '<div class="ds-feed-card__inner">' +
            thumb +
            '<div class="ds-feed-card__body">' +
            '<h3 class="ds-feed-card__title">' +
            escHtml(item.title) +
            "</h3>" +
            '<div class="ds-feed-card__meta">' +
            "<span>" +
            escHtml(item.sourceTitle) +
            "</span>" +
            '<span class="ds-feed-card__dot" aria-hidden="true"></span>' +
            '<time datetime="' +
            escAttr(item.publishedOn) +
            '">' +
            escHtml(rel) +
            "</time>" +
            "</div>" +
            '<p class="ds-feed-card__excerpt">' +
            escHtml(item.description) +
            "</p>" +
            "</div></div></a>";
          grid.insertAdjacentHTML("beforeend", card);
        });
      })
      .catch(function () {
        grid.innerHTML =
          '<p class="ds-text" style="grid-column:1/-1;text-align:center">Open the full feed after deploy, or run <code>npm run build</code> locally to generate cache.</p>';
      });
  }

  initTheme();

  function boot() {
    wireThemeToggle();
    updateRelativeTimes();
    loadFeedPreview();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
