/**
 * Mallow's Little Lost & Found — Main Application Orchestrator
 * Coordinates scene routing, cloud parting, Mallow character interactions,
 * the 5-click Easter egg, Cloud College discovery, and sparkle trails.
 */

(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ==========================================================================
     1. Scene Navigation & Routing
     ========================================================================== */
  const scenes = {
    home: document.getElementById("hero-scene"),
    explore: document.getElementById("explore-scene"),
    attic: document.getElementById("attic-scene"),
    wish: document.getElementById("wish-scene"),
    story: document.getElementById("story-scene"),
    secret: document.getElementById("secret-scene")
  };

  const navButtons = {
    home: document.getElementById("nav-btn-home"),
    explore: document.getElementById("nav-btn-explore"),
    attic: document.getElementById("nav-btn-attic"),
    story: document.getElementById("nav-btn-story"),
    wish: document.getElementById("nav-btn-wish"),
    secret: document.getElementById("nav-btn-secret")
  };

  const cloudCurtain = document.getElementById("cloud-curtain");

  function closeAllModals() {
    const dialogs = document.querySelectorAll("dialog");
    dialogs.forEach((d) => {
      if (typeof d.close === "function") d.close();
      else d.removeAttribute("open");
    });
  }

  window.navigateTo = function (targetKey) {
    closeAllModals();

    const targetScene = scenes[targetKey];
    if (!targetScene) return;

    // Trigger cloud parting transition specifically for Explore
    if (targetKey === "explore" && cloudCurtain && !prefersReducedMotion) {
      cloudCurtain.classList.add("active", "parting");
      setTimeout(() => {
        cloudCurtain.classList.remove("active", "parting");
      }, 700);
    }

    // Switch active scene
    Object.keys(scenes).forEach((key) => {
      const s = scenes[key];
      if (s) {
        if (key === targetKey) {
          s.removeAttribute("hidden");
          s.classList.add("active");
        } else {
          s.classList.remove("active");
          s.setAttribute("hidden", "true");
        }
      }
    });

    // Update nav pills
    Object.keys(navButtons).forEach((key) => {
      const btn = navButtons[key];
      if (btn) {
        btn.classList.toggle("active", key === targetKey);
      }
    });

    if (window.location.hash.replace("#", "").toLowerCase() !== targetKey) {
      history.replaceState(null, "", "#" + targetKey);
    }

    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    if (window.skyAudio) window.skyAudio.playChime(659.25, 0.4, 0.04);
  };

  /* ==========================================================================
     2. Mallow 5-Click Easter Egg & Secret Room
     ========================================================================== */
  let tapCount = 0;
  let bubbleTimer = null;
  const bubbleText = document.getElementById("mallow-bubble-text");
  const secretConfetti = document.getElementById("secret-confetti");

  const tapPhrases = [
    "Teehee! That tickles! (1/5) ♡",
    "Hehehe! (2/5) ☁️",
    "You're very friendly! (3/5) ✨",
    "Almost unlocked! (4/5) ⭐",
    "✨ SECRET UNLOCKED! ✨"
  ];

  function openSecretRoom() {
    window.navigateTo("secret");
    if (window.skyAudio) window.skyAudio.playFanfare();
    triggerConfetti();
  }

  function handleMallowClick() {
    tapCount++;
    if (window.skyAudio) window.skyAudio.playTickle();

    const current = Math.min(tapCount, 5);
    if (navButtons.secret) {
      navButtons.secret.querySelector("span").textContent = `🗝️ Secret (${current}/5)`;
    }

    const phrase = tapPhrases[current - 1] || "Giggle! ♡";
    if (bubbleText) bubbleText.textContent = phrase;

    if (bubbleTimer) clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(() => {
      if (bubbleText) bubbleText.textContent = "Hi! I'm Mallow ♡ Tap me 5 times!";
    }, 4000);

    if (tapCount >= 5) {
      openSecretRoom();
      tapCount = 0;
    }
  }

  function triggerConfetti() {
    if (!secretConfetti || prefersReducedMotion) return;
    secretConfetti.innerHTML = "";
    const symbols = ["★", "✦", "✧", "♡", "●", "🌸"];
    const colors = ["#ffcb3d", "#ffa8c5", "#8d7ec6", "#7be0c5", "#ffffff"];

    for (let i = 0; i < 48; i++) {
      const el = document.createElement("span");
      el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      el.style.position = "absolute";
      el.style.left = `${Math.random() * 90 + 5}%`;
      el.style.top = `${Math.random() * 20 + 5}%`;
      el.style.fontSize = `${Math.random() * 20 + 12}px`;
      el.style.color = colors[Math.floor(Math.random() * colors.length)];
      el.style.opacity = "0.95";
      el.style.transform = `rotate(${Math.random() * 360}deg)`;
      el.style.transition = `all ${Math.random() * 1200 + 800}ms cubic-bezier(0.25, 1, 0.5, 1)`;
      secretConfetti.appendChild(el);

      setTimeout(() => {
        el.style.top = `${Math.random() * 70 + 30}%`;
        el.style.opacity = "0";
        el.style.transform += ` translateY(90px) rotate(${Math.random() * 180}deg)`;
      }, 50);
    }
  }

  /* ==========================================================================
     3. Cloud College Discovery Modal
     ========================================================================== */
  const collegeModal = document.getElementById("college-detail-modal");

  window.openCollegeModal = function () {
    if (!collegeModal) return;
    if (window.skyAudio) window.skyAudio.playCollegeBell();
    if (typeof collegeModal.showModal === "function") collegeModal.showModal();
    else collegeModal.setAttribute("open", "true");
  };

  window.closeCollegeModal = function () {
    if (!collegeModal) return;
    if (typeof collegeModal.close === "function") collegeModal.close();
    else collegeModal.removeAttribute("open");
  };

  /* ==========================================================================
     4. Meet Mallow Modal
     ========================================================================== */
  const meetModal = document.getElementById("meet-mallow-modal");

  window.openMeetModal = function () {
    if (!meetModal) return;
    if (window.skyAudio) window.skyAudio.playTickle();
    if (typeof meetModal.showModal === "function") meetModal.showModal();
    else meetModal.setAttribute("open", "true");
  };

  window.closeMeetModal = function () {
    if (!meetModal) return;
    if (typeof meetModal.close === "function") meetModal.close();
    else meetModal.removeAttribute("open");
  };

  /* ==========================================================================
     5. Sparkle Cursor Particle Canvas
     ========================================================================== */
  const canvas = document.getElementById("sparkle-canvas");
  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext("2d");
    let particles = [];

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas, { passive: true });

    class Sparkle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 4 + 2;
        this.speedX = (Math.random() - 0.5) * 1.5;
        this.speedY = (Math.random() - 0.5) * 1.5 - 0.5;
        this.color = ["#ffcb3d", "#ffa8c5", "#8d7ec6", "#7be0c5", "#ffffff"][Math.floor(Math.random() * 5)];
        this.alpha = 1;
        this.decay = Math.random() * 0.025 + 0.015;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.alpha -= this.decay;
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = Math.max(this.alpha, 0);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    let lastSparkleTime = 0;
    function addParticle(x, y) {
      const now = performance.now();
      if (now - lastSparkleTime > 35 && particles.length < 50) {
        lastSparkleTime = now;
        particles.push(new Sparkle(x, y));
      }
    }

    window.addEventListener("mousemove", (e) => addParticle(e.clientX, e.clientY), { passive: true });
    window.addEventListener("touchmove", (e) => {
      if (e.touches.length > 0) addParticle(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    function renderSparkles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].alpha <= 0) {
          particles.splice(i, 1);
          i--;
        }
      }
      requestAnimationFrame(renderSparkles);
    }
    renderSparkles();
  }

  /* ==========================================================================
     6. Event Bindings on Load
     ========================================================================== */
  document.addEventListener("DOMContentLoaded", () => {
    // Nav Buttons
    if (navButtons.home) navButtons.home.addEventListener("click", () => window.navigateTo("home"));
    if (navButtons.explore) navButtons.explore.addEventListener("click", () => window.navigateTo("explore"));
    if (navButtons.attic) navButtons.attic.addEventListener("click", () => window.navigateTo("attic"));
    if (navButtons.story) navButtons.story.addEventListener("click", () => window.navigateTo("story"));
    if (navButtons.wish) navButtons.wish.addEventListener("click", () => window.navigateTo("wish"));
    if (navButtons.secret) navButtons.secret.addEventListener("click", () => openSecretRoom());

    const btnBrandHome = document.getElementById("btn-brand-home");
    if (btnBrandHome) btnBrandHome.addEventListener("click", () => window.navigateTo("home"));

    // Hero Actions
    const heroBtnExplore = document.getElementById("hero-btn-explore");
    const heroBtnWish = document.getElementById("hero-btn-wish");
    const heroBtnAttic = document.getElementById("hero-btn-attic");
    const heroBtnStory = document.getElementById("hero-btn-story");
    const heroBtnMeet = document.getElementById("hero-btn-meet");

    if (heroBtnExplore) heroBtnExplore.addEventListener("click", () => window.navigateTo("explore"));
    if (heroBtnWish) heroBtnWish.addEventListener("click", () => window.navigateTo("wish"));
    if (heroBtnAttic) heroBtnAttic.addEventListener("click", () => window.navigateTo("attic"));
    if (heroBtnStory) heroBtnStory.addEventListener("click", () => window.navigateTo("story"));
    if (heroBtnMeet) heroBtnMeet.addEventListener("click", window.openMeetModal);

    // Mallow Tap Targets
    const mallowTouchTarget = document.getElementById("mallow-touch-target");
    if (mallowTouchTarget) mallowTouchTarget.addEventListener("click", handleMallowClick);

    // Scene Back Buttons
    const btnExploreBack = document.getElementById("btn-explore-back");
    const btnAtticBack = document.getElementById("btn-attic-back");
    const btnWishBack = document.getElementById("btn-wish-back");
    const btnStoryBack = document.getElementById("btn-story-back");

    if (btnExploreBack) btnExploreBack.addEventListener("click", () => window.navigateTo("home"));
    if (btnAtticBack) btnAtticBack.addEventListener("click", () => window.navigateTo("explore"));
    if (btnWishBack) btnWishBack.addEventListener("click", () => window.navigateTo("home"));
    if (btnStoryBack) btnStoryBack.addEventListener("click", () => window.navigateTo("home"));

    // Bridge Signpost Planks on Home/Explore
    const bridgeSignAttic = document.getElementById("bridge-sign-attic");
    const bridgeSignStory = document.getElementById("bridge-sign-story");
    const bridgeSignWish = document.getElementById("bridge-sign-wish");

    if (bridgeSignAttic) bridgeSignAttic.addEventListener("click", () => window.navigateTo("attic"));
    if (bridgeSignStory) bridgeSignStory.addEventListener("click", () => window.navigateTo("story"));
    if (bridgeSignWish) bridgeSignWish.addEventListener("click", () => window.navigateTo("wish"));

    // Cloud College Pin
    const pinCloudCollege = document.getElementById("pin-cloud-college");
    const btnCloseCollegeModal = document.getElementById("btn-close-college-modal");
    const btnCloseCollegeBtn = document.getElementById("btn-close-college-btn");
    const btnRingCollegeBell = document.getElementById("btn-ring-college-bell");

    if (pinCloudCollege) pinCloudCollege.addEventListener("click", window.openCollegeModal);
    if (btnCloseCollegeModal) btnCloseCollegeModal.addEventListener("click", window.closeCollegeModal);
    if (btnCloseCollegeBtn) btnCloseCollegeBtn.addEventListener("click", window.closeCollegeModal);
    if (btnRingCollegeBell) {
      btnRingCollegeBell.addEventListener("click", () => {
        if (window.skyAudio) window.skyAudio.playCollegeBell();
        btnRingCollegeBell.textContent = "🔔 Tolling across the clouds...";
        setTimeout(() => {
          btnRingCollegeBell.textContent = "🔔 Ring the College Bell";
        }, 2500);
      });
    }

    // Star Jar Hotspot on Scene
    const starJarPinBtn = document.getElementById("star-jar-pin-btn");
    if (starJarPinBtn) starJarPinBtn.addEventListener("click", () => window.navigateTo("wish"));

    // Secret Room Buttons
    const btnSecretExplore = document.getElementById("btn-secret-explore");
    const btnSecretClose = document.getElementById("btn-secret-close");
    const footerBtnSecret = document.getElementById("footer-btn-secret");

    if (btnSecretExplore) btnSecretExplore.addEventListener("click", () => window.navigateTo("explore"));
    if (btnSecretClose) btnSecretClose.addEventListener("click", () => window.navigateTo("home"));
    if (footerBtnSecret) footerBtnSecret.addEventListener("click", openSecretRoom);

    // Meet Modal Close
    const btnCloseMeetModal = document.getElementById("btn-close-meet-modal");
    if (btnCloseMeetModal) btnCloseMeetModal.addEventListener("click", window.closeMeetModal);

    // Global ESC key closes dialogs
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeAllModals();
    });

    // Initial Routing: Check Hash or Query Params
    const rawHash = window.location.hash.replace("#", "").toLowerCase();
    const cleanHash = rawHash.split("?")[0];
    if (scenes[cleanHash]) {
      window.navigateTo(cleanHash);
    } else {
      window.navigateTo("home");
    }

    const checkUrlParams = () => {
      let urlParams = new URLSearchParams(window.location.search);
      if (window.location.hash.includes("?")) {
        const hashQuery = window.location.hash.split("?")[1];
        urlParams = new URLSearchParams(hashQuery);
      }
      if (urlParams.get("modal") === "college" && typeof window.openCollegeModal === "function") {
        setTimeout(window.openCollegeModal, 150);
      }
      if (urlParams.get("modal") === "letter" && typeof window.openTreasureDetail === "function") {
        setTimeout(() => window.openTreasureDetail("letter"), 150);
      }
      if (urlParams.get("story") === "reader" && typeof window.showReaderView === "function") {
        setTimeout(() => window.showReaderView(2), 150);
      }
    };

    if (document.readyState === "complete") {
      checkUrlParams();
    } else {
      window.addEventListener("load", checkUrlParams);
    }

    window.addEventListener("hashchange", () => {
      const h = window.location.hash.replace("#", "").split("?")[0].toLowerCase();
      if (scenes[h] && !scenes[h].classList.contains("active")) {
        window.navigateTo(h);
      }
    });
  });

})();
