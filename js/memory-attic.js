/**
 * Mallow's Little Lost & Found — Memory Attic Module
 * Handles interactions for the 3 forgotten treasures on the wooden desk:
 * Unfinished Drawing, Unsent Letter, and Forgotten Wish.
 */

(function () {
  "use strict";

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

  window.openTreasureDetail = function (key) {
    const modal = document.getElementById("treasure-detail-modal");
    const titleEl = document.getElementById("detail-modal-title");
    const proseEl = document.getElementById("parchment-story-prose");
    const artEl = document.getElementById("treasure-modal-artwork");
    const data = atticTreasureData[key];

    if (!data || !modal) return;

    if (window.skyAudio) window.skyAudio.playWishStar();

    if (titleEl) titleEl.textContent = data.title;
    if (proseEl) proseEl.innerHTML = data.story;
    if (artEl) artEl.innerHTML = data.artSvg;

    if (typeof modal.showModal === "function") modal.showModal();
    else modal.setAttribute("open", "true");
  };

  window.closeTreasureDetail = function () {
    const modal = document.getElementById("treasure-detail-modal");
    if (!modal) return;
    if (typeof modal.close === "function") modal.close();
    else modal.removeAttribute("open");
  };

  document.addEventListener("DOMContentLoaded", () => {
    const cardDrawing = document.getElementById("attic-card-drawing");
    const cardLetter = document.getElementById("attic-card-letter");
    const cardWish = document.getElementById("attic-card-wish");
    const btnClose = document.getElementById("btn-close-treasure-modal");
    const btnParchmentClose = document.getElementById("btn-parchment-close");

    if (cardDrawing) cardDrawing.addEventListener("click", () => window.openTreasureDetail("drawing"));
    if (cardLetter) cardLetter.addEventListener("click", () => window.openTreasureDetail("letter"));
    if (cardWish) cardWish.addEventListener("click", () => window.openTreasureDetail("wish"));

    if (btnClose) btnClose.addEventListener("click", window.closeTreasureDetail);
    if (btnParchmentClose) btnParchmentClose.addEventListener("click", window.closeTreasureDetail);
  });

})();
