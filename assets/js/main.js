/* OCR Agent 展示站交互脚本：导航、滚动显现、灯箱（无外部依赖） */
(function () {
  "use strict";

  /* ---------- 顶部导航：滚动阴影 ---------- */
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- 移动端菜单 ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") nav.classList.remove("is-open");
    });
  }

  /* ---------- 滚动显现 ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (revealEls.length) {
    if (reduced || !("IntersectionObserver" in window)) {
      revealEls.forEach(function (el) { el.classList.add("is-visible"); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
      revealEls.forEach(function (el) { io.observe(el); });
    }
  }

  /* ---------- 截图灯箱 ---------- */
  var lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-label", "截图预览");
  lightbox.innerHTML =
    '<button class="lightbox-close" aria-label="关闭预览">✕</button><img alt="">';
  document.body.appendChild(lightbox);
  var lbImg = lightbox.querySelector("img");
  var lbClose = lightbox.querySelector(".lightbox-close");

  function openLb(src, alt) {
    lbImg.src = src;
    lbImg.alt = alt || "";
    lightbox.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }
  function closeLb() {
    lightbox.classList.remove("is-open");
    document.body.style.overflow = "";
    setTimeout(function () { lbImg.src = ""; }, 200);
  }

  document.querySelectorAll("[data-lightbox]").forEach(function (frame) {
    frame.addEventListener("click", function () {
      var img = frame.querySelector("img");
      if (img) openLb(img.getAttribute("src"), img.alt);
    });
  });
  lightbox.addEventListener("click", closeLb);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && lightbox.classList.contains("is-open")) closeLb();
  });
  if (lbClose) lbClose.addEventListener("click", closeLb);

  /* ---------- 页脚年份 ---------- */
  var yearEl = document.getElementById("footer-year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
