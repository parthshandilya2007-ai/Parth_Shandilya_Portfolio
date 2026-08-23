/* ==========================================================================
   PARTH SHANDILYA — PORTFOLIO main.js
   Full-stack interactive mechanics: Loader, Hero GSAP Motion, ScrollTrigger,
   Lenis Smooth Scroll, Search & Filtering, Impact Counters, Toast System,
   Copy-to-Clipboard, Back-to-Top circular indicator, and Micro-interactions.
   ========================================================================== */

(function () {
  "use strict";

  /* ------------------------------------------------------------------ */
  /* CONTENT CONSTANTS                                                  */
  /* ------------------------------------------------------------------ */
  const INITIALS = "PS";
  const NAME = "Parth Shandilya";

  /* ------------------------------------------------------------------ */
  /* CDN AVAILABILITY CHECK                                             */
  /* ------------------------------------------------------------------ */
  const HAS_GSAP = !!(window.gsap && window.ScrollTrigger);

  if (!HAS_GSAP) {
    document.documentElement.classList.add("no-anim");
    document.addEventListener("DOMContentLoaded", () => {
      const loader = document.getElementById("loader");
      if (loader) loader.classList.add("done");
      document.body.classList.remove("locked");
      initTheme();
      initForm();
      initCopyEmail();
    });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  window.addEventListener("error", () => {
    const loader = document.getElementById("loader");
    if (loader) loader.classList.add("done");
    document.body.classList.remove("locked");
  });

  /* ------------------------------------------------------------------ */
  /* HELPERS                                                            */
  /* ------------------------------------------------------------------ */
  const $  = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  const prefersReducedMotion =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const isFinePointer =
    window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* Toast Notification Helper */
  function showToast(message, type = "info") {
    const container = $("#toastContainer");
    if (!container) return;
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add("show"));
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 400);
    }, 3500);
  }

  /* Smooth scrolling through anchor clicks when Lenis is present */
  function setupSmoothAnchors() {
    $$('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (e) => {
        const id = link.getAttribute("href");
        if (id.length < 2) return;
        const target = $(id);
        if (!target) return;
        e.preventDefault();
        if (window.__lenis) {
          window.__lenis.scrollTo(target, { offset: 0, duration: 1.4 });
        } else {
          target.scrollIntoView({ behavior: "smooth" });
        }
        closeMobileMenu();
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* 1. CUSTOM CURSOR                                                   */
  /* ------------------------------------------------------------------ */
  function initCursor() {
    if (!isFinePointer || prefersReducedMotion) return;
    const dot = $(".cursor-dot");
    const ring = $(".cursor-ring");
    if (!dot || !ring) return;

    let mx = innerWidth / 2, my = innerHeight / 2;
    let rx = mx, ry = my;

    addEventListener("mousemove", (e) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
    });

    gsap.ticker.add(() => {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
    });

    const hoverables = "a, button, .skill-icon, input, textarea, .modal-panel, .project-card, .service-card, .chip-btn";
    document.addEventListener("mouseover", (e) => {
      if (e.target.closest(hoverables)) ring.classList.add("is-hover");
    });
    document.addEventListener("mouseout", (e) => {
      if (e.target.closest(hoverables)) ring.classList.remove("is-hover");
    });

    document.addEventListener("mouseleave", () => ring.style.opacity = "0");
    document.addEventListener("mouseenter", () => ring.style.opacity = "1");
  }

  /* ------------------------------------------------------------------ */
  /* 2. PARTICLE BACKGROUND                                             */
  /* ------------------------------------------------------------------ */
  function initParticles() {
    const canvas = $("#particles");
    if (!canvas || prefersReducedMotion) return;
    const ctx = canvas.getContext("2d");

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let cssW = 0, cssH = 0;
    const dots = [];
    const count = isFinePointer ? 25 : 12;
    const colors = ["#C0392B", "#B08A5E", "#e6d3c0"];

    function size() {
      cssW = canvas.offsetWidth;
      cssH = canvas.offsetHeight;
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    size();
    addEventListener("resize", size);

    for (let i = 0; i < count; i++) {
      dots.push({
        x: Math.random(),
        y: Math.random(),
        r: Math.random() * 2 + 0.6,
        vx: (Math.random() - 0.5) * 0.00035,
        vy: (Math.random() - 0.5) * 0.00035,
        a: Math.random() * 0.35 + 0.12,
        c: colors[Math.floor(Math.random() * colors.length)],
        tw: Math.random() * Math.PI * 2,
      });
    }

    let running = false;
    let rafId = null;

    function draw() {
      if (!running) return;
      ctx.clearRect(0, 0, cssW, cssH);
      dots.forEach((d) => {
        d.x += d.vx;
        d.y += d.vy;
        d.tw += 0.01;
        if (d.x < 0 || d.x > 1) d.vx *= -1;
        if (d.y < 0 || d.y > 1) d.vy *= -1;

        ctx.beginPath();
        ctx.arc(d.x * cssW, d.y * cssH, d.r, 0, Math.PI * 2);
        ctx.fillStyle = d.c;
        ctx.globalAlpha = d.a * (0.6 + 0.4 * Math.sin(d.tw));
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      rafId = requestAnimationFrame(draw);
    }
    function start() { if (!running) { running = true; draw(); } }
    function stop() { running = false; if (rafId) cancelAnimationFrame(rafId); rafId = null; }

    new IntersectionObserver(([entry]) => {
      entry.isIntersecting && !document.hidden ? start() : stop();
    }, { threshold: 0 }).observe(canvas);

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stop();
      else {
        const r = canvas.getBoundingClientRect();
        if (r.top < innerHeight && r.bottom > 0) start();
      }
    });

    // start(); // Disabled for performance: Canvas animations can cause severe scroll jitter on some devices.
  }

  /* ------------------------------------------------------------------ */
  /* 3. WORD SPLIT                                                      */
  /* ------------------------------------------------------------------ */
  function splitWords(root) {
    $$("[data-split-word]", root || document).forEach((el) => {
      const words = el.textContent.trim().split(/\s+/);
      el.innerHTML = words
        .map((w) => `<span class="word"><span class="word-inner">${w}</span></span>`)
        .join(" ");
    });
  }

  /* ------------------------------------------------------------------ */
  /* 4. PAGE LOADER → HERO ENTRANCE                                     */
  /* ------------------------------------------------------------------ */
  function initIntro() {
    document.body.classList.add("locked");
    splitWords(document);

    const loader = $("#loader");
    const bar = $(".loader-bar span", loader);
    const initials = $(".loader-initials", loader);
    if (initials) initials.textContent = INITIALS;

    const timeline = gsap.timeline();

    timeline
      .fromTo(initials, { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" })
      .to(bar, { scaleX: 1, duration: 1.0, ease: "power2.inOut" }, "-=0.25")
      .add(() => loader.classList.add("done"))
      .add(() => document.body.classList.remove("locked"), "-=0.4")
      .fromTo(".hero-eyebrow",
        { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" })
      .fromTo(".hero-title .word-inner",
        { yPercent: 120 }, { yPercent: 0, duration: 0.9, ease: "power4.out", stagger: 0.09 }, "-=0.35")
      .fromTo(".hero-tagline .word-inner",
        { yPercent: 120 }, { yPercent: 0, duration: 0.8, ease: "power4.out", stagger: 0.06 }, "-=0.55")
      .fromTo(".hero-desc",
        { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, "-=0.5")
      .fromTo(".hero-ctas > *",
        { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.1 }, "-=0.5")
      .fromTo(".hero-socials li",
        { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(2)", stagger: 0.07 }, "-=0.4")
      .fromTo(".hero-photo",
        { opacity: 0, scale: 0.9, filter: "blur(12px)" },
        { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1.1, ease: "power3.out" }, "-=1.1")
      .fromTo(".hero-photo-ring",
        { opacity: 0 }, { opacity: 1, duration: 1.2 }, "-=0.9")
      .fromTo(".scroll-hint",
        { opacity: 0 }, { opacity: 1, duration: 0.8 }, "-=0.8");

    if (prefersReducedMotion) {
      timeline.progress(1);
    }
  }

  /* ------------------------------------------------------------------ */
  /* 5. HERO PARALLAX + REVEALS + IMPACT COUNTERS                       */
  /* ------------------------------------------------------------------ */
  function initScrollAnimations() {
    if (!prefersReducedMotion) {
      gsap.to(".hero-photo", {
        yPercent: 12,
        ease: "none",
        scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: 0.6 },
      });
    }

    gsap.utils.toArray(".reveal").forEach((el) => {
      if (el.classList.contains("skill-icon")) return;
      gsap.fromTo(el,
        { opacity: 0, y: 46 },
        {
          opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
        }
      );
    });

    const skillIcons = $$(".skill-icon");
    if (skillIcons.length) {
      gsap.fromTo(skillIcons,
        { opacity: 0, scale: 0.5, y: 20 },
        {
          opacity: 1, scale: 1, y: 0,
          duration: 0.6, ease: "back.out(1.8)", stagger: 0.06,
          scrollTrigger: { trigger: "#skills .skills-grid", start: "top 80%" },
        }
      );
    }

    $$(".meter").forEach((meter) => {
      const fill = $(".meter-fill", meter);
      const val = $(".meter-val", meter);
      const target = parseInt(fill.dataset.fill, 10);
      gsap.to(fill, {
        width: target + "%",
        duration: 1.4,
        ease: "power3.inOut",
        scrollTrigger: { trigger: meter, start: "top 85%" },
      });
      const obj = { n: 0 };
      gsap.to(obj, {
        n: target,
        duration: 1.4,
        ease: "power3.inOut",
        scrollTrigger: { trigger: meter, start: "top 85%" },
        onUpdate: () => { val.textContent = Math.round(obj.n) + "%"; },
      });
    });

    // Impact Statistics Count-up
    $$(".stat-number").forEach((stat) => {
      const target = parseInt(stat.dataset.target, 10);
      const suffix = stat.querySelector("span") ? stat.querySelector("span").outerHTML : "";
      const obj = { n: 0 };

      gsap.to(obj, {
        n: target,
        duration: 1.8,
        ease: "power3.out",
        scrollTrigger: { trigger: stat, start: "top 85%" },
        onUpdate: () => {
          stat.innerHTML = Math.round(obj.n) + suffix;
        },
      });
    });

    const lineFill = $(".timeline-line-fill");
    if (lineFill) {
      gsap.fromTo(lineFill,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: "#timeline", start: "top 70%", end: "bottom 30%", scrub: 0.6 },
        }
      );
    }
  }

  /* ------------------------------------------------------------------ */
  /* 6. NAVBAR & PROGRESS BAR                                           */
  /* ------------------------------------------------------------------ */
  function initNav() {
    const navbar = $("#navbar");

    ScrollTrigger.create({
      trigger: document.body,
      start: 10,
      onUpdate: (self) => navbar.classList.toggle("scrolled", self.scroll() > 10),
    });

    gsap.fromTo("#progressBar",
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: 0.3 },
      }
    );

    const sections = $$("section[id]");
    const links = $$(".nav-links .nav-link");
    sections.forEach((sec) => {
      ScrollTrigger.create({
        trigger: sec,
        start: "top 55%",
        end: "bottom 55%",
        onToggle: (self) => {
          if (!self.isActive) return;
          links.forEach((l) =>
            l.classList.toggle("active", l.getAttribute("href") === "#" + sec.id)
          );
        },
      });
    });

    const burger = $("#navBurger");
    const overlay = $("#navOverlay");
    if (burger && overlay) {
      burger.addEventListener("click", () => {
        burger.classList.toggle("open");
        overlay.classList.toggle("open");
      });
    }
  }

  function closeMobileMenu() {
    const burger = $("#navBurger");
    const overlay = $("#navOverlay");
    if (burger && burger.classList.contains("open")) {
      burger.classList.remove("open");
      overlay.classList.remove("open");
    }
  }

  /* ------------------------------------------------------------------ */
  /* 7. 3D TILT CARD                                                    */
  /* ------------------------------------------------------------------ */
  function initTilt() {
    const card = $("#tiltCard");
    if (!card || !isFinePointer || prefersReducedMotion) return;

    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      const rotateY = (px - 0.5) * 14;
      const rotateX = (0.5 - py) * 14;

      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      card.style.setProperty("--mx", (px * 100).toFixed(1) + "%");
      card.style.setProperty("--my", (py * 100).toFixed(1) + "%");
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
    });
  }

  /* ------------------------------------------------------------------ */
  /* 8. PROJECT FILTERING & SEARCH                                      */
  /* ------------------------------------------------------------------ */
  function initFilters() {
    const buttons = $$(".filter-btn");
    const cards = $$(".project-card");
    const searchInput = $("#projectSearch");

    let currentFilter = "all";
    let searchQuery = "";

    function applyFilterAndSearch() {
      cards.forEach((card) => {
        const categoryMatch = currentFilter === "all" || card.dataset.category === currentFilter;
        const cardText = (card.textContent + " " + (card.dataset.keywords || "")).toLowerCase();
        const searchMatch = !searchQuery || cardText.includes(searchQuery);

        const isVisible = categoryMatch && searchMatch;
        card.classList.toggle("is-filtered", !isVisible);
      });

      const visible = cards.filter((c) => !c.classList.contains("is-filtered"));
      if (visible.length) {
        gsap.fromTo(visible,
          { opacity: 0, scale: 0.88, y: 20 },
          { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "back.out(1.5)", stagger: 0.05, overwrite: "auto" }
        );
      }
    }

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        buttons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        currentFilter = btn.dataset.filter;
        applyFilterAndSearch();
      });
    });

    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        searchQuery = e.target.value.trim().toLowerCase();
        applyFilterAndSearch();
      });
    }
  }

  /* ------------------------------------------------------------------ */
  /* 9. MODALS (PROJECTS & RESUME)                                      */
  /* ------------------------------------------------------------------ */
  function initModals() {
    document.addEventListener("click", (e) => {
      const trigger = e.target.closest("[data-modal]");
      if (trigger) {
        const targetId = trigger.dataset.modal;
        openModal($("#" + targetId));
      }
      if (e.target.closest("[data-close]")) {
        const modal = e.target.closest(".modal");
        if (modal) closeModal(modal);
      }
    });

    addEventListener("keydown", (e) => {
      if (e.key === "Escape") $$(".modal.open").forEach(closeModal);
    });
  }

  function openModal(modal) {
    if (!modal) return;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeModal(modal) {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  /* ------------------------------------------------------------------ */
  /* 10. RIPPLE, CHIPS & MAGNETIC BUTTONS                               */
  /* ------------------------------------------------------------------ */
  function initButtons() {
    $$(".ripple-trigger").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const r = btn.getBoundingClientRect();
        const d = Math.max(r.width, r.height);
        const ink = document.createElement("span");
        ink.className = "ripple-ink";
        ink.style.width = ink.style.height = d + "px";
        ink.style.left = (e.clientX - r.left - d / 2) + "px";
        ink.style.top = (e.clientY - r.top - d / 2) + "px";
        btn.appendChild(ink);
        ink.addEventListener("animationend", () => ink.remove());
      });
    });

    // Project Type Chips Toggle
    $$(".chip-btn").forEach((chip) => {
      chip.addEventListener("click", () => {
        $$(".chip-btn").forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");
      });
    });

    if (!isFinePointer || prefersReducedMotion) return;
    $$(".btn, .social-chip, .hero-socials a, .copy-btn").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.22;
        const y = (e.clientY - r.top - r.height / 2) * 0.22;
        el.style.transform = `translate(${x}px, ${y}px)`;
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "translate(0, 0)";
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* 11. COPY EMAIL TO CLIPBOARD                                        */
  /* ------------------------------------------------------------------ */
  function initCopyEmail() {
    const copyBtn = $("#copyEmailBtn");
    const emailLink = $("#contactEmail");
    if (!copyBtn || !emailLink) return;

    copyBtn.addEventListener("click", () => {
      const email = emailLink.textContent.trim();
      navigator.clipboard.writeText(email).then(() => {
        copyBtn.classList.add("copied");
        showToast("Email address copied to clipboard!", "success");
        setTimeout(() => copyBtn.classList.remove("copied"), 2200);
      }).catch(() => {
        showToast("Could not copy email.", "info");
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* 12. CONTACT FORM                                                   */
  /* ------------------------------------------------------------------ */
  function initForm() {
    const form = $("#contactForm");
    if (!form) return;
    const note = $("#formNote");

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();

      if (!name || !email || !message) {
        note.textContent = "Please fill in all required fields.";
        note.className = "form-note err";
        showToast("Please fill in all required fields.", "info");
        return;
      }
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        note.textContent = "Please enter a valid email address.";
        note.className = "form-note err";
        showToast("Invalid email address.", "info");
        return;
      }

      const btn = $("#submitBtn");
      btn.classList.add("loading");

      setTimeout(() => {
        btn.classList.remove("loading");
        btn.classList.add("success");
        note.textContent = "Message sent successfully — I will get back to you shortly!";
        note.className = "form-note ok";
        showToast("Message sent! Thanks for reaching out.", "success");
        form.reset();
        setTimeout(() => btn.classList.remove("success"), 4000);
      }, 1400);
    });
  }

  /* ------------------------------------------------------------------ */
  /* 13. BACK TO TOP BUTTON WITH CIRCULAR SCROLL INDICATOR               */
  /* ------------------------------------------------------------------ */
  function initBackToTop() {
    const btt = $("#backToTop");
    const ringFill = $("#ringFill");
    if (!btt || !ringFill) return;

    const maxDash = 125.6; // 2 * pi * r (r=20)

    function updateProgress() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.max(0, Math.min(1, scrollTop / (docHeight || 1)));

      ringFill.style.strokeDashoffset = maxDash * (1 - progress);

      if (scrollTop > 300) {
        btt.classList.add("visible");
      } else {
        btt.classList.remove("visible");
      }
    }

    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();

    btt.addEventListener("click", () => {
      if (window.__lenis) {
        window.__lenis.scrollTo(0, { duration: 1.2 });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }

  /* ------------------------------------------------------------------ */
  /* 14. THEME TOGGLE                                                   */
  /* ------------------------------------------------------------------ */
  function storageGet(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }
  function storageSet(key, val) { try { localStorage.setItem(key, val); } catch (e) { /* ignore */ } }

  function initTheme() {
    const toggle = $("#themeToggle");
    if (!toggle) return;
    const stored = storageGet("portfolio-theme");
    if (stored) document.documentElement.dataset.theme = stored;

    toggle.addEventListener("click", () => {
      const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      storageSet("portfolio-theme", next);
      showToast(`Switched to ${next} mode`, "info");
    });
  }

  /* ------------------------------------------------------------------ */
  /* 15. LENIS SMOOTH SCROLL                                            */
  /* ------------------------------------------------------------------ */
  function initLenis() {
    if (typeof Lenis === "undefined") return;
    const lenis = new Lenis({ duration: 0.4, smoothWheel: true });
    window.__lenis = lenis;

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  /* ------------------------------------------------------------------ */
  /* 16. INIT ALL                                                       */
  /* ------------------------------------------------------------------ */
  document.addEventListener("DOMContentLoaded", () => {
    document.body.classList.add("grain");
    const yearEl = $("#year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    try {
      initTheme();
      // initLenis(); // Disabled to remove scroll input delay.
      initCursor();
      initParticles();
      initButtons();
      initTilt();
      initModals();
      initFilters();
      initNav();
      setupSmoothAnchors();
      initScrollAnimations();
      initForm();
      initCopyEmail();
      initBackToTop();
      initIntro();

      addEventListener("load", () => ScrollTrigger.refresh());
      setTimeout(() => ScrollTrigger.refresh(), 600);
    } catch (err) {
      const loader = $("#loader");
      if (loader) loader.classList.add("done");
      document.body.classList.remove("locked");
    }

    setTimeout(() => {
      const loader = $("#loader");
      if (loader && !loader.classList.contains("done")) {
        loader.classList.add("done");
        document.body.classList.remove("locked");
        if (window.ScrollTrigger) ScrollTrigger.refresh();
      }
    }, 5000);
  });
})();
