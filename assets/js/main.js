/* ==========================================================================
   Elite Memo Pro — main.js
   Lightweight, dependency-free enhancements:
     1. Sticky header state on scroll
     2. Mobile menu (open / close / escape / outside click / resize)
     3. Smooth in-page scrolling with header offset
     4. Reveal-on-scroll animations
     5. Active section highlighting in the nav
     6. Footer year
   Everything degrades gracefully if JavaScript is unavailable.
   ========================================================================== */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------------------- */
  /* 1. Sticky header state                                                 */
  /* ---------------------------------------------------------------------- */
  var header = document.querySelector(".site-header");

  function updateHeader() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }

  /* ---------------------------------------------------------------------- */
  /* 2. Mobile menu                                                         */
  /* ---------------------------------------------------------------------- */
  var toggle = document.getElementById("nav-toggle");
  var nav = document.getElementById("primary-nav");

  function setMenu(open) {
    if (!toggle || !nav) return;
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  function closeMenu() {
    setMenu(false);
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      setMenu(!nav.classList.contains("is-open"));
    });

    // Close when a menu link is used
    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeMenu();
    });

    // Close on outside click
    document.addEventListener("click", function (event) {
      if (!nav.classList.contains("is-open")) return;
      if (nav.contains(event.target) || toggle.contains(event.target)) return;
      closeMenu();
    });

    // Close on Escape
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        closeMenu();
        toggle.focus();
      }
    });

    // Reset the menu when the layout switches back to desktop
    var desktop = window.matchMedia("(min-width: 861px)");
    var onDesktopChange = function (event) {
      if (event.matches) closeMenu();
    };
    if (desktop.addEventListener) desktop.addEventListener("change", onDesktopChange);
    else if (desktop.addListener) desktop.addListener(onDesktopChange);
  }

  /* ---------------------------------------------------------------------- */
  /* 3. Smooth in-page scrolling with header offset                         */
  /* ---------------------------------------------------------------------- */
  function headerOffset() {
    return (header ? header.offsetHeight : 0) + 16;
  }

  document.addEventListener("click", function (event) {
    var link = event.target.closest('a[href^="#"]');
    if (!link) return;

    var hash = link.getAttribute("href");
    if (!hash || hash === "#" || hash === "#top") {
      if (hash === "#top") {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
      }
      return;
    }

    var target = document.getElementById(hash.slice(1));
    if (!target) return;

    event.preventDefault();
    var top = target.getBoundingClientRect().top + window.scrollY - headerOffset();
    window.scrollTo({ top: top < 0 ? 0 : top, behavior: reduceMotion ? "auto" : "smooth" });

    // Keep the URL shareable without the browser jumping
    if (history.replaceState) history.replaceState(null, "", hash);
  });

  /* ---------------------------------------------------------------------- */
  /* 4. Reveal-on-scroll animations                                         */
  /* ---------------------------------------------------------------------- */
  var revealItems = document.querySelectorAll(".reveal");

  function showAll() {
    revealItems.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  if (reduceMotion || !("IntersectionObserver" in window)) {
    showAll();
  } else {
    // Stagger siblings that opt in with data-reveal-delay
    revealItems.forEach(function (el) {
      var delay = el.getAttribute("data-reveal-delay");
      if (delay) el.style.setProperty("--reveal-delay", delay + "ms");
    });

    var revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    revealItems.forEach(function (el) {
      revealObserver.observe(el);
    });

    // Safety net: if anything prevents the observer from firing, reveal
    // everything after a few seconds so content is never stuck hidden.
    window.setTimeout(showAll, 4000);
  }

  /* ---------------------------------------------------------------------- */
  /* 5. Active section highlighting in the nav                              */
  /* ---------------------------------------------------------------------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav__link[href^="#"]'));
  var sections = navLinks
    .map(function (link) {
      var id = link.getAttribute("href").slice(1);
      var el = document.getElementById(id);
      return el ? { link: link, el: el } : null;
    })
    .filter(Boolean);

  if (sections.length && "IntersectionObserver" in window) {
    var visible = new Map();

    var sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          visible.set(entry.target, entry.isIntersecting ? entry.intersectionRatio : 0);
        });

        var best = null;
        var bestRatio = 0;
        visible.forEach(function (ratio, el) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            best = el;
          }
        });

        sections.forEach(function (item) {
          item.link.classList.toggle("is-active", item.el === best);
        });
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    sections.forEach(function (item) {
      sectionObserver.observe(item.el);
    });
  }

  /* ---------------------------------------------------------------------- */
  /* 6. Footer year                                                         */
  /* ---------------------------------------------------------------------- */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------------------------------------------------------------------- */
  /* Init                                                                   */
  /* ---------------------------------------------------------------------- */
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
})();
