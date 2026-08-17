(function () {
  "use strict";

  var tabs = Array.prototype.slice.call(document.querySelectorAll(".tab"));
  var panels = {};
  var FADE_MS = 150;
  var lastScrollY = window.scrollY;
  var scrollingUp = false;

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
var switchingToProfile =
    tab.getAttribute("aria-controls") === "panel-profile";

var switchingFromProfile =
    oldTab &&
    oldTab.getAttribute("aria-controls") === "panel-profile";
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
    /*
 * ---------------------------------------------------------
 * Header state follows the active panel.
 * ---------------------------------------------------------
 */

if (switchingToProfile) {

    /*
     * Returning to Profile:
     * reset the header completely.
     */
    resetProfileHeaderState();

} else {

    /*
     * Any other panel:
     * keep the header permanently compact.
     */
    setNonProfileHeaderState();
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
  /* =========================================================
     HEADER NAVIGATION TRANSITION
     ========================================================= */

  var siteHeader =
      document.querySelector(".site-header");

  var nav =
      document.querySelector(".nav");

  var heroTitle =
      document.getElementById("hero-title");
    
  var profilePanel =
    document.getElementById("panel-profile");

  function isProfileActive() {

    var activeTab =
        currentTab();

    return activeTab &&
        activeTab.getAttribute("aria-controls") === "panel-profile";
}
  /*
   * ---------------------------------------------------------
   * State
   * ---------------------------------------------------------
   */

  var lastScrollY = window.scrollY;

  var scrollingUp = false;

  var navCentered = false;

  var titleVisible = false;

  var titleFadeTimer = null;

  var navReturnTimer = null;


  /*
   * ---------------------------------------------------------
   * Navigation position
   * ---------------------------------------------------------
   *
   * 0 = original right-side position
   * 1 = centred position
   *
   * While moving DOWN, this follows page position.
   *
   * While moving UP, the nav is NOT controlled by page
   * position. It is released to CSS once the large title
   * is completely visible.
   * ---------------------------------------------------------
   */

  function setNavProgress(progress) {

      nav.style.setProperty(
          "--header-progress",
          progress
      );
  }


  /*
   * ---------------------------------------------------------
   * Small header title
   * ---------------------------------------------------------
   */

  function showHeaderTitle() {

      if (titleVisible) {
          return;
      }

      titleVisible = true;

      nav.classList.add(
          "title-visible"
      );
  }


  function hideHeaderTitle() {

      if (!titleVisible) {
          return;
      }

      titleVisible = false;

      nav.classList.remove(
          "title-visible"
      );
  }


  /*
   * ---------------------------------------------------------
   * Return navigation to original position
   * ---------------------------------------------------------
   *
   * This is deliberately NOT tied to scroll position.
   *
   * Once called, CSS transitions the nav from its current
   * centred position back to the original right-side
   * position.
   * ---------------------------------------------------------
   */

  function returnNavToRight() {

    if (!navCentered) {
        return;
    }

    window.clearTimeout(navReturnTimer);
    navReturnTimer = null;

    navCentered = false;

    nav.classList.remove(
        "is-following-scroll"
    );

    setNavProgress(0);

    siteHeader.classList.remove(
        "is-compact"
    );
}


  /*
   * ---------------------------------------------------------
   * Main update
   * ---------------------------------------------------------
   */

  function setNonProfileHeaderState() {

    /*
     * Cancel any pending transitions.
     */

    window.clearTimeout(titleFadeTimer);
    window.clearTimeout(navReturnTimer);

    titleFadeTimer = null;
    navReturnTimer = null;


    /*
     * Header is permanently compact on other panels.
     */

    navCentered = true;


    /*
     * Remove scroll control.
     */

    nav.classList.remove(
        "is-following-scroll"
    );


    /*
     * Open the space between the two nav pairs.
     */

    setNavProgress(1);


    /*
     * Show the small title immediately.
     */

    showHeaderTitle();


    siteHeader.classList.add(
        "is-compact"
    );
}

  function updateHeaderProgress() {

if (
    !siteHeader ||
    !nav ||
    !heroTitle
) {
    return;
}


/*
 * Header transitions only happen on Profile.
 */

if (!isProfileActive()) {

    setNonProfileHeaderState();

    return;
}


      /*
       * -----------------------------------------------------
       * Determine scroll direction
       * -----------------------------------------------------
       */

      var currentScrollY =
          window.scrollY;

      scrollingUp =
          currentScrollY < lastScrollY;

      lastScrollY =
          currentScrollY;


      /*
       * -----------------------------------------------------
       * Position of large Aayan Haider title
       * -----------------------------------------------------
       */

      var titleRect =
          heroTitle.getBoundingClientRect();

      var titleHeight =
          titleRect.height;


      /*
       * =====================================================
       * BORDER
       * =====================================================
       *
       * Border remains independent of the nav animation.
       */

      var borderFadeStart = 80;

      var borderFadeEnd = 0;

      var borderProgress =
          (
              borderFadeStart -
              titleRect.bottom
          ) /
          (
              borderFadeStart -
              borderFadeEnd
          );

      borderProgress =
          Math.max(
              0,
              Math.min(
                  1,
                  borderProgress
              )
          );

      siteHeader.style.setProperty(
          "--header-border-opacity",
          borderProgress * 0.25
      );


      /*
       * =====================================================
       * SCROLLING UP
       * =====================================================
       */

      if (scrollingUp) {

    /*
     * -------------------------------------------------
     * 1. LARGE TITLE IS 1/4 VISIBLE
     * -------------------------------------------------
     *
     * Start fading the small header title out.
     */

    var quarterVisiblePoint =
        titleHeight * 0.75;


    if (
        titleRect.bottom >= quarterVisiblePoint &&
        titleRect.bottom < titleHeight
    ) {

        /*
         * Cancel any pending fade-in.
         */
        window.clearTimeout(
            titleFadeTimer
        );

        titleFadeTimer = null;


        /*
         * Start the small title fade-out.
         */
        hideHeaderTitle();
    }


    /*
     * -------------------------------------------------
     * 2. LARGE TITLE IS COMPLETELY IN VIEW
     * -------------------------------------------------
     *
     * The nav is allowed to return only after the
     * small title has completely disappeared.
     */

    if (
        navCentered &&
        titleRect.top >= 0
    ) {

        /*
         * Cancel any previous return timer.
         */
        window.clearTimeout(
            navReturnTimer
        );


        /*
         * If the title is still fading, wait for its
         * CSS transition to finish.
         *
         * .site-name uses:
         *     transition: opacity .4s ease;
         */
        if (titleVisible) {

            hideHeaderTitle();

            navReturnTimer =
                window.setTimeout(
                    function () {

                        if (navCentered) {
                            returnNavToRight();
                        }

                        navReturnTimer = null;

                    },
                    400
                );

        } else {

            /*
             * Title is already completely gone.
             * Return the nav immediately.
             */
            returnNavToRight();

        }

        return;
    }

function resetProfileHeaderState() {

    /*
     * Cancel everything that may have been running
     * while another panel was active.
     */

    window.clearTimeout(titleFadeTimer);
    window.clearTimeout(navReturnTimer);

    titleFadeTimer = null;
    navReturnTimer = null;


    /*
     * Profile starts with the nav closed.
     */

    navCentered = false;


    /*
     * Hide the small title.
     */

    hideHeaderTitle();


    /*
     * Return the pairs to their normal spacing.
     */

    nav.classList.remove(
        "is-following-scroll"
    );

    setNavProgress(0);


    siteHeader.classList.remove(
        "is-compact"
    );


    /*
     * Now allow the normal profile scroll logic
     * to take over.
     */

    updateHeaderProgress();
}
    /*
     * -------------------------------------------------
     * 3. NAV IS ALREADY CENTRED
     * -------------------------------------------------
     *
     * Keep it stationary while the large title is
     * coming back into view.
     */

    if (navCentered) {
        return;
    }


    /*
     * -------------------------------------------------
     * 4. SCROLLING UP BEFORE NAV IS CENTRED
     * -------------------------------------------------
     *
     * Continue following the page normally.
     */

    nav.classList.add(
        "is-following-scroll"
    );


    var reverseTransitionStart = 180;

    var reverseTransitionEnd = 0;


    var reverseProgress =
        (
            reverseTransitionStart -
            titleRect.bottom
        ) /
        (
            reverseTransitionStart -
            reverseTransitionEnd
        );


    reverseProgress =
        Math.max(
            0,
            Math.min(
                1,
                reverseProgress
            )
        );


    var reverseEased =
        reverseProgress *
        reverseProgress *
        (3 - 2 * reverseProgress);


    setNavProgress(
        reverseEased
    );


    return;
}


      /*
       * =====================================================
       * SCROLLING DOWN
       * =====================================================
       *
       * The nav follows the page until it reaches the centre.
       * =====================================================
       */

      if (
          !scrollingUp &&
          !navCentered
      ) {

          /*
           * Cancel any reverse-return timer.
           */

          window.clearTimeout(
              navReturnTimer
          );

          navReturnTimer = null;


          nav.classList.add(
              "is-following-scroll"
          );


          var transitionStart = 180;

          var transitionEnd = 0;


          var progress =
              (
                  transitionStart -
                  titleRect.bottom
              ) /
              (
                  transitionStart -
                  transitionEnd
              );


          progress =
              Math.max(
                  0,
                  Math.min(
                      1,
                      progress
                  )
              );


          /*
           * Smoothstep easing.
           */

          var eased =
              progress *
              progress *
              (3 - 2 * progress);


          setNavProgress(
              eased
          );


          /*
           * -------------------------------------------------
           * NAV HAS REACHED CENTRE
           * -------------------------------------------------
           */

          if (
              progress >= 0.98
          ) {

              setNavProgress(1);


              /*
               * Release scroll control.
               */
              nav.classList.remove(
                  "is-following-scroll"
              );


              navCentered = true;


              siteHeader.classList.add(
                  "is-compact"
              );


              /*
               * ------------------------------------------------
               * Small title appears AFTER nav has settled.
               * ------------------------------------------------
               */

              if (
                  !titleVisible &&
                  !titleFadeTimer
              ) {

                  titleFadeTimer =
                      window.setTimeout(
                          function () {

                              if (
                                  navCentered &&
                                  !scrollingUp
                              ) {
                                  showHeaderTitle();
                              }

                              titleFadeTimer = null;

                          },
                          250
                      );
              }
          }
      }
  }


  /*
   * ---------------------------------------------------------
   * Scroll
   * ---------------------------------------------------------
   */

  window.addEventListener(
      "scroll",
      updateHeaderProgress,
      {
          passive: true
      }
  );


  /*
   * ---------------------------------------------------------
   * Resize
   * ---------------------------------------------------------
   */

  window.addEventListener(
      "resize",
      updateHeaderProgress
  );


  /*
   * ---------------------------------------------------------
   * Initial state
   * ---------------------------------------------------------
   */

  setNavProgress(0);

  nav.classList.add(
      "is-following-scroll"
  );

  updateHeaderProgress();


  /* =========================================================
    AUTO-HIDING SCROLLBAR
    ========================================================= */

  var scrollHideTimeout;

  window.addEventListener(
      "scroll",
      function () {

          document.documentElement.classList.add(
              "is-scrolling"
          );


          window.clearTimeout(
              scrollHideTimeout
          );


          scrollHideTimeout =
              window.setTimeout(
                  function () {

                      document.documentElement.classList.remove(
                          "is-scrolling"
                      );

                  },
                  650
              );

      },
      {
          passive: true
      }
  );
})();