// Pannelists - app.js
// Four small features: time-of-day greeting, dark-mode button, mobile menu, click-to-zoom cards.
(function () {
  "use strict";
  var root = document.documentElement;

  // 1. GREETING - changes with the visitor's local time
  var hour = new Date().getHours();
  var part = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  document.querySelector("#greeting").textContent = part + ", reader. What are we reading today?";

  // 2. DARK MODE - saved in localStorage, starts from the device setting
  var themeBtn = document.querySelector("#theme-toggle");

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    themeBtn.textContent = theme === "dark" ? "Light mode" : "Dark mode";
  }

  var saved = null;
  try { saved = localStorage.getItem("theme"); } catch (e) { /* storage blocked: ignore */ }
  var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(saved || (prefersDark ? "dark" : "light"));

  themeBtn.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    try { localStorage.setItem("theme", next); } catch (e) { /* ignore */ }
  });

  // 3. MOBILE MENU - the Menu button opens and closes the nav
  var menuBtn = document.querySelector(".nav-toggle");
  var nav = document.querySelector("#nav");

  menuBtn.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", open);
  });
  nav.addEventListener("click", function (e) {            // close after choosing a link
    if (e.target.tagName === "A") { nav.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); }
  });

  // 4. CLICK TO ZOOM - clicking a card opens it large in a pop-up
  var viewer = document.querySelector("#viewer");
  var viewerBody = document.querySelector("#viewer-body");

  document.querySelectorAll(".item").forEach(function (item) {
    var card = item.querySelector("article");
    card.tabIndex = 0;                                   // reachable with the keyboard
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", "Zoom in on " + item.querySelector("h3").textContent);

    function openViewer() {
      viewerBody.innerHTML = "";
      viewerBody.appendChild(card.cloneNode(true));      // copy of the card shown big
      viewer.style.setProperty("--accent", getComputedStyle(item).getPropertyValue("--accent"));
      viewer.showModal();
    }
    item.addEventListener("click", openViewer);
    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openViewer(); }
    });
  });

  // close with the button, a click on the dark backdrop, or the Esc key (built in)
  document.querySelector("#viewer-close").addEventListener("click", function () { viewer.close(); });
  viewer.addEventListener("click", function (e) { if (e.target === viewer) viewer.close(); });
})();
