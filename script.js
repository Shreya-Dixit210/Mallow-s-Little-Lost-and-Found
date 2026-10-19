/**
 * Mallow's Little Lost & Found — Master Interactive Redesign Script
 * Features:
 * - Connected Seamless Scene Routing (Home, Explore, Memory Attic, Wish, Storybook, Secret Room)
 * - Cloud-Parting Entrance Transition for Explore scene
 * - Interactive Cloud College location on floating island with dedicated lore & bell chime
 * - Illustrated Signposts with wooden hover physics and instant navigation
 * - Memory Attic 3-Treasure zoom, sparkle burst, and parchment story reader
 * - Central Glass Jar with flying curved-star trajectory animation and personalized confirmation
 * - 4-Story Open-Book Reader with satisfying 3D page-flip animation & keyboard controls
 * - 5-Click Mallow Easter Egg with fanfare and stardust confetti
 * - Web Audio API synthesizer for celesta lullaby, bell chimes, and star sounds
 * - Dynamic pupil tracking for Mallow
 * - Sparkle particle trail with prefers-reduced-motion support
 */

(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ==========================================================================
     1. Web Audio API Music Box & Sound Effects
     ========================================================================== */
  class SkyAudioEngine {
    constructor() {
      this.ctx = null;
      this.isMuted = true;
      this.isPlayingLullaby = false;
      this.timerId = null;
      this.noteIndex = 0;

      // Pentatonic celesta lullaby notes (Hz)
      this.melody = [
        523.25, 659.25, 783.99, 880.00, 1046.50, 880.00, 783.99, 659.25,
        587.33, 783.99, 659.25, 523.25, 587.33, 659.25, 783.99, 523.25
      ];
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume();
      }
    }

    playChime(freq, duration = 1.2, gainLevel = 0.08) {
      if (this.isMuted) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(gainLevel, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    }

    playTickle() {
      this.playChime(784, 0.35, 0.05);
      setTimeout(() => this.playChime(1046, 0.45, 0.04), 70);
    }

    playWishStar() {
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
      notes.forEach((f, i) => {
        setTimeout(() => this.playChime(f, 1.4, 0.07), i * 90);
      });
    }

    playCollegeBell() {
      const bellChord = [440.00, 554.37, 659.25, 880.00];
      bellChord.forEach((f, i) => {
        setTimeout(() => this.playChime(f, 2.0, 0.09), i * 140);
      });
    }

    playFanfare() {
      const arpeggio = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
      arpeggio.forEach((f, i) => {
        setTimeout(() => this.playChime(f, 1.6, 0.08), i * 85);
      });
    }

    startLullaby() {
      this.init();
      this.isPlayingLullaby = true;
      this.noteIndex = 0;
      this.scheduleNote();
    }

    scheduleNote() {
      if (!this.isPlayingLullaby || this.isMuted) return;
      const note = this.melody[this.noteIndex % this.melody.length];
      this.playChime(note, 1.6, 0.06);
      this.noteIndex++;
      this.timerId = setTimeout(() => this.scheduleNote(), 750);
    }

    stopLullaby() {
      this.isPlayingLullaby = false;
      if (this.timerId) {
        clearTimeout(this.timerId);
        this.timerId = null;
      }
    }

    toggle() {
      this.isMuted = !this.isMuted;
      if (this.isMuted) {
        this.stopLullaby();
      } else {
        this.startLullaby();
      }
      return !this.isMuted;
    }
  }

  const sound = new SkyAudioEngine();

  // Floating Audio Toggle in Nav
  const lullabyToggleBtn = document.getElementById("lullaby-toggle-btn");
  const lullabyText = document.getElementById("lullaby-text");
  if (lullabyToggleBtn) {
    lullabyToggleBtn.addEventListener("click", () => {
      const active = sound.toggle();
      lullabyToggleBtn.classList.toggle("active", active);
      lullabyToggleBtn.setAttribute("aria-pressed", String(active));
      if (lullabyText) {
        lullabyText.textContent = active ? "Playing" : "Lullaby";
      }
    });
  }

  /* ==========================================================================
     2. Scene Navigation & Cloud-Parting Transitions
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

  function navigateTo(targetKey) {
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

    // Update hash without extra scroll
    if (window.location.hash.replace("#", "").toLowerCase() !== targetKey) {
      history.replaceState(null, "", "#" + targetKey);
    }

    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    sound.playChime(659.25, 0.4, 0.04);
  }

  // Bind Header Navigation
  if (navButtons.home) navButtons.home.addEventListener("click", () => navigateTo("home"));
  if (navButtons.explore) navButtons.explore.addEventListener("click", () => navigateTo("explore"));
  if (navButtons.attic) navButtons.attic.addEventListener("click", () => navigateTo("attic"));
  if (navButtons.story) navButtons.story.addEventListener("click", () => navigateTo("story"));
  if (navButtons.wish) navButtons.wish.addEventListener("click", () => navigateTo("wish"));
  if (navButtons.secret) navButtons.secret.addEventListener("click", () => openSecretRoom());

  const btnBrandHome = document.getElementById("btn-brand-home");
  if (btnBrandHome) btnBrandHome.addEventListener("click", () => navigateTo("home"));

  // Bind Hero Actions
  const heroBtnExplore = document.getElementById("hero-btn-explore");
  const heroBtnWish = document.getElementById("hero-btn-wish");
  const heroBtnAttic = document.getElementById("hero-btn-attic");
  const heroBtnStory = document.getElementById("hero-btn-story");
  const heroBtnMeet = document.getElementById("hero-btn-meet");

  if (heroBtnExplore) heroBtnExplore.addEventListener("click", () => navigateTo("explore"));
  if (heroBtnWish) heroBtnWish.addEventListener("click", () => navigateTo("wish"));
  if (heroBtnAttic) heroBtnAttic.addEventListener("click", () => navigateTo("attic"));
  if (heroBtnStory) heroBtnStory.addEventListener("click", () => navigateTo("story"));
  if (heroBtnMeet) heroBtnMeet.addEventListener("click", () => openMeetModal());

  // Bind Back Buttons in Scenes
  const btnExploreBack = document.getElementById("btn-explore-back");
  const btnAtticBack = document.getElementById("btn-attic-back");
  const btnWishBackMain = document.getElementById("btn-wish-back-main");
  const btnStoryBackMain = document.getElementById("btn-story-back-main");

  if (btnExploreBack) btnExploreBack.addEventListener("click", () => navigateTo("home"));
  if (btnAtticBack) btnAtticBack.addEventListener("click", () => navigateTo("explore"));
  if (btnWishBackMain) btnWishBackMain.addEventListener("click", () => navigateTo("home"));
  if (btnStoryBackMain) btnStoryBackMain.addEventListener("click", () => navigateTo("home"));

  // Bind Illustrated Signposts in Explore Scene
  const signpostBtnAttic = document.getElementById("signpost-btn-attic");
  const signpostBtnStory = document.getElementById("signpost-btn-story");
  const signpostBtnWish = document.getElementById("signpost-btn-wish");

  if (signpostBtnAttic) signpostBtnAttic.addEventListener("click", () => navigateTo("attic"));
  if (signpostBtnStory) signpostBtnStory.addEventListener("click", () => navigateTo("story"));
  if (signpostBtnWish) signpostBtnWish.addEventListener("click", () => navigateTo("wish"));

  /* ==========================================================================
     3. Pointer-Following Eyes & Floating Physics for Mallow
     ========================================================================== */
  const pupilLeft = document.getElementById("pupil-left");
  const pupilRight = document.getElementById("pupil-right");
  const heroBtn = document.getElementById("mallow-hero-btn");
  const mallowMouth = document.getElementById("mallow-mouth");

  if (pupilLeft && pupilRight && heroBtn) {
    const maxRadius = 3.2;

    function trackPupils(x, y) {
      if (prefersReducedMotion) return;
      const rect = heroBtn.getBoundingClientRect();
      const centerX = rect.left + rect.width * 0.45;
      const centerY = rect.top + rect.height * 0.48;

      const dx = x - centerX;
      const dy = y - centerY;
      const angle = Math.atan2(dy, dx);
      const dist = Math.min(Math.hypot(dx, dy) / 40, maxRadius);

      const offsetX = Math.cos(angle) * dist;
      const offsetY = Math.sin(angle) * dist;

      pupilLeft.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      pupilRight.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    }

    window.addEventListener("mousemove", (e) => trackPupils(e.clientX, e.clientY), { passive: true });
    window.addEventListener("touchmove", (e) => {
      if (e.touches.length > 0) trackPupils(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
  }

  /* ==========================================================================
     4. Mallow Tap Reaction & 5-Click Secret Room Easter Egg
     ========================================================================== */
  let tapCount = 0;
  let bubbleTimer = null;
  const bubbleText = document.getElementById("mallow-bubble-text");
  const clickHint = document.getElementById("click-hint-badge");
  const secretConfetti = document.getElementById("secret-confetti");

  const tapPhrases = [
    "Teehee! That tickles! (1/5) ♡",
    "Hehehe! (2/5) ☁️",
    "You're very friendly! (3/5) ✨",
    "Almost unlocked! (4/5) ⭐",
    "✨ SECRET UNLOCKED! ✨"
  ];

  function openSecretRoom() {
    navigateTo("secret");
    sound.playFanfare();
    triggerConfetti();
  }

  function handleMallowClick() {
    tapCount++;
    sound.playTickle();

    if (mallowMouth) {
      mallowMouth.setAttribute("d", "M 132 118 Q 140 130 148 118");
      setTimeout(() => {
        mallowMouth.setAttribute("d", "M 133 118 Q 140 126 147 118");
      }, 500);
    }

    const current = Math.min(tapCount, 5);
    if (navButtons.secret) {
      navButtons.secret.querySelector("span").textContent = `🗝️ Secret (${current}/5)`;
    }

    const phrase = tapPhrases[current - 1] || "Giggle! ♡";
    if (bubbleText) bubbleText.textContent = phrase;
    if (clickHint) clickHint.textContent = `${current}/5 ⭐`;

    if (bubbleTimer) clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(() => {
      if (bubbleText) bubbleText.textContent = "Hi! I'm Mallow ♡";
      if (clickHint) clickHint.textContent = "Tap me! ♡";
    }, 4000);

    if (tapCount >= 5) {
      openSecretRoom();
      tapCount = 0;
    }
  }

  if (heroBtn) heroBtn.addEventListener("click", handleMallowClick);

  const btnSecretExplore = document.getElementById("btn-secret-explore");
  const btnSecretClose = document.getElementById("btn-secret-close");
  const footerBtnSecret = document.getElementById("footer-btn-secret");

  if (btnSecretExplore) btnSecretExplore.addEventListener("click", () => navigateTo("explore"));
  if (btnSecretClose) btnSecretClose.addEventListener("click", () => navigateTo("home"));
  if (footerBtnSecret) footerBtnSecret.addEventListener("click", () => openSecretRoom());

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
     5. The Cloud College (Special Island Discovery Modal)
     ========================================================================== */
  const pinCloudCollege = document.getElementById("pin-cloud-college");
  const collegeModal = document.getElementById("college-detail-modal");
  const btnCloseCollegeModal = document.getElementById("btn-close-college-modal");
  const btnCloseCollegeBtn = document.getElementById("btn-close-college-btn");
  const btnRingCollegeBell = document.getElementById("btn-ring-college-bell");

  function openCollegeModal() {
    if (!collegeModal) return;
    sound.playCollegeBell();
    if (typeof collegeModal.showModal === "function") collegeModal.showModal();
    else collegeModal.setAttribute("open", "true");
  }

  function closeCollegeModal() {
    if (!collegeModal) return;
    if (typeof collegeModal.close === "function") collegeModal.close();
    else collegeModal.removeAttribute("open");
  }

  if (pinCloudCollege) pinCloudCollege.addEventListener("click", openCollegeModal);
  if (btnCloseCollegeModal) btnCloseCollegeModal.addEventListener("click", closeCollegeModal);
  if (btnCloseCollegeBtn) btnCloseCollegeBtn.addEventListener("click", closeCollegeModal);
  if (btnRingCollegeBell) {
    btnRingCollegeBell.addEventListener("click", () => {
      sound.playCollegeBell();
      btnRingCollegeBell.textContent = "🔔 Tolling across the clouds...";
      setTimeout(() => {
        btnRingCollegeBell.textContent = "🔔 Ring the College Bell";
      }, 2500);
    });
  }

  /* ==========================================================================
     6. Memory Attic Treasures & Parchment Story Modal
     ========================================================================== */
  const atticTreasureData = {
    drawing: {
      title: "★ An Unfinished Drawing",
      story: `
        <p>Drawn in vivid turquoise crayon by eight-year-old Mia right before supper.</p>
        <p>A blue whale with little angel wings, wondering if birds ever miss the sea.</p>
        <p>“One day, Mia will remember how brave her whales were.”</p>
        <p style="text-align:center; color:#e36f97;">♥</p>
      `,
      artSvg: `
        <div style="width:220px; height:180px; padding:12px; background:#e8c68a; border:3px solid #8f5c22; border-radius:10px; box-shadow:0 14px 28px rgba(60,30,0,0.25);">
          <div style="width:100%; height:100%; border-radius:6px; overflow:hidden; background:#fffdf3;">
            <svg viewBox="0 0 100 80" style="width:100%; height:100%;">
              <ellipse cx="50" cy="46" rx="22" ry="11" fill="#78b9f7" stroke="#4a8ce8" stroke-width="1.8"/>
              <path d="M 68 46 Q 76 40 80 46 Q 76 52 68 46" fill="#78b9f7" stroke="#4a8ce8" stroke-width="1.8"/>
              <path d="M 46 38 C 42 26, 56 22, 60 36" fill="#ffffff" stroke="#fca82d" stroke-width="1.6"/>
              <circle cx="36" cy="44" r="1.8" fill="#1b3f70"/>
              <path d="M 33 48 Q 38 52 42 48" fill="none" stroke="#1b3f70" stroke-width="1.2"/>
              <circle cx="80" cy="18" r="6" fill="#ffe169"/>
              <polygon points="20,16 22,20 26,21 23,24 24,28 20,26 16,28 17,24 14,21 18,20" fill="#fca82d"/>
            </svg>
          </div>
        </div>
      `
    },
    letter: {
      title: "★ An Unsent Letter",
      story: `
        <p>It was never meant to be sent.</p>
        <p>Just a few words, a lot of feelings, and a heart that hoped...</p>
        <p>Maybe it's not too late to say them.</p>
        <p style="text-align:center; color:#e36f97;">♥</p>
      `,
      artSvg: `
        <div style="width:230px; height:170px; filter:drop-shadow(0 14px 28px rgba(60,30,0,0.25));">
          <svg viewBox="0 0 120 90" style="width:100%; height:100%;">
            <rect x="10" y="15" width="100" height="66" rx="6" fill="#fff8f6" stroke="#f5b3cb" stroke-width="2.5"/>
            <path d="M 10 15 L 60 52 L 110 15" fill="none" stroke="#f5b3cb" stroke-width="2"/>
            <rect x="52" y="15" width="16" height="66" fill="#ffa8c5" opacity="0.9"/>
            <ellipse cx="60" cy="46" rx="6" ry="6" fill="#e36f97"/>
            <ellipse cx="44" cy="43" rx="12" ry="7" fill="#ffb8d0" stroke="#e36f97" stroke-width="1.2" transform="rotate(-15 44 43)"/>
            <ellipse cx="76" cy="43" rx="12" ry="7" fill="#ffb8d0" stroke="#e36f97" stroke-width="1.2" transform="rotate(15 76 43)"/>
            <circle cx="92" cy="62" r="3" fill="#ffd247"/>
            <circle cx="92" cy="56" r="2.4" fill="#ffffff"/>
            <circle cx="97" cy="62" r="2.4" fill="#ffffff"/>
            <circle cx="92" cy="68" r="2.4" fill="#ffffff"/>
            <circle cx="87" cy="62" r="2.4" fill="#ffffff"/>
          </svg>
        </div>
      `
    },
    wish: {
      title: "★ A Forgotten Wish",
      story: `
        <p>Whispered into the twilight sky from an evening commuter train:</p>
        <p>“I hope we never grow too busy to watch the sunset.”</p>
        <p>The thought crystallized into this starlit glass jar, warming whoever holds it.</p>
        <p style="text-align:center; color:#e36f97;">♥</p>
      `,
      artSvg: `
        <div style="width:180px; height:200px; filter:drop-shadow(0 14px 28px rgba(60,30,0,0.25));">
          <svg viewBox="0 0 100 110" style="width:100%; height:100%;">
            <ellipse cx="50" cy="95" rx="34" ry="8" fill="#d9ad68" stroke="#9e7535" stroke-width="2"/>
            <rect x="22" y="88" width="56" height="8" rx="2" fill="#e8c284"/>
            <path d="M 24 88 C 20 44, 25 20, 50 14 C 75 20, 80 44, 76 88 Z" fill="rgba(235, 247, 255, 0.75)" stroke="#a2ccf2" stroke-width="2"/>
            <circle cx="50" cy="12" r="5" fill="#a2ccf2"/>
            <circle cx="50" cy="52" r="18" fill="#fff9cf" opacity="0.8"/>
            <polygon points="50,38 54,48 64,49 56,56 59,66 50,60 41,66 44,56 36,49 46,48" fill="#ffcb3d" stroke="#d68f0b" stroke-width="1.4"/>
            <path d="M 32 76 C 29 48, 33 32, 48 24" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" opacity="0.85"/>
          </svg>
        </div>
      `
    }
  };

  const treasureDetailModal = document.getElementById("treasure-detail-modal");
  const detailModalTitle = document.getElementById("detail-modal-title");
  const parchmentStoryProse = document.getElementById("parchment-story-prose");
  const treasureModalArtwork = document.getElementById("treasure-modal-artwork");
  const btnCloseTreasureModal = document.getElementById("btn-close-treasure-modal");
  const btnParchmentClose = document.getElementById("btn-parchment-close");

  function openTreasureDetail(key) {
    const data = atticTreasureData[key];
    if (!data || !treasureDetailModal) return;

    sound.playWishStar();
    if (detailModalTitle) detailModalTitle.textContent = data.title;
    if (parchmentStoryProse) parchmentStoryProse.innerHTML = data.story;
    if (treasureModalArtwork) treasureModalArtwork.innerHTML = data.artSvg;

    if (typeof treasureDetailModal.showModal === "function") treasureDetailModal.showModal();
    else treasureDetailModal.setAttribute("open", "true");
  }

  function closeTreasureDetail() {
    if (!treasureDetailModal) return;
    if (typeof treasureDetailModal.close === "function") treasureDetailModal.close();
    else treasureDetailModal.removeAttribute("open");
  }

  const cardDrawing = document.getElementById("attic-card-drawing");
  const cardLetter = document.getElementById("attic-card-letter");
  const cardWish = document.getElementById("attic-card-wish");

  if (cardDrawing) cardDrawing.addEventListener("click", () => openTreasureDetail("drawing"));
  if (cardLetter) cardLetter.addEventListener("click", () => openTreasureDetail("letter"));
  if (cardWish) cardWish.addEventListener("click", () => openTreasureDetail("wish"));

  if (btnCloseTreasureModal) btnCloseTreasureModal.addEventListener("click", closeTreasureDetail);
  if (btnParchmentClose) btnParchmentClose.addEventListener("click", closeTreasureDetail);

  /* ==========================================================================
     7. Make a Wish & Flying Star Trajectory Animation
     ========================================================================== */
  const wishCategories = document.querySelectorAll(".wish-category-btn");
  const wishTextInput = document.getElementById("wish-text-input");
  const btnSendWishStar = document.getElementById("btn-send-wish-star");
  const curvedStarCarrier = document.getElementById("curved-star-carrier");
  const wishStateInput = document.getElementById("wish-state-input");
  const wishStateConfirm = document.getElementById("wish-state-confirm");
  const confirmLeadText = document.getElementById("confirm-lead-text");
  const btnWishHome = document.getElementById("btn-wish-home");
  const btnWishAgain = document.getElementById("btn-wish-again");
  const wishBackdropArt = document.getElementById("wish-backdrop-art");

  let selectedWishCategory = "myself";

  const categoryWisdom = {
    myself: "A little star just found its way into the jar for you.<br>Thank you for sharing your magic...",
    love: "A tender star carrying your fondness was tucked into the jar.<br>Love never gets lost in the clouds.",
    future: "A bright spark for tomorrow is shining warmly inside the glass.<br>May your upcoming journey be gentle and brave.",
    world: "A wish for kindness across the earth just lit up the whole jar.<br>The world is a softer place because of your thought."
  };

  wishCategories.forEach((btn) => {
    btn.addEventListener("click", () => {
      wishCategories.forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-checked", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-checked", "true");
      selectedWishCategory = btn.dataset.wish;
      sound.playChime(659.25, 0.35, 0.04);
    });
  });

  if (btnSendWishStar) {
    btnSendWishStar.addEventListener("click", () => {
      sound.playWishStar();

      // Trigger curved star trajectory
      if (curvedStarCarrier && !prefersReducedMotion) {
        curvedStarCarrier.classList.add("animating");
        setTimeout(() => {
          curvedStarCarrier.classList.remove("animating");
        }, 1200);
      }

      // Pulse the jar halo
      const jarHalo = document.getElementById("jar-glow-halo");
      if (jarHalo) {
        jarHalo.style.transform = "scale(1.4)";
        setTimeout(() => {
          jarHalo.style.transform = "";
        }, 800);
      }

      const customText = wishTextInput ? wishTextInput.value.trim() : "";
      const baseNote = categoryWisdom[selectedWishCategory] || categoryWisdom.myself;

      if (confirmLeadText) {
        confirmLeadText.innerHTML = customText
          ? `${baseNote}<br><em style="font-size:0.92rem; color:var(--lavender-dark);">“${customText}”</em>`
          : baseNote;
      }

      // Transition to confirmation state after the star arrives
      setTimeout(() => {
        if (wishStateInput) wishStateInput.setAttribute("hidden", "true");
        if (wishStateConfirm) wishStateConfirm.removeAttribute("hidden");
        if (wishBackdropArt) wishBackdropArt.style.backgroundImage = "url('assets/redesign/wish_confirm_bg.jpg')";
      }, 700);
    });
  }

  function resetWishState() {
    if (wishStateConfirm) wishStateConfirm.setAttribute("hidden", "true");
    if (wishStateInput) wishStateInput.removeAttribute("hidden");
    if (wishBackdropArt) wishBackdropArt.style.backgroundImage = "url('assets/redesign/wish_bg.jpg')";
    if (wishTextInput) wishTextInput.value = "";
  }

  if (btnWishHome) btnWishHome.addEventListener("click", () => {
    resetWishState();
    navigateTo("home");
  });

  if (btnWishAgain) btnWishAgain.addEventListener("click", resetWishState);

  /* ==========================================================================
     8. Storybook 4-Story Open Book Reader with 3D Page Turn
     ========================================================================== */
  const stories = [
    {
      num: 1,
      title: "The Lost Button",
      caption: "Chapter I • A Mother-of-Pearl Discovery",
      text: `
        <p>It slipped from a warm winter coat during the very first snow of December.</p>
        <p>A shiny mother-of-pearl button that rolled beneath a park bench and wondered if anyone would notice it was gone.</p>
        <p>Mallow found it nestled in a snowdrift and polished it with a cloud puff: “Now you will be the moon for a pocket watch.”</p>
      `,
      artUrl: "assets/redesign/storybook_art_spread.jpg"
    },
    {
      num: 2,
      title: "The Wandering Sock",
      caption: "Chapter II • The Laundry Explorer",
      text: `
        <p>Everyone knows socks don't really vanish — they simply answer the call of the great sky winds.</p>
        <p>This little striped woollen sock slipped past the spin cycle and caught a warm breeze straight into the clouds.</p>
        <p>Now it serves as a cozy hammock for baby starlings learning how to fly.</p>
      `,
      artUrl: "assets/redesign/storybook_art_spread.jpg"
    },
    {
      num: 3,
      title: "The Shy Star",
      caption: "Chapter III • Starlight in the Mist",
      text: `
        <p>High above the clouds, there lived a little star who was too shy to shine.</p>
        <p>It watched the world from afar, waiting for the right moment.</p>
        <p>One day, Mallow showed it that it was already special — just by being itself.</p>
      `,
      artUrl: "assets/redesign/storybook_art_spread.jpg"
    },
    {
      num: 4,
      title: "The Little Cloud",
      caption: "Chapter IV • The Cloud College Sanctuary",
      text: `
        <p>Mallow was born from morning mist and the laughter of children playing in the rain.</p>
        <p>Instead of raining, Mallow chose to gather every quiet dream and built the floating Cloud College.</p>
        <p>Now, whenever anyone in the world feels forgotten, a warm starlight glows in Mallow's window.</p>
      `,
      artUrl: "assets/redesign/college_building.jpg"
    }
  ];

  let currentStoryIndex = 2; // Default to "The Shy Star" matching reference mockup!
  const storyShelfView = document.getElementById("story-shelf-view");
  const storyReaderView = document.getElementById("story-reader-view");
  const bookSpread = document.getElementById("book-spread");
  const readerStoryArt = document.getElementById("reader-story-art");
  const readerCaptionBadge = document.getElementById("reader-caption-badge");
  const readerChapterTitle = document.getElementById("reader-chapter-title");
  const readerTextBody = document.getElementById("reader-text-body");
  const readerPageIndicator = document.getElementById("reader-page-indicator");
  const btnReaderPrev = document.getElementById("btn-reader-prev");
  const btnReaderNext = document.getElementById("btn-reader-next");
  const btnReaderToShelf = document.getElementById("btn-reader-to-shelf");

  function renderReaderStory(index) {
    if (index < 0 || index >= stories.length) return;
    currentStoryIndex = index;
    const s = stories[index];

    // Trigger 3D page flip animation
    if (bookSpread && !prefersReducedMotion) {
      bookSpread.classList.add("page-flipping");
      setTimeout(() => bookSpread.classList.remove("page-flipping"), 550);
    }

    if (readerStoryArt) readerStoryArt.src = s.artUrl;
    if (readerCaptionBadge) readerCaptionBadge.textContent = s.caption;
    if (readerChapterTitle) readerChapterTitle.textContent = s.title;
    if (readerTextBody) readerTextBody.innerHTML = s.text;
    if (readerPageIndicator) readerPageIndicator.textContent = `Story ${index + 1} of ${stories.length}`;

    if (btnReaderPrev) btnReaderPrev.disabled = index === 0;
    if (btnReaderNext) btnReaderNext.disabled = index === stories.length - 1;

    sound.playChime(587.33 + index * 45, 0.45, 0.04);
  }

  function showReaderView(index) {
    if (storyShelfView) storyShelfView.setAttribute("hidden", "true");
    if (storyReaderView) storyReaderView.removeAttribute("hidden");
    renderReaderStory(index);
  }

  function showShelfView() {
    if (storyReaderView) storyReaderView.setAttribute("hidden", "true");
    if (storyShelfView) storyShelfView.removeAttribute("hidden");
    sound.playChime(523.25, 0.35, 0.03);
  }

  document.querySelectorAll(".story-preview-card").forEach((card) => {
    card.addEventListener("click", () => {
      const storyNum = parseInt(card.dataset.story, 10);
      showReaderView(storyNum - 1);
    });
  });

  if (btnReaderPrev) btnReaderPrev.addEventListener("click", () => renderReaderStory(currentStoryIndex - 1));
  if (btnReaderNext) btnReaderNext.addEventListener("click", () => renderReaderStory(currentStoryIndex + 1));
  if (btnReaderToShelf) btnReaderToShelf.addEventListener("click", showShelfView);

  /* Keyboard Arrow Flip in Storybook */
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeAllModals();
    } else if (e.key === "ArrowRight") {
      if (scenes.story && scenes.story.classList.contains("active") && storyReaderView && !storyReaderView.hasAttribute("hidden")) {
        renderReaderStory(Math.min(currentStoryIndex + 1, stories.length - 1));
      }
    } else if (e.key === "ArrowLeft") {
      if (scenes.story && scenes.story.classList.contains("active") && storyReaderView && !storyReaderView.hasAttribute("hidden")) {
        renderReaderStory(Math.max(currentStoryIndex - 1, 0));
      }
    }
  });

  /* ==========================================================================
     9. Meet Mallow Modal
     ========================================================================== */
  const meetModal = document.getElementById("meet-mallow-modal");
  const btnCloseMeetModal = document.getElementById("btn-close-meet-modal");

  function openMeetModal() {
    if (!meetModal) return;
    sound.playTickle();
    if (typeof meetModal.showModal === "function") meetModal.showModal();
    else meetModal.setAttribute("open", "true");
  }

  function closeMeetModal() {
    if (!meetModal) return;
    if (typeof meetModal.close === "function") meetModal.close();
    else meetModal.removeAttribute("open");
  }

  if (btnCloseMeetModal) btnCloseMeetModal.addEventListener("click", closeMeetModal);

  /* ==========================================================================
     10. Sparkle Particle Cursor Trail
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

  // Initial State: Check URL Hash or Default to Home
  function checkInitialRoute() {
    const hash = window.location.hash.replace("#", "").toLowerCase();
    if (scenes[hash]) {
      navigateTo(hash);
    } else {
      navigateTo("home");
    }

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("modal") === "college") setTimeout(openCollegeModal, 200);
    if (urlParams.get("modal") === "letter") setTimeout(() => openTreasureDetail("letter"), 200);
    if (urlParams.get("modal") === "drawing") setTimeout(() => openTreasureDetail("drawing"), 200);
    if (urlParams.get("modal") === "wish") setTimeout(() => openTreasureDetail("wish"), 200);
    if (urlParams.get("story") === "reader") setTimeout(() => showReaderView(2), 200);
    if (urlParams.get("wish") === "confirm") {
      setTimeout(() => {
        if (wishStateInput) wishStateInput.setAttribute("hidden", "true");
        if (wishStateConfirm) wishStateConfirm.removeAttribute("hidden");
      }, 200);
    }
  }

  window.addEventListener("hashchange", () => {
    const hash = window.location.hash.replace("#", "").toLowerCase();
    if (scenes[hash] && !scenes[hash].classList.contains("active")) {
      navigateTo(hash);
    }
  });

  checkInitialRoute();

})();
