(function () {
  "use strict";

  var tabs = Array.prototype.slice.call(document.querySelectorAll(".tab"));
  var indicator = document.querySelector(".tab-indicator");
  var panels = {};

  tabs.forEach(function (tab) {
    panels[tab.id] = document.getElementById(tab.getAttribute("aria-controls"));
  });

  function moveIndicator(tab) {
    if (!indicator) return;

    var rect = tab.getBoundingClientRect();
    var navRect = tab.closest(".nav").getBoundingClientRect();

    indicator.style.width = rect.width + "px";
    indicator.style.transform = "translateX(" + (rect.left - navRect.left) + "px)";
  }

  function activate(tab, opts) {
    opts = opts || {};

    tabs.forEach(function (t) {
      var isActive = t === tab;

      t.classList.toggle("is-active", isActive);
      t.setAttribute("aria-selected", isActive ? "true" : "false");
      t.tabIndex = isActive ? 0 : -1;

      panels[t.id].classList.toggle("is-active", isActive);
      panels[t.id].hidden = !isActive;
    });

    moveIndicator(tab);

    if (opts.focus) {
      tab.focus();
    }

    if (opts.updateHash !== false) {
      history.replaceState(null, "", "#" + tab.getAttribute("aria-controls").replace("panel-", ""));
    }

    if (opts.scroll) {
      panels[tab.id].scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  tabs.forEach(function (tab, index) {
    tab.addEventListener("click", function () {
      activate(tab, { scroll: true });
    });

    tab.addEventListener("keydown", function (event) {
      var newIndex = null;

      if (event.key === "ArrowRight") newIndex = (index + 1) % tabs.length;
      else if (event.key === "ArrowLeft") newIndex = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === "Home") newIndex = 0;
      else if (event.key === "End") newIndex = tabs.length - 1;

      if (newIndex !== null) {
        event.preventDefault();
        activate(tabs[newIndex], { focus: true });
      }
    });
  });

  // Deep-link support: #projects, #education, etc.
  var initial = tabs[0];
  var hash = window.location.hash.replace("#", "");

  if (hash) {
    var matched = tabs.find(function (t) {
      return t.getAttribute("aria-controls") === "panel-" + hash;
    });
    if (matched) initial = matched;
  }

  activate(initial, { updateHash: false });

  window.addEventListener("resize", function () {
    var current = tabs.find(function (t) { return t.classList.contains("is-active"); });
    if (current) moveIndicator(current);
  });
})();