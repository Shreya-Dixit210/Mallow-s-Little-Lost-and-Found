/**
 * Mallow's Little Lost & Found — Web Audio API Synthesizer
 * Provides soothing pentatonic music box lullabies, star chimes,
 * college bells, and celebratory fanfares without external audio files.
 */

class SkyAudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = true;
    this.isPlayingLullaby = false;
    this.timerId = null;
    this.noteIndex = 0;

    // Soothing pentatonic celesta lullaby notes (Hz)
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

// Global audio singleton
window.skyAudio = new SkyAudioEngine();

// Connect toggle button
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("lullaby-toggle-btn");
  const toggleText = document.getElementById("lullaby-text");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const active = window.skyAudio.toggle();
      toggleBtn.classList.toggle("active", active);
      toggleBtn.setAttribute("aria-pressed", String(active));
      if (toggleText) {
        toggleText.textContent = active ? "Playing" : "Lullaby";
      }
    });
  }
});
