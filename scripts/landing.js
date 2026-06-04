(function () {
  var SOURCE_META = {
    "Artificial Intelligence (AI)": { category: "ai", tagClass: "tag-ai", shortLabel: "AI" },
    cybersecurity: { category: "cybersecurity", tagClass: "tag-cyber", shortLabel: "Cybersecurity" },
    "Machine Learning": { category: "ml", tagClass: "tag-ml", shortLabel: "ML" },
    "Hacker News: Front Page": { category: "hn", tagClass: "tag-hn", shortLabel: "HN" },
    "Technical Information Security Content & Discussion": {
      category: "netsec",
      tagClass: "tag-netsec",
      shortLabel: "Sec",
    },
    "The GitHub Blog": { category: "gh", tagClass: "tag-gh", shortLabel: "GitHub" },
  };

  var SPOTLIGHT_ORDER = ["ai", "cybersecurity", "ml"];

  function esc(s) {
    if (s == null) return "";
    var d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }

  function escAttr(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/'/g, "&#39;");
  }

  function clip(s, n) {
    if (!s) return "";
    var t = String(s).replace(/\s+/g, " ").trim();
    return t.length <= n ? t : t.slice(0, n - 1) + "\u2026";
  }

  function metaForSource(title) {
    return SOURCE_META[title] || { category: "other", tagClass: "tag-gh", shortLabel: "News" };
  }

  function buildFeedItems(data) {
    var items = [];
    (data.sources || []).forEach(function (s) {
      (s.articles || []).forEach(function (a) {
        items.push({
          title: a.title,
          link: a.link,
          sourceTitle: s.title,
          publishedOn: a.publishedOn,
        });
      });
    });
    items.sort(function (a, b) {
      return new Date(b.publishedOn) - new Date(a.publishedOn);
    });
    return items;
  }

  function hydrateTickerFromCache() {
    var track = document.getElementById("ticker-track");
    if (!track) return;

    fetch("feed/cache.json")
      .then(function (r) {
        if (!r.ok) throw new Error("bad status");
        return r.json();
      })
      .then(function (data) {
        var items = buildFeedItems(data).slice(0, 8);
        if (!items.length) return;
        var fragment = "";
        function appendChunk() {
          items.forEach(function (item) {
            var m = metaForSource(item.sourceTitle);
            fragment +=
              '<a href="' +
              escAttr(item.link) +
              '" class="ticker-item" target="_blank" rel="noopener noreferrer">' +
              '<span class="tag ' +
              escAttr(m.tagClass) +
              '">' +
              esc(m.shortLabel) +
              "</span>" +
              esc(clip(item.title, 72)) +
              "</a>";
          });
        }
        appendChunk();
        appendChunk();
        track.innerHTML = fragment;
      })
      .catch(function () {
        /* static duplicate pairs already in HTML for seamless loop */
      });
  }

  function hydrateSpotlightFromCache() {
    var grid = document.getElementById("spotlight-grid");
    if (!grid) return;

    fetch("feed/cache.json")
      .then(function (r) {
        if (!r.ok) throw new Error("bad status");
        return r.json();
      })
      .then(function (data) {
        var items = buildFeedItems(data);
        var picked = [];
        SPOTLIGHT_ORDER.forEach(function (cat) {
          var found = items.find(function (item) {
            return metaForSource(item.sourceTitle).category === cat;
          });
          if (found) picked.push(found);
        });
        if (!picked.length) return;
        var html = "";
        picked.forEach(function (item) {
          html +=
            '<a class="spotlight-card" href="' +
            escAttr(item.link) +
            '" target="_blank" rel="noopener noreferrer">' +
            '<div class="spotlight-card-title">' +
            esc(item.title) +
            "</div>" +
            '<div class="spotlight-card-source">' +
            esc(item.sourceTitle) +
            "</div></a>";
        });
        grid.innerHTML = html;
        revealElements(grid.querySelectorAll(".spotlight-card"));
      })
      .catch(function () {});
  }

  function initNavScroll() {
    var nav = document.getElementById("main-nav");
    if (!nav) return;
    window.addEventListener(
      "scroll",
      function () {
        nav.classList.toggle("scrolled", window.scrollY > 8);
      },
      { passive: true },
    );
  }

  function revealElements(els) {
    var list = Array.prototype.slice.call(els || []);
    if (!list.length) return;

    var reduce =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      Array.prototype.forEach.call(list, function (el) {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12 },
    );

    Array.prototype.forEach.call(list, function (el, i) {
      el.style.opacity = "0";
      el.style.transform = "translateY(16px)";
      el.style.transition =
        "opacity 400ms ease " + i * 40 + "ms, transform 400ms ease " + i * 40 + "ms";
      observer.observe(el);
    });
  }

  function initTickerMotion() {
    var reduce =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      document.querySelectorAll(".ticker-track").forEach(function (t) {
        t.style.animation = "none";
      });
    }
  }

  function boot() {
    initNavScroll();
    initTickerMotion();
    hydrateTickerFromCache();
    hydrateSpotlightFromCache();
    revealElements(document.querySelectorAll(".discovery-card"));
    revealElements(document.querySelectorAll(".step-card, .category-card"));
    var grid = document.getElementById("spotlight-grid");
    if (grid) {
      var cards = grid.querySelectorAll(".spotlight-card");
      if (cards.length) revealElements(cards);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
