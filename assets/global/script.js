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
     ========================================================= */

  function setNonProfileHeaderState() {

    window.clearTimeout(
      titleFadeTimer
    );

    window.clearTimeout(
      navReturnTimer
    );

    titleFadeTimer = null;

    navReturnTimer = null;


    navCentered = true;


    nav.classList.remove(
      "is-following-scroll"
    );


    setNavProgress(1);


    showHeaderTitle();


    siteHeader.classList.add(
      "is-compact"
    );


    siteHeader.style.setProperty(
      "--header-border-opacity",
      "0.25"
    );

  }


  /* =========================================================
     PROFILE HEADER RESET
     ========================================================= */

  function resetProfileHeaderState() {

    window.clearTimeout(
      titleFadeTimer
    );

    window.clearTimeout(
      navReturnTimer
    );

    titleFadeTimer = null;

    navReturnTimer = null;


    navCentered = false;


    hideHeaderTitle();


    nav.classList.remove(
      "is-following-scroll"
    );

    setNavProgress(0);


    siteHeader.classList.remove(
      "is-compact"
    );


    siteHeader.style.setProperty(
      "--header-border-opacity",
      "0"
    );


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


    nav.classList.remove(
      "is-following-scroll"
    );


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


    if (!isProfileActive()) {

      setNonProfileHeaderState();

      return;

    }


    /* -------------------------------------------------------
       SCROLL DIRECTION
       ------------------------------------------------------- */

    var currentScrollY =
      window.scrollY;

    scrollingUp =
      currentScrollY < lastScrollY;

    lastScrollY =
      currentScrollY;


    /* -------------------------------------------------------
       LARGE TITLE POSITION
       ------------------------------------------------------- */

    var titleRect =
      heroTitle.getBoundingClientRect();

    var titleHeight =
      titleRect.height;


    /* =======================================================
       BORDER
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


      if (
        navCentered &&
        titleRect.top >= 0
      ) {

        window.clearTimeout(
          navReturnTimer
        );


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

          returnNavToRight();

        }


        return;

      }


      if (navCentered) {

        return;

      }


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


      var eased =
        progress *
        progress *
        (3 - 2 * progress);


      setNavProgress(
        eased
      );


      if (
        progress >= 0.98
      ) {

        setNavProgress(1);


        nav.classList.remove(
          "is-following-scroll"
        );


        navCentered = true;


        siteHeader.classList.add(
          "is-compact"
        );


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


    setTabStates(tab);


    if (
      tab.getAttribute("aria-controls") ===
      "panel-profile"
    ) {

      resetProfileHeaderState();

    } else {

      setNonProfileHeaderState();

    }


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
    document.getElementById(
      "projects-list"
    );

  var projectFieldFilters =
    document.getElementById(
      "project-field-filters"
    );

  var projectToolFilters =
    document.getElementById(
      "project-tool-filters"
    );

  var activeFields = [];

  var activeTools = [];


  /* =========================================================
     OPEN PROJECTS PANEL
     ========================================================= */

  window.openProjectsPanel =
    function (fields) {

      var projectsTab =
        tabs.find(function (tab) {

          return (
            tab.getAttribute(
              "aria-controls"
            ) ===
            "panel-projects"
          );

        });


      if (!projectsTab) {
        return;
      }


      if (
        Array.isArray(fields) &&
        typeof window.showProjectsWithFields ===
          "function"
      ) {

        window.showProjectsWithFields(
          fields
        );

      }


      activate(projectsTab);

    };


  /* =========================================================
     PROJECT FILTERS
     ========================================================= */

  function getUniqueProjectTags(key) {

    var tags = [];


    PROJECTS.forEach(function (project) {

      (project[key] || [])
        .forEach(function (tag) {

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
      document.createElement(
        "button"
      );

    button.type = "button";

    button.className =
      "project-filter-button";

    button.textContent =
      label;


    var activeFilters =
      type === "field"
        ? activeFields
        : activeTools;


    if (
      (
        label === "All" &&
        activeFilters.length === 0
      ) ||
      activeFilters.includes(label)
    ) {

      button.classList.add(
        "is-active"
      );

    }


    button.addEventListener(
      "click",
      function () {

        var filters =
          type === "field"
            ? activeFields
            : activeTools;


        if (label === "All") {

          if (type === "field") {
            activeFields = [];
          } else {
            activeTools = [];
          }

        } else {

          var allIndex =
            filters.indexOf("All");


          if (allIndex !== -1) {
            filters.splice(
              allIndex,
              1
            );
          }


          var index =
            filters.indexOf(label);


          if (index === -1) {

            filters.push(label);

          } else {

            filters.splice(
              index,
              1
            );

          }

        }


        renderProjectFilters();

        renderProjects();

      }
    );


    container.appendChild(
      button
    );

  }


  function renderProjectFilters() {

    if (
      !projectFieldFilters ||
      !projectToolFilters
    ) {
      return;
    }


    projectFieldFilters.innerHTML =
      "";

    projectToolFilters.innerHTML =
      "";


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


  function projectMatchesFilters(
    project
  ) {

    var matchesFields =
      activeFields.length === 0 ||
      activeFields.every(
        function (field) {

          return (
            project.fields || []
          ).includes(field);

        }
      );


    var matchesTools =
      activeTools.length === 0 ||
      activeTools.every(
        function (tool) {

          return (
            project.tools || []
          ).includes(tool);

        }
      );


    return (
      matchesFields &&
      matchesTools
    );

  }


  /* =========================================================
     PROJECT MARKDOWN
     ========================================================= */

 function getProjectContentUrl(project) {

  if (!project.content) {
    return null;
  }

  return project.content;

}


  /* =========================================================
     LOCAL ASSET URL RESOLUTION
     ========================================================= */

  function resolveLocalAssetUrl(
    source,
    contentUrl
  ) {

    if (!source) {
      return source;
    }


    /*
     * Absolute URLs / data URLs remain untouched.
     */

    if (
      source.startsWith("http://") ||
      source.startsWith("https://") ||
      source.startsWith("//") ||
      source.startsWith("data:")
    ) {

      return source;

    }


    /*
     * Anchor links are not assets.
     */

    if (
      source.startsWith("#")
    ) {

      return source;

    }


    try {

      return new URL(
        source,
        new URL(
          contentUrl,
          window.location.href
        )
      ).href;

    } catch (error) {

      console.warn(
        "Could not resolve local asset:",
        source
      );

      return source;

    }

  }


  /* =========================================================
     LOCAL LINK URL RESOLUTION
     ========================================================= */

  function resolveLocalLinkUrl(
    href,
    contentUrl
  ) {

    if (!href) {
      return href;
    }


    /*
     * External links.
     */

    if (
      href.startsWith("http://") ||
      href.startsWith("https://") ||
      href.startsWith("//") ||
      href.startsWith("mailto:")
    ) {

      return href;

    }


    /*
     * Internal anchors.
     */

    if (
      href.startsWith("#")
    ) {

      return href;

    }


    try {

      return new URL(
        href,
        new URL(
          contentUrl,
          window.location.href
        )
      ).href;

    } catch (error) {

      console.warn(
        "Could not resolve local Markdown link:",
        href
      );

      return href;

    }

  }


  /* =========================================================
     HTML ESCAPING
     ========================================================= */

  function escapeHtml(value) {

    return String(value || "")
      .replace(
        /&/g,
        "&amp;"
      )
      .replace(
        /</g,
        "&lt;"
      )
      .replace(
        />/g,
        "&gt;"
      )
      .replace(
        /"/g,
        "&quot;"
      )
      .replace(
        /'/g,
        "&#039;"
      );

  }


  /* =========================================================
     REMOVE MARKDOWN TITLE
     ========================================================= */

  function removeLeadingMarkdownTitle(
    markdown
  ) {

    return markdown.replace(
      /^\s*#\s+[^\n]+\n+/,
      ""
    );

  }


  /* =========================================================
     LOAD PROJECT MARKDOWN
     ========================================================= */

  async function loadProjectMarkdown(
    project,
    container
  ) {

    var contentUrl =
      getProjectContentUrl(
        project
      );


    if (!contentUrl) {

      container.innerHTML =
        "<p>No project details available.</p>";

      return;

    }


    container.innerHTML =
      "<p>Loading…</p>";


    try {

      var response =
        await fetch(
          contentUrl
        );


      if (!response.ok) {

        throw new Error(
          "Project content request failed: " +
          response.status
        );

      }


      var markdown =
        await response.text();


      /*
       * The project title is already displayed
       * by the project card.
       *
       * Therefore remove a leading H1 from the
       * Markdown document.
       */

      markdown =
        removeLeadingMarkdownTitle(
          markdown
        );


      renderProjectMarkdown(
        markdown,
        project,
        container,
        contentUrl
      );


    } catch (error) {

        console.error(
            "Could not load project content:",
            error
        );

        container.innerHTML =
            "<p>Unable to load project details.</p>" +
            "<p class=\"project-error\">" +
            escapeHtml(error.message) +
            "</p>";

    }

  }


  /* =========================================================
     RENDER PROJECT MARKDOWN
     ========================================================= */

  function renderProjectMarkdown(
    markdown,
    project,
    container,
    contentUrl
  ) {

    var html;


    /*
     * -------------------------------------------------------
     * MARKDOWN → HTML
     * -------------------------------------------------------
     */

    if (
      window.marked &&
      typeof window.marked.parse ===
        "function"
    ) {

      html =
        window.marked.parse(
          markdown,
          {
            gfm: true,
            breaks: false
          }
        );

    } else if (
      window.marked
    ) {

      html =
        window.marked(
          markdown
        );

    } else {

      html =
        "<p>" +
        escapeHtml(markdown) +
        "</p>";

    }


    /*
     * -------------------------------------------------------
     * SANITIZE
     * -------------------------------------------------------
     */

    if (
      window.DOMPurify &&
      typeof window.DOMPurify.sanitize ===
        "function"
    ) {

      html =
        window.DOMPurify.sanitize(
          html
        );

    }


    /*
     * -------------------------------------------------------
     * INSERT
     * -------------------------------------------------------
     */

    container.innerHTML =
      html;


    /*
     * -------------------------------------------------------
     * RESOLVE LOCAL IMAGES / GIFS
     * -------------------------------------------------------
     *
     * Relative image paths are resolved relative to
     * the Markdown file itself.
     *
     * For example:
     *
     * Markdown:
     *   ![Simulation](media/aquarium.gif)
     *
     * becomes:
     *
     * assets/projects/content/media/aquarium.gif
     *
     * assuming the Markdown file is located at:
     *
     * assets/projects/content/project.md
     *
     * -------------------------------------------------------
     */

    Array.prototype.forEach.call(
      container.querySelectorAll(
        "img[src]"
      ),
      function (img) {

        img.src =
          resolveLocalAssetUrl(
            img.getAttribute(
              "src"
            ),
            contentUrl
          );


        img.loading =
          "lazy";

      }
    );


    /*
     * -------------------------------------------------------
     * RESOLVE MARKDOWN LINKS
     * -------------------------------------------------------
     */

    Array.prototype.forEach.call(
      container.querySelectorAll(
        "a[href]"
      ),
      function (link) {

        var href =
          link.getAttribute(
            "href"
          );


        link.href =
          resolveLocalLinkUrl(
            href,
            contentUrl
          );


        /*
         * Keep links from interfering with
         * the project card.
         */

        if (
          !href ||
          !href.startsWith("#")
        ) {

          link.target =
            "_blank";

          link.rel =
            "noopener noreferrer";

        }

      }
    );

  }


  /* =========================================================
     RENDER PROJECTS
     ========================================================= */

  function renderProjects() {

    if (!projectsList) {
      return;
    }


    projectsList.innerHTML =
      "";


    PROJECTS
      .filter(
        projectMatchesFilters
      )
      .forEach(
        function (project) {

          var entry =
            document.createElement(
              "article"
            );

          entry.className =
            "project-entry";


          /* -------------------------------------------------
             LEFT SIDE
             ------------------------------------------------- */

          var left =
            document.createElement(
              "div"
            );

          left.className =
            "project-information";


          var title =
            document.createElement(
              "h3"
            );

          title.textContent =
            project.title;

          left.appendChild(
            title
          );


          if (
            project.subtitle
          ) {

            var subtitle =
              document.createElement(
                "p"
              );

            subtitle.className =
              "project-subtitle";

            subtitle.textContent =
              project.subtitle;

            left.appendChild(
              subtitle
            );

          }


          /* -------------------------------------------------
             TAGS
             ------------------------------------------------- */

          var tags =
            document.createElement(
              "div"
            );

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
              document.createElement(
                "div"
              );

            fieldRow.className =
              "project-tag-row";


            project.fields.forEach(
              function (field) {

                var tag =
                  document.createElement(
                    "span"
                  );

                tag.textContent =
                  field;

                fieldRow.appendChild(
                  tag
                );

              }
            );


            tags.appendChild(
              fieldRow
            );

          }


          /*
           * Tool tags — row 2
           */

          if (
            project.tools &&
            project.tools.length
          ) {

            var toolRow =
              document.createElement(
                "div"
              );

            toolRow.className =
              "project-tag-row";


            project.tools.forEach(
              function (tool) {

                var tag =
                  document.createElement(
                    "span"
                  );

                tag.textContent =
                  tool;

                toolRow.appendChild(
                  tag
                );

              }
            );


            tags.appendChild(
              toolRow
            );

          }


          if (
            tags.children.length
          ) {

            left.appendChild(
              tags
            );

          }


          /* -------------------------------------------------
             RIGHT SIDE
             ------------------------------------------------- */

          var right =
            document.createElement(
              "div"
            );

          right.className =
            "project-description";


          if (
            project.description
          ) {

            var description =
              document.createElement(
                "p"
              );

            description.textContent =
              project.description;

            right.appendChild(
              description
            );

          }


          /* -------------------------------------------------
             PROJECT ACTIONS
             ------------------------------------------------- */

          var projectActions =
            document.createElement(
              "div"
            );

          projectActions.className =
            "project-actions";


          /*
           * Details button
           */

          var detailsButton =
            document.createElement(
              "button"
            );

          detailsButton.type =
            "button";

          detailsButton.className =
            "project-details-button";

          detailsButton.textContent =
            "Details →";


          /*
           * Markdown container
           */

          var markdown =
            document.createElement(
              "div"
            );

          markdown.className =
            "project-markdown";

          markdown.hidden =
            true;


          var markdownContent =
            document.createElement(
              "div"
            );

          markdownContent.className =
            "project-markdown-content";

          markdown.appendChild(
            markdownContent
          );


          /*
           * GitHub repository link.
           *
           * GitHub is now completely independent
           * from project-content loading.
           */

          if (
            project.repository
          ) {

            var repositoryFooter =
              document.createElement(
                "div"
              );

            repositoryFooter.className =
              "project-readme-footer";


            var repository =
              document.createElement(
                "a"
              );

            repository.href =
              project.repository;

            repository.target =
              "_blank";

            repository.rel =
              "noopener noreferrer";

            repository.textContent =
              "View on GitHub →";

            repository.className =
              "project-repository";


            repositoryFooter.appendChild(
              repository
            );

            markdown.appendChild(
              repositoryFooter
            );

          }


          /*
           * Track whether the local Markdown has
           * already been loaded.
           */

          var markdownLoaded =
            false;


          /* -------------------------------------------------
             DETAILS CLICK
             ------------------------------------------------- */

          detailsButton.addEventListener(
            "click",
            function () {

              var isExpanded =
                entry.classList.contains(
                  "is-expanded"
                );


              if (
                isExpanded
              ) {

                /*
                 * Collapse.
                 */

                entry.classList.remove(
                  "is-expanded"
                );

                detailsButton.textContent =
                  "Details →";

                markdown.hidden =
                  true;

                return;

              }


              /*
               * Expand.
               */

              entry.classList.add(
                "is-expanded"
              );

              detailsButton.textContent =
                "Details ↑";

              markdown.hidden =
                false;


              /*
               * Load local Markdown only once.
               */

              if (
                !markdownLoaded
              ) {

                markdownLoaded =
                  true;

                loadProjectMarkdown(
                  project,
                  markdownContent
                );

              }

            }
          );


          projectActions.appendChild(
            detailsButton
          );


          right.appendChild(
            projectActions
          );


          entry.appendChild(
            left
          );

          entry.appendChild(
            right
          );

          entry.appendChild(
            markdown
          );


          projectsList.appendChild(
            entry
          );

        }
      );

  }


  /* =========================================================
     SHOW PROJECTS FROM RESEARCH LANDSCAPE
     =========================================================
     
     Called by research-landscape-engine.js when an
     "Intersecting Works" node is clicked.

     fields = the fields represented by that intersection.

     This shows every project containing ALL supplied fields.
     ========================================================= */

  window.showProjectsWithFields =
    function (fields) {

      activeFields =
        Array.isArray(fields)
          ? fields.slice()
          : [];


      activeTools = [];


      renderProjectFilters();

      renderProjects();

    };


  /* =========================================================
     INITIAL PROJECT RENDER
     ========================================================= */

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