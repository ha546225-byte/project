/**
 * FOR UMAMAH — AMBIENT ROMANTIC AUDIO ENGINE
 * Seamless Web Audio API procedural acoustic lullaby / music box chords
 * + Support for external romantic audio track with equalizer UI.
 */

window.RomanticAudio = (function () {
  'use strict';

  let audioCtx = null;
  let isPlaying = false;
  let isMuted = false;
  let timerId = null;
  let masterGain = null;

  // Romantic Chord Progression: Cmaj9 -> Am9 -> Fmaj7 -> Gsus4 -> Em7
  // Gentle, nostalgic, heart-warming arpeggios
  const chords = [
    [261.63, 329.63, 392.00, 493.88, 587.33], // C, E, G, B, D (Cmaj9)
    [220.00, 261.63, 329.63, 392.00, 493.88], // A, C, E, G, B (Am9)
    [174.61, 261.63, 329.63, 349.23, 440.00], // F, C, E, F, A (Fmaj7)
    [196.00, 261.63, 293.66, 392.00, 440.00], // G, C, D, G, A (Gsus4/G9)
    [164.81, 246.94, 329.63, 392.00, 493.88]  // E, B, E, G, B (Em7)
  ];

  let currentChordIndex = 0;
  let noteIndex = 0;

  function initAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();

      // Master output with soft romantic compressor & lowpass filter
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 1600; // Warm, soft acoustic tone

      masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(0.28, audioCtx.currentTime);

      filter.connect(masterGain);
      masterGain.connect(audioCtx.destination);
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Play a soft acoustic / music box bell chime note
  function playNote(freq, duration = 1.8) {
    if (!audioCtx || !isPlaying || isMuted) return;

    try {
      const osc = audioCtx.createOscillator();
      const noteGain = audioCtx.createGain();

      // Sine wave with soft triangle overtone for delicate warmth
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      // Envelope: instant soft attack, gentle acoustic decay
      const now = audioCtx.currentTime;
      noteGain.gain.setValueAtTime(0.001, now);
      noteGain.gain.exponentialRampToValueAtTime(0.18, now + 0.04);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(noteGain);
      noteGain.connect(masterGain);

      osc.start(now);
      osc.stop(now + duration);
    } catch (e) {
      // Ignore audio teardown errors
    }
  }

  function tick() {
    if (!isPlaying) return;

    const currentChord = chords[currentChordIndex];
    const freq = currentChord[noteIndex];

    playNote(freq, 2.2);

    noteIndex++;
    if (noteIndex >= currentChord.length) {
      noteIndex = 0;
      currentChordIndex = (currentChordIndex + 1) % chords.length;
    }

    // Gentle arpeggio timing: 480ms between notes
    timerId = setTimeout(tick, 480);
  }

  function start() {
    if (isPlaying) return;
    initAudioContext();
    isPlaying = true;
    updateUI(true);
    tick();
  }

  function stop() {
    isPlaying = false;
    clearTimeout(timerId);
    updateUI(false);
  }

  function toggle() {
    if (isPlaying) {
      stop();
    } else {
      start();
    }
  }

  function updateUI(playing) {
    const btn = document.getElementById('music-toggle');
    const label = document.getElementById('music-label');
    if (!btn) return;

    if (playing) {
      btn.classList.add('playing');
      btn.setAttribute('aria-label', 'Pause Romantic Music');
      if (label) label.textContent = 'Playing Melody 🎵';
    } else {
      btn.classList.remove('playing');
      btn.setAttribute('aria-label', 'Play Romantic Music');
      if (label) label.textContent = 'Play Music 🎶';
    }
  }

  // Play romantic chime sound effect (e.g., when opening jar note or sealing vow)
  function playSweetChime() {
    initAudioContext();
    if (!audioCtx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        try {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

          const now = audioCtx.currentTime;
          gain.gain.setValueAtTime(0.001, now);
          gain.gain.exponentialRampToValueAtTime(0.15, now + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

          osc.connect(gain);
          gain.connect(audioCtx.destination);

          osc.start(now);
          osc.stop(now + 1.2);
        } catch (e) {}
      }, idx * 110);
    });
  }

  // Play playful pop sound (for jar opening)
  function playPop() {
    initAudioContext();
    if (!audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      const now = audioCtx.currentTime;
      osc.frequency.setValueAtTime(350, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.12);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    } catch (e) {}
  }

  return {
    start,
    stop,
    toggle,
    isPlaying: () => isPlaying,
    playSweetChime,
    playPop
  };
})();
