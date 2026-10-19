/**
 * Mallow's Little Lost & Found — Storybook Module
 * Provides shelf overview of four stories, interactive open-book reader,
 * 3D page-flip animations, and keyboard navigation.
 */

(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
      artUrl: "assets/backgrounds/home-world.jpg"
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
      artUrl: "assets/backgrounds/memory-attic.jpg"
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
      artUrl: "assets/backgrounds/wish-chamber.jpg"
    },
    {
      num: 4,
      title: "The Little Cloud",
      caption: "Chapter IV • The Cloud College Sanctuary",
      text: `
        <p>Mallow was born from morning mist and the laughter of children playing in the rain.</p>
        <p>Instead of raining, Mallow chose to gather every quiet dream and founded the floating Cloud College.</p>
        <p>Now, whenever anyone in the world feels forgotten, a warm starlight glows in Mallow's window.</p>
      `,
      artUrl: "assets/backgrounds/college-building.jpg"
    }
  ];

  let currentStoryIndex = 2; // Default to Chapter 3 (The Shy Star)

  window.renderReaderStory = function (index) {
    if (index < 0 || index >= stories.length) return;
    currentStoryIndex = index;
    const s = stories[index];

    const bookSpread = document.getElementById("book-spread");
    const readerStoryArt = document.getElementById("reader-story-art");
    const readerCaptionBadge = document.getElementById("reader-caption-badge");
    const readerChapterTitle = document.getElementById("reader-chapter-title");
    const readerTextBody = document.getElementById("reader-text-body");
    const readerPageIndicator = document.getElementById("reader-page-indicator");
    const btnReaderPrev = document.getElementById("btn-reader-prev");
    const btnReaderNext = document.getElementById("btn-reader-next");

    // 3D page flip animation
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

    if (window.skyAudio) window.skyAudio.playChime(587.33 + index * 45, 0.4, 0.04);
  };

  window.showReaderView = function (index) {
    const shelf = document.getElementById("story-shelf-view");
    const reader = document.getElementById("story-reader-view");
    if (shelf) shelf.setAttribute("hidden", "true");
    if (reader) reader.removeAttribute("hidden");
    window.renderReaderStory(index);
  };

  window.showShelfView = function () {
    const shelf = document.getElementById("story-shelf-view");
    const reader = document.getElementById("story-reader-view");
    if (reader) reader.setAttribute("hidden", "true");
    if (shelf) shelf.removeAttribute("hidden");
    if (window.skyAudio) window.skyAudio.playChime(523.25, 0.35, 0.03);
  };

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".story-preview-card").forEach((card) => {
      card.addEventListener("click", () => {
        const storyNum = parseInt(card.dataset.story, 10);
        window.showReaderView(storyNum - 1);
      });
    });

    const btnReaderPrev = document.getElementById("btn-reader-prev");
    const btnReaderNext = document.getElementById("btn-reader-next");
    const btnReaderToShelf = document.getElementById("btn-reader-to-shelf");

    if (btnReaderPrev) btnReaderPrev.addEventListener("click", () => window.renderReaderStory(currentStoryIndex - 1));
    if (btnReaderNext) btnReaderNext.addEventListener("click", () => window.renderReaderStory(currentStoryIndex + 1));
    if (btnReaderToShelf) btnReaderToShelf.addEventListener("click", window.showShelfView);

    // Keyboard Arrow Flip in Storybook
    window.addEventListener("keydown", (e) => {
      const storyScene = document.getElementById("story-scene");
      const readerView = document.getElementById("story-reader-view");
      const isReaderActive = storyScene && storyScene.classList.contains("active") && readerView && !readerView.hasAttribute("hidden");

      if (isReaderActive) {
        if (e.key === "ArrowRight") {
          window.renderReaderStory(Math.min(currentStoryIndex + 1, stories.length - 1));
        } else if (e.key === "ArrowLeft") {
          window.renderReaderStory(Math.max(currentStoryIndex - 1, 0));
        }
      }
    });
  });

})();
