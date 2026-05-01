(function () {
  var SOURCE_MAP = {
    "Artificial Intelligence (AI)": {
      category: "ai",
      tagClass: "tag-ai",
      label: "Artificial Intelligence",
    },
    cybersecurity: {
      category: "cybersecurity",
      tagClass: "tag-cyber",
      label: "Cybersecurity",
    },
    "Machine Learning": {
      category: "ml",
      tagClass: "tag-ml",
      label: "Machine Learning",
    },
    "Hacker News: Front Page": {
      category: "hn",
      tagClass: "tag-hn",
      label: "Hacker News",
    },
    "Technical Information Security Content & Discussion": {
      category: "netsec",
      tagClass: "tag-netsec",
      label: "Security Research",
    },
    "The GitHub Blog": {
      category: "gh",
      tagClass: "tag-gh",
      label: "GitHub",
    },
  };

  function applyCategoryTags() {
    document.querySelectorAll(".feed-card[data-source-title]").forEach(function (card) {
      var raw = card.getAttribute("data-source-title");
      var meta = SOURCE_MAP[raw];
      if (!meta) {
        card.setAttribute("data-category", "other");
      } else {
        card.setAttribute("data-category", meta.category);
      }
      var tagEl = card.querySelector(".js-source-tag");
      if (!tagEl) return;
      if (meta) {
        tagEl.textContent = meta.label;
        tagEl.className = "tag js-source-tag " + meta.tagClass;
      } else {
        tagEl.textContent = raw || "News";
        tagEl.className = "tag js-source-tag tag-gh";
      }
    });
  }

  function markFeaturedCards() {
    var content = document.getElementById("feed-content");
    if (!content) return;
    var el = content.firstElementChild;
    while (el) {
      if (el.classList && el.classList.contains("date-divider")) {
        var n = el.nextElementSibling;
        while (n && !(n.classList && n.classList.contains("date-divider"))) {
          if (n.classList && n.classList.contains("feed-card")) {
            n.classList.add("featured");
            break;
          }
          n = n.nextElementSibling;
        }
      }
      el = el.nextElementSibling;
    }
  }

  function updateDividerVisibility() {
    document.querySelectorAll("#feed-content .date-divider").forEach(function (divider) {
      var next = divider.nextElementSibling;
      var hasVisible = false;
      while (
        next &&
        !(next.classList && next.classList.contains("date-divider"))
      ) {
        if (
          next.classList &&
          next.classList.contains("feed-card") &&
          next.style.display !== "none"
        ) {
          hasVisible = true;
          break;
        }
        next = next.nextElementSibling;
      }
      divider.style.display = hasVisible ? "" : "none";
    });
  }

  function initFilter() {
    var tabs = document.querySelectorAll(".filter-tab");
    var cards = document.querySelectorAll("#feed-content .feed-card");
    if (!tabs.length || !cards.length) return;

    var header = document.getElementById("feed-header");
    var tabList = Array.prototype.slice.call(tabs);

    function applyFilter(activeTab) {
      var filter = activeTab.getAttribute("data-filter");
      tabs.forEach(function (t) {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
      });
      activeTab.classList.add("active");
      activeTab.setAttribute("aria-selected", "true");

      cards.forEach(function (card) {
        var cat = card.getAttribute("data-category") || "";
        var show = filter === "all" || cat === filter;
        card.style.display = show ? "" : "none";
      });

      updateDividerVisibility();
    }

    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        applyFilter(tab);
      });
    });

    if (header) {
      header.addEventListener("keydown", function (e) {
        var focused = document.activeElement;
        var idx = tabList.indexOf(focused);
        if (idx < 0) return;
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
          e.preventDefault();
          var next =
            e.key === "ArrowRight"
              ? (idx + 1) % tabList.length
              : (idx - 1 + tabList.length) % tabList.length;
          tabList[next].focus();
        } else if (e.key === "Home") {
          e.preventDefault();
          tabList[0].focus();
        } else if (e.key === "End") {
          e.preventDefault();
          tabList[tabList.length - 1].focus();
        }
      });
    }

    updateDividerVisibility();
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

  function hideSkeleton() {
    var skeleton = document.getElementById("skeleton-loader");
    if (skeleton) skeleton.style.display = "none";
  }

  function boot() {
    hideSkeleton();
    applyCategoryTags();
    markFeaturedCards();
    initFilter();
    initNavScroll();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
