(function () {
  "use strict";

  var tabs = Array.prototype.slice.call(document.querySelectorAll(".tab"));
  var panels = {};
  var FADE_MS = 150;

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
    if (!tab) return;

    var oldTab = currentTab();
    var oldPanel = oldTab ? panels[oldTab.id] : null;
    var newPanel = panels[tab.id];
    if (!newPanel) return;

    if (oldPanel === newPanel) {
      if (opts.focus) tab.focus();
      return;
    }

    setTabStates(tab);

    if (opts.updateHash !== false) {
      history.replaceState(null, "", "#" + tab.getAttribute("aria-controls").replace("panel-", ""));
    }

    if (opts.focus) tab.focus();

    if (!oldPanel || opts.instant) {
      if (oldPanel) {
        oldPanel.classList.remove("is-active");
        oldPanel.hidden = true;
      }
      newPanel.hidden = false;
      newPanel.classList.add("is-active");
      return;
    }

    oldPanel.classList.add("is-fading");
    window.setTimeout(function () {
      oldPanel.classList.remove("is-active", "is-fading");
      oldPanel.hidden = true;
      newPanel.hidden = false;
      newPanel.classList.add("is-fading", "is-active");
      void newPanel.offsetWidth;
      newPanel.classList.remove("is-fading");
    }, FADE_MS);

    if (opts.scroll !== false) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  tabs.forEach(function (tab, index) {
    tab.addEventListener("click", function () { activate(tab); });
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

  // Any internal link with data-tab uses the same tab-switching system.
  document.querySelectorAll("[data-tab]").forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      activate(document.getElementById(link.getAttribute("data-tab")));
    });
  });

  var initial = tabs[0];
  var hash = window.location.hash.replace("#", "");
  if (hash) {
    var matched = tabs.find(function (t) {
      return t.getAttribute("aria-controls") === "panel-" + hash;
    });
    if (matched) initial = matched;
  }
  activate(initial, { updateHash: false, instant: true, scroll: false });

  var scrollHideTimeout;
  window.addEventListener("scroll", function () {
    document.documentElement.classList.add("is-scrolling");
    window.clearTimeout(scrollHideTimeout);
    scrollHideTimeout = window.setTimeout(function () {
      document.documentElement.classList.remove("is-scrolling");
    }, 650);
  }, { passive: true });
})();