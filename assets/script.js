(function () {
  "use strict";

  var tabs = Array.prototype.slice.call(document.querySelectorAll(".tab"));
  var panels = {};

  var FADE_MS = 150; // keep in sync with the .tabpanel transition duration in CSS

  tabs.forEach(function (tab) {
    panels[tab.id] = document.getElementById(tab.getAttribute("aria-controls"));
  });

  function currentTab() {
    return tabs.find(function (t) { return t.classList.contains("is-active"); });
  }

  function setTabStates(tab) {
    tabs.forEach(function (t) {
      var isActive = t === tab;

      t.classList.toggle("is-active", isActive);
      t.setAttribute("aria-selected", isActive ? "true" : "false");
      t.tabIndex = isActive ? 0 : -1;
    });
  }

  function activate(tab, opts) {
    opts = opts || {};

    var oldTab = currentTab();
    var oldPanel = oldTab ? panels[oldTab.id] : null;
    var newPanel = panels[tab.id];

    if (oldPanel === newPanel) {
      if (opts.focus) tab.focus();
      return;
    }

    setTabStates(tab);

    if (opts.updateHash !== false) {
      history.replaceState(null, "", "#" + tab.getAttribute("aria-controls").replace("panel-", ""));
    }

    if (opts.focus) {
      tab.focus();
    }

    if (!oldPanel || opts.instant) {
      // First load, or an instant switch (no animation needed).
      if (oldPanel) {
        oldPanel.classList.remove("is-active");
        oldPanel.hidden = true;
      }
      newPanel.hidden = false;
      newPanel.classList.add("is-active");
      return;
    }

    // Fade the current panel out, then swap and fade the new one in.
    oldPanel.classList.add("is-fading");

    window.setTimeout(function () {
      oldPanel.classList.remove("is-active", "is-fading");
      oldPanel.hidden = true;

      newPanel.hidden = false;
      newPanel.classList.add("is-fading");
      newPanel.classList.add("is-active");

      // Force a reflow so the browser registers the starting (faded-out)
      // state before we transition it back to visible.
      void newPanel.offsetWidth;

      newPanel.classList.remove("is-fading");
    }, FADE_MS);

    if (opts.scroll !== false) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  tabs.forEach(function (tab, index) {
    tab.addEventListener("click", function () {
      activate(tab);
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

  // Profile → Education
  document.querySelectorAll(".profile-link").forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();

      var targetTab = document.getElementById("tab-education");

      if (targetTab) {
        activate(targetTab);
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

  activate(initial, { updateHash: false, instant: true, scroll: false });

  // ------------------------------------------------------------------
  // Minimal, auto-hiding scrollbar: only tint it in while the page is
  // actively scrolling, then let it fade back to transparent.
  // ------------------------------------------------------------------

  var scrollHideTimeout;

  window.addEventListener(
    "scroll",
    function () {
      document.documentElement.classList.add("is-scrolling");

      window.clearTimeout(scrollHideTimeout);
      scrollHideTimeout = window.setTimeout(function () {
        document.documentElement.classList.remove("is-scrolling");
      }, 650);
    },
    { passive: true }
  );
})();