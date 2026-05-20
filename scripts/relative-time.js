(function () {
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

  function update() {
    document.querySelectorAll(".js-relative-time").forEach(function (el) {
      var dt = el.getAttribute("datetime");
      if (dt) {
        var r = fmtRelative(dt);
        if (r) el.textContent = r;
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", update);
  } else {
    update();
  }
})();
