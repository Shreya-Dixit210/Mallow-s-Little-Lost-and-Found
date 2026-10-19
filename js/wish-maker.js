/**
 * Mallow's Little Lost & Found — Wish Maker Module
 * Handles category selection, text input, star trajectory into jar,
 * and personalized confirmation wisdom.
 */

(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let selectedWishCategory = "myself";

  const categoryWisdom = {
    myself: "A little star just found its way into the jar for you.<br>Thank you for sharing your magic...",
    love: "A tender star carrying your fondness was tucked into the jar.<br>Love never gets lost in the clouds.",
    future: "A bright spark for tomorrow is shining warmly inside the glass.<br>May your upcoming journey be gentle and brave.",
    world: "A wish for kindness across the earth just lit up the whole jar.<br>The world is a softer place because of your thought."
  };

  document.addEventListener("DOMContentLoaded", () => {
    const wishCategories = document.querySelectorAll(".wish-category-btn");
    const wishTextInput = document.getElementById("wish-text-input");
    const btnSendWishStar = document.getElementById("btn-send-wish-star");
    const curvedStarCarrier = document.getElementById("curved-star-carrier");
    const wishStateInput = document.getElementById("wish-state-input");
    const wishStateConfirm = document.getElementById("wish-state-confirm");
    const confirmLeadText = document.getElementById("confirm-lead-text");
    const btnWishHome = document.getElementById("btn-wish-home");
    const btnWishAgain = document.getElementById("btn-wish-again");

    wishCategories.forEach((btn) => {
      btn.addEventListener("click", () => {
        wishCategories.forEach((b) => {
          b.classList.remove("active");
          b.setAttribute("aria-checked", "false");
        });
        btn.classList.add("active");
        btn.setAttribute("aria-checked", "true");
        selectedWishCategory = btn.dataset.wish;
        if (window.skyAudio) window.skyAudio.playChime(659.25, 0.35, 0.04);
      });
    });

    if (btnSendWishStar) {
      btnSendWishStar.addEventListener("click", () => {
        if (window.skyAudio) window.skyAudio.playWishStar();

        // Trigger curved star trajectory
        if (curvedStarCarrier && !prefersReducedMotion) {
          curvedStarCarrier.classList.add("animating");
          setTimeout(() => {
            curvedStarCarrier.classList.remove("animating");
          }, 1200);
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
        }, 650);
      });
    }

    window.resetWishState = function () {
      if (wishStateConfirm) wishStateConfirm.setAttribute("hidden", "true");
      if (wishStateInput) wishStateInput.removeAttribute("hidden");
      if (wishTextInput) wishTextInput.value = "";
    };

    if (btnWishHome) {
      btnWishHome.addEventListener("click", () => {
        window.resetWishState();
        if (window.navigateTo) window.navigateTo("home");
      });
    }

    if (btnWishAgain) {
      btnWishAgain.addEventListener("click", window.resetWishState);
    }
  });

})();
