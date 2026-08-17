(function () {
  "use strict";

  var tabs = Array.prototype.slice.call(
    document.querySelectorAll(".tab")
  );

  var panels = {};

  var FADE_MS = 150;

  var lastScrollY = window.scrollY;

  var scrollingUp = false;


  /* =========================================================
     TAB / PANEL SYSTEM
     ========================================================= */

  tabs.forEach(function (tab) {

    panels[tab.id] =
      document.getElementById(
        tab.getAttribute("aria-controls")
      );

  });


  function currentTab() {

    return tabs.find(function (tab) {

      return tab.classList.contains(
        "is-active"
      );

    });

  }


  function setTabStates(tab) {

    tabs.forEach(function (t) {

      var isActive =
        t === tab;

      t.classList.toggle(
        "is-active",
        isActive
      );

      t.setAttribute(
        "aria-selected",
        isActive ? "true" : "false"
      );

      t.tabIndex =
        isActive ? 0 : -1;

    });

  }


  /* =========================================================
     HEADER REFERENCES
     ========================================================= */

  var siteHeader =
    document.querySelector(".site-header");

  var nav =
    document.querySelector(".nav");

  var heroTitle =
    document.getElementById("hero-title");


  function isProfileActive() {

    var activeTab =
      currentTab();

    return (
      activeTab &&
      activeTab.getAttribute("aria-controls") ===
        "panel-profile"
    );

  }


  /* =========================================================
     HEADER STATE
     ========================================================= */

  var navCentered = false;

  var titleVisible = false;

  var titleFadeTimer = null;

  var navReturnTimer = null;


  /*
   * --header-progress
   *
   * 0 = normal Profile position
   * 1 = compact / title-visible position
   */

  function setNavProgress(progress) {

    if (!nav) {
      return;
    }

    nav.style.setProperty(
      "--header-progress",
      progress
    );

  }


  /* =========================================================
     SMALL HEADER TITLE
     ========================================================= */

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


  /* =========================================================
     NON-PROFILE HEADER STATE
     =========================================================
     
     Every panel other than Profile permanently uses the
     compact header.

     This state is NOT affected by scroll position.
     ========================================================= */

  function setNonProfileHeaderState() {

    /*
     * Cancel any Profile transitions.
     */

    window.clearTimeout(
      titleFadeTimer
    );

    window.clearTimeout(
      navReturnTimer
    );

    titleFadeTimer = null;

    navReturnTimer = null;


    /*
     * Mark the nav as already centred.
     */

    navCentered = true;


    /*
     * Remove scroll-controlled movement.
     */

    nav.classList.remove(
      "is-following-scroll"
    );


    /*
     * Keep the space open for the title.
     */

    setNavProgress(1);


    /*
     * Always show the small title.
     */

    showHeaderTitle();


    /*
     * Keep the compact header appearance.
     */

    siteHeader.classList.add(
      "is-compact"
    );


    /*
     * Non-profile panels should not inherit a
     * Profile-specific border opacity.
     */

    siteHeader.style.setProperty(
      "--header-border-opacity",
      "0.25"
    );

  }


  /* =========================================================
     PROFILE HEADER RESET
     =========================================================
     
     This is called immediately when switching TO Profile.

     It deliberately does NOT depend on the current scroll
     position.
     ========================================================= */

  function resetProfileHeaderState() {

    /*
     * Cancel everything from the previous panel.
     */

    window.clearTimeout(
      titleFadeTimer
    );

    window.clearTimeout(
      navReturnTimer
    );

    titleFadeTimer = null;

    navReturnTimer = null;


    /*
     * Profile starts with the nav in its normal position.
     */

    navCentered = false;


    /*
     * Remove the compact title immediately.
     */

    hideHeaderTitle();


    /*
     * Close the space between the two nav pairs.
     */

    nav.classList.remove(
      "is-following-scroll"
    );

    setNavProgress(0);


    /*
     * Return the header to its normal Profile state.
     */

    siteHeader.classList.remove(
      "is-compact"
    );


    /*
     * Reset border before Profile's scroll logic
     * takes over.
     */

    siteHeader.style.setProperty(
      "--header-border-opacity",
      "0"
    );


    /*
     * Synchronise the scroll reference so switching
     * panels does not create a false scroll direction.
     */

    lastScrollY =
      window.scrollY;

  }


  /* =========================================================
     RETURN NAV TO NORMAL POSITION
     ========================================================= */

  function returnNavToRight() {

    if (!navCentered) {
      return;
    }


    window.clearTimeout(
      navReturnTimer
    );

    navReturnTimer = null;


    navCentered = false;


    /*
     * Re-enable the CSS transition.
     */

    nav.classList.remove(
      "is-following-scroll"
    );


    /*
     * CSS smoothly moves the nav from 1 → 0.
     */

    setNavProgress(0);


    siteHeader.classList.remove(
      "is-compact"
    );

  }


  /* =========================================================
     PROFILE SCROLL LOGIC
     ========================================================= */

  function updateHeaderProgress() {

    if (
      !siteHeader ||
      !nav ||
      !heroTitle
    ) {
      return;
    }


    /*
     * -------------------------------------------------------
     * HEADER TRANSITIONS ONLY EXIST ON PROFILE
     * -------------------------------------------------------
     */

    if (!isProfileActive()) {

      setNonProfileHeaderState();

      return;

    }


    /*
     * -------------------------------------------------------
     * SCROLL DIRECTION
     * -------------------------------------------------------
     */

    var currentScrollY =
      window.scrollY;

    scrollingUp =
      currentScrollY < lastScrollY;

    lastScrollY =
      currentScrollY;


    /*
     * -------------------------------------------------------
     * LARGE TITLE POSITION
     * -------------------------------------------------------
     */

    var titleRect =
      heroTitle.getBoundingClientRect();

    var titleHeight =
      titleRect.height;


    /* =======================================================
       BORDER
       =======================================================

       The border is independent of nav positioning.

       It is based purely on the large title's position.
       ======================================================= */

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


    /* =======================================================
       SCROLLING UP
       ======================================================= */

    if (scrollingUp) {


      /*
       * -----------------------------------------------------
       * LARGE TITLE IS 1/4 VISIBLE
       * -----------------------------------------------------
       *
       * Begin fading out the small header title.
       */

      var quarterVisiblePoint =
        titleHeight * 0.75;


      if (
        titleRect.bottom >=
          quarterVisiblePoint &&
        titleRect.bottom <
          titleHeight
      ) {

        window.clearTimeout(
          titleFadeTimer
        );

        titleFadeTimer = null;


        hideHeaderTitle();

      }


      /*
       * -----------------------------------------------------
       * LARGE TITLE IS COMPLETELY IN VIEW
       * -----------------------------------------------------
       *
       * Only now allow the nav to return.
       */

      if (
        navCentered &&
        titleRect.top >= 0
      ) {

        window.clearTimeout(
          navReturnTimer
        );


        /*
         * If the title is still visible, begin its fade
         * and wait for the CSS opacity transition.
         */

        if (titleVisible) {

          hideHeaderTitle();


          navReturnTimer =
            window.setTimeout(
              function () {

                if (
                  navCentered &&
                  isProfileActive()
                ) {

                  returnNavToRight();

                }

                navReturnTimer = null;

              },
              250
            );


        } else {

          /*
           * Title has already disappeared.
           * Return immediately.
           */

          returnNavToRight();

        }


        return;

      }


      /*
       * -----------------------------------------------------
       * NAV ALREADY CENTRED
       * -----------------------------------------------------
       *
       * Keep it stationary while the large title comes back.
       */

      if (navCentered) {

        return;

      }


      /*
       * -----------------------------------------------------
       * SCROLLING UP BEFORE NAV IS CENTRED
       * -----------------------------------------------------
       *
       * Reverse the normal page-following movement.
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


    /* =======================================================
       SCROLLING DOWN
       ======================================================= */

    if (
      !scrollingUp &&
      !navCentered
    ) {


      /*
       * Cancel any pending return.
       */

      window.clearTimeout(
        navReturnTimer
      );

      navReturnTimer = null;


      /*
       * Nav follows the page.
       */

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
       * -----------------------------------------------------
       * NAV HAS REACHED CENTRE
       * -----------------------------------------------------
       */

      if (
        progress >= 0.98
      ) {

        setNavProgress(1);


        /*
         * Stop scroll-controlled movement.
         */

        nav.classList.remove(
          "is-following-scroll"
        );


        navCentered = true;


        siteHeader.classList.add(
          "is-compact"
        );


        /*
         * ---------------------------------------------------
         * SHOW SMALL TITLE AFTER NAV SETTLES
         * ---------------------------------------------------
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
                  isProfileActive()
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


  /* =========================================================
     TAB ACTIVATION
     ========================================================= */

  function activate(tab, opts) {

    opts = opts || {};

    if (!tab) {
      return;
    }


    var oldTab =
      currentTab();

    var oldPanel =
      oldTab
        ? panels[oldTab.id]
        : null;

    var newPanel =
      panels[tab.id];


    if (!newPanel) {
      return;
    }


    if (oldPanel === newPanel) {

      if (opts.focus) {
        tab.focus();
      }

      return;

    }


    /*
     * -------------------------------------------------------
     * CHANGE ACTIVE TAB FIRST
     * -------------------------------------------------------
     */

    setTabStates(tab);


    /*
     * -------------------------------------------------------
     * UPDATE HEADER IMMEDIATELY
     * -------------------------------------------------------
     *
     * This MUST happen before the early return below.
     *
     * Otherwise switching panels can leave the nav in the
     * previous Profile state until the next scroll event.
     * -------------------------------------------------------
     */

    if (
      tab.getAttribute("aria-controls") ===
      "panel-profile"
    ) {

      resetProfileHeaderState();

    } else {

      setNonProfileHeaderState();

    }


    /*
     * -------------------------------------------------------
     * UPDATE HASH
     * -------------------------------------------------------
     */

    if (
      opts.updateHash !== false
    ) {

      history.replaceState(
        null,
        "",
        "#" +
          tab
            .getAttribute("aria-controls")
            .replace("panel-", "")
      );

    }


    if (opts.focus) {
      tab.focus();
    }


    /*
     * -------------------------------------------------------
     * INSTANT / INITIAL PANEL
     * -------------------------------------------------------
     */

    if (
      !oldPanel ||
      opts.instant
    ) {

      if (oldPanel) {

        oldPanel.classList.remove(
          "is-active"
        );

        oldPanel.hidden = true;

      }


      newPanel.hidden = false;

      newPanel.classList.add(
        "is-active"
      );


      return;

    }


    /*
     * -------------------------------------------------------
     * PANEL FADE
     * -------------------------------------------------------
     */

    oldPanel.classList.add(
      "is-fading"
    );


    window.setTimeout(
      function () {

        oldPanel.classList.remove(
          "is-active",
          "is-fading"
        );

        oldPanel.hidden = true;


        newPanel.hidden = false;

        newPanel.classList.add(
          "is-fading",
          "is-active"
        );


        void newPanel.offsetWidth;


        newPanel.classList.remove(
          "is-fading"
        );

      },
      FADE_MS
    );


    /*
     * -------------------------------------------------------
     * SCROLL TO TOP
     * -------------------------------------------------------
     */

    if (
      opts.scroll !== false
    ) {

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

    }

  }


  /* =========================================================
     TAB CLICK / KEYBOARD
     ========================================================= */

  tabs.forEach(
    function (tab, index) {

      tab.addEventListener(
        "click",
        function () {

          activate(tab);

        }
      );


      tab.addEventListener(
        "keydown",
        function (event) {

          var newIndex = null;


          if (
            event.key === "ArrowRight"
          ) {

            newIndex =
              (index + 1) %
              tabs.length;

          }

          else if (
            event.key === "ArrowLeft"
          ) {

            newIndex =
              (
                index -
                1 +
                tabs.length
              ) %
              tabs.length;

          }

          else if (
            event.key === "Home"
          ) {

            newIndex = 0;

          }

          else if (
            event.key === "End"
          ) {

            newIndex =
              tabs.length - 1;

          }


          if (
            newIndex !== null
          ) {

            event.preventDefault();

            activate(
              tabs[newIndex],
              {
                focus: true
              }
            );

          }

        }
      );

    }
  );


  /* =========================================================
     INTERNAL DATA-TAB LINKS
     ========================================================= */

  document
    .querySelectorAll("[data-tab]")
    .forEach(
      function (link) {

        link.addEventListener(
          "click",
          function (event) {

            event.preventDefault();


            activate(
              document.getElementById(
                link.getAttribute(
                  "data-tab"
                )
              )
            );

          }
        );

      }
    );


  /* =========================================================
     INITIAL TAB
     ========================================================= */

  var initial =
    tabs[0];

  var hash =
    window.location.hash.replace(
      "#",
      ""
    );


  if (hash) {

    var matched =
      tabs.find(
        function (tab) {

          return (
            tab.getAttribute(
              "aria-controls"
            ) ===
            "panel-" + hash
          );

        }
      );


    if (matched) {
      initial = matched;
    }

  }


  activate(
    initial,
    {
      updateHash: false,
      instant: true,
      scroll: false
    }
  );


  /* =========================================================
     HEADER INITIALISATION
     ========================================================= */

  setNavProgress(
    isProfileActive()
      ? 0
      : 1
  );


  if (isProfileActive()) {

    hideHeaderTitle();

    navCentered = false;

    nav.classList.add(
      "is-following-scroll"
    );

    siteHeader.classList.remove(
      "is-compact"
    );

  } else {

    setNonProfileHeaderState();

  }


  updateHeaderProgress();
/* =========================================================
   PROJECTS
   ========================================================= */

var projectsList =
    document.getElementById("projects-list");

var projectFieldFilters =
    document.getElementById("project-field-filters");

var projectToolFilters =
    document.getElementById("project-tool-filters");

var activeFields = ["All"];

var activeTools = ["All"];


function getUniqueProjectTags(key) {

    var tags = [];

    PROJECTS.forEach(function (project) {

        (project[key] || []).forEach(function (tag) {

            if (!tags.includes(tag)) {
                tags.push(tag);
            }

        });

    });

    return tags.sort();
}


function createProjectFilter(
    container,
    label,
    type
) {

    var button =
        document.createElement("button");

    button.type = "button";

    button.className =
        "project-filter-button";

    button.textContent =
        label;


    var activeFilters =
        type === "field"
            ? activeFields
            : activeTools;


    if (activeFilters.includes(label)) {
        button.classList.add("is-active");
    }


    button.addEventListener(
        "click",
        function () {

            var filters =
                type === "field"
                    ? activeFields
                    : activeTools;


            /*
             * ---------------------------------------------
             * "All" is mutually exclusive.
             * ---------------------------------------------
             */

            if (label === "All") {

                if (type === "field") {
                    activeFields = ["All"];
                } else {
                    activeTools = ["All"];
                }

            }


            /*
             * ---------------------------------------------
             * Selecting another filter removes "All"
             * and toggles the selected option.
             * ---------------------------------------------
             */

            else {

                var allIndex =
                    filters.indexOf("All");

                if (allIndex !== -1) {
                    filters.splice(allIndex, 1);
                }


                var index =
                    filters.indexOf(label);


                if (index === -1) {

                    filters.push(label);

                } else {

                    filters.splice(index, 1);

                }


                /*
                 * If nothing remains selected,
                 * automatically return to All.
                 */

                if (filters.length === 0) {

                    filters.push("All");

                }

            }


            renderProjectFilters();

            renderProjects();

        }
    );


    container.appendChild(button);
}


function renderProjectFilters() {

    if (
        !projectFieldFilters ||
        !projectToolFilters
    ) {
        return;
    }


    projectFieldFilters.innerHTML = "";

    projectToolFilters.innerHTML = "";


    createProjectFilter(
        projectFieldFilters,
        "All",
        "field"
    );


    getUniqueProjectTags("fields")
        .forEach(function (field) {

            createProjectFilter(
                projectFieldFilters,
                field,
                "field"
            );

        });


    createProjectFilter(
        projectToolFilters,
        "All",
        "tool"
    );


    getUniqueProjectTags("tools")
        .forEach(function (tool) {

            createProjectFilter(
                projectToolFilters,
                tool,
                "tool"
            );

        });
}


function projectMatchesFilters(project) {

    var matchesField =
        activeFields.includes("All") ||
        activeFields.some(function (field) {

            return (project.fields || []).includes(field);

        });


    var matchesTool =
        activeTools.includes("All") ||
        activeTools.some(function (tool) {

            return (project.tools || []).includes(tool);

        });


    return matchesField && matchesTool;
}


function renderProjects() {

    if (!projectsList) {
        return;
    }


    projectsList.innerHTML = "";


    PROJECTS
        .filter(projectMatchesFilters)
        .forEach(function (project) {

            var entry =
                document.createElement("article");

            entry.className =
                "project-entry";


            /*
             * -------------------------------------------------
             * Left side
             * -------------------------------------------------
             */

            var left =
                document.createElement("div");

            left.className =
                "project-information";


            var title =
                document.createElement("h3");

            title.textContent =
                project.title;

            left.appendChild(title);


            if (project.subtitle) {

                var subtitle =
                    document.createElement("p");

                subtitle.className =
                    "project-subtitle";

                subtitle.textContent =
                    project.subtitle;

                left.appendChild(subtitle);

            }


            /*
 * -------------------------------------------------
 * Tags
 * -------------------------------------------------
 */

var tags =
    document.createElement("div");

tags.className =
    "project-tags";


/*
 * Field tags — row 1
 */

if (
    project.fields &&
    project.fields.length
) {

    var fieldRow =
        document.createElement("div");

    fieldRow.className =
        "project-tag-row";


    project.fields.forEach(function (field) {

        var tag =
            document.createElement("span");

        tag.textContent =
            field;

        fieldRow.appendChild(tag);

    });


    tags.appendChild(fieldRow);
}


/*
 * Tool tags — row 2
 */

if (
    project.tools &&
    project.tools.length
) {

    var toolRow =
        document.createElement("div");

    toolRow.className =
        "project-tag-row";


    project.tools.forEach(function (tool) {

        var tag =
            document.createElement("span");

        tag.textContent =
            tool;

        toolRow.appendChild(tag);

    });


    tags.appendChild(toolRow);
}


if (tags.children.length) {
    left.appendChild(tags);
}


            /*
             * -------------------------------------------------
             * Right side
             * -------------------------------------------------
             */

            var right =
                document.createElement("div");

            right.className =
                "project-description";


            if (project.description) {

                var description =
                    document.createElement("p");

                description.textContent =
                    project.description;

                right.appendChild(description);

            }


            if (project.repository) {

                var repository =
                    document.createElement("a");

                repository.href =
                    project.repository;

                repository.target =
                    "_blank";

                repository.rel =
                    "noopener noreferrer";

                repository.textContent =
                    "Visit repository →";

                repository.className =
                    "project-repository";

                right.appendChild(repository);

            }


            entry.appendChild(left);

            entry.appendChild(right);

            projectsList.appendChild(entry);

        });
}


renderProjectFilters();

renderProjects();
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


  /* =========================================================
     SCROLL / RESIZE
     ========================================================= */

  window.addEventListener(
    "scroll",
    updateHeaderProgress,
    {
      passive: true
    }
  );


  window.addEventListener(
    "resize",
    updateHeaderProgress
  );

})();