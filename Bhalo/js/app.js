/**
 * FOR UMAMAH — INTERACTIVE APPLICATION LOGIC
 * Includes:
 *  - Animated Typewriter Headline
 *  - Morphing Pet Name Badge
 *  - Real-Time "6 Years of Us" Dynamic Live Counter
 *  - 3D Card Tilt Physics with Light Glare
 *  - Polaroid High-Res Lightbox Modal
 *  - "Open When You Need Love" Jar Notes Generator with sound & particle burst
 *  - Playful "Mood Lifter" Evasive Button & Confetti Promise Modal
 *  - Interactive Love Meter & Photo Customizer (with localStorage persistence)
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // =========================================================================
  // 1. PHOTO MANAGEMENT & FALLBACK HANDLING
  // =========================================================================
  const DEFAULT_PHOTOS = {
    'hero-photo': 'assets/hero_photo.jpg',
    'polaroid-1': 'assets/photo_year1.jpg',
    'polaroid-2': 'assets/photo_date.jpg',
    'polaroid-3': 'assets/photo_candid.jpg',
    'polaroid-4': 'assets/photo_recent.jpg',
    'card-bhalo': 'assets/card_bhalo.jpg',
    'card-bacha': 'assets/card_bacha.jpg',
    'card-pathani': 'assets/card_pathani.jpg',
    'card-zanani': 'assets/card_zanani.jpg',
    'promise-couple': 'assets/final_couple.jpg'
  };

  // Load custom photos from localStorage if present
  function initPhotos() {
    const saved = localStorage.getItem('umamah_custom_photos');
    let customMap = {};
    if (saved) {
      try {
        customMap = JSON.parse(saved);
      } catch (e) {
        customMap = {};
      }
    }

    document.querySelectorAll('[data-photo-slot]').forEach(img => {
      const slot = img.getAttribute('data-photo-slot');
      const targetSrc = customMap[slot] || DEFAULT_PHOTOS[slot];
      if (targetSrc) {
        img.src = targetSrc;
      }

      // Graceful fallback if user enters invalid URL
      img.onerror = function () {
        if (this.src !== DEFAULT_PHOTOS[slot]) {
          console.warn(`Image failed to load for ${slot}, falling back to romantic art:`, this.src);
          this.src = DEFAULT_PHOTOS[slot] || 'assets/hero_photo.jpg';
        }
      };
    });
  }

  initPhotos();

  // =========================================================================
  // 2. TYPEWRITER HEADLINE
  // =========================================================================
  const typewriterEl = document.getElementById('typewriter-text');
  const fullText = "For the Love of My Life, Umamah ❤️";
  let charIdx = 0;

  function typeWriter() {
    if (!typewriterEl) return;
    if (charIdx < fullText.length) {
      typewriterEl.textContent += fullText.charAt(charIdx);
      charIdx++;
      const delay = fullText.charAt(charIdx - 1) === ',' ? 320 : (Math.random() * 50 + 55);
      setTimeout(typeWriter, delay);
    }
  }

  setTimeout(typeWriter, 500);

  // =========================================================================
  // 3. MORPHING NICKNAME BADGE
  // =========================================================================
  const nicknames = [
    "Bhalo 🧸",
    "Mera Bacha 🥺",
    "Meri Pathani 🌸",
    "Meri Zanani 💍"
  ];
  let currentNickIdx = 0;
  const badgeEl = document.getElementById('nickname-badge');

  function cycleNickname() {
    if (!badgeEl) return;
    badgeEl.classList.add('switching');

    setTimeout(() => {
      currentNickIdx = (currentNickIdx + 1) % nicknames.length;
      badgeEl.textContent = nicknames[currentNickIdx];
      badgeEl.classList.remove('switching');
    }, 350);
  }

  setInterval(cycleNickname, 2800);

  // =========================================================================
  // 4. LIVE DYNAMIC "6 YEARS OF US" REAL-TIME COUNTER
  // =========================================================================
  // Exactly 6 years back from current date
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 6);
  startDate.setHours(0, 0, 0, 0);

  function updateLiveCounter() {
    const now = new Date();
    const diffMs = now - startDate;

    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
    const seconds = Math.floor((diffMs / 1000) % 60);

    const elDays = document.getElementById('timer-days');
    const elHours = document.getElementById('timer-hours');
    const elMins = document.getElementById('timer-mins');
    const elSecs = document.getElementById('timer-secs');

    if (elDays) elDays.textContent = days.toLocaleString();
    if (elHours) elHours.textContent = String(hours).padStart(2, '0');
    if (elMins) elMins.textContent = String(minutes).padStart(2, '0');
    if (elSecs) elSecs.textContent = String(seconds).padStart(2, '0');
  }

  updateLiveCounter();
  setInterval(updateLiveCounter, 1000);

  // =========================================================================
  // 5. 3D TILT PHYSICS FOR NICKNAME CARDS
  // =========================================================================
  const tiltCards = document.querySelectorAll('.nickname-tilt-card');

  tiltCards.forEach(card => {
    let bounds;

    function onMouseEnter() {
      bounds = card.getBoundingClientRect();
    }

    function onMouseMove(e) {
      if (!bounds) bounds = card.getBoundingClientRect();
      const mouseX = e.clientX - bounds.left;
      const mouseY = e.clientY - bounds.top;
      const halfWidth = bounds.width / 2;
      const halfHeight = bounds.height / 2;

      const x = (mouseX - halfWidth) / halfWidth;
      const y = (mouseY - halfHeight) / halfHeight;

      const tiltX = -y * 14;
      const tiltY = x * 14;

      card.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateY(-6px) scale3d(1.02, 1.02, 1.02)`;

      const glare = card.querySelector('.card-glare');
      if (glare) {
        glare.style.background = `radial-gradient(circle at ${(mouseX / bounds.width) * 100}% ${(mouseY / bounds.height) * 100}%, rgba(255, 255, 255, 0.22) 0%, transparent 60%)`;
      }
    }

    function onMouseLeave() {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale3d(1, 1, 1)';
    }

    card.addEventListener('mouseenter', onMouseEnter);
    card.addEventListener('mousemove', onMouseMove);
    card.addEventListener('mouseleave', onMouseLeave);

    // Click card to toggle secret thought
    card.addEventListener('click', () => {
      card.classList.toggle('revealed');
      if (window.RomanticAudio && card.classList.contains('revealed')) {
        window.RomanticAudio.playSweetChime();
      }
    });
  });

  // =========================================================================
  // 6. POLAROID SCRAPBOOK & LIGHTBOX MODAL
  // =========================================================================
  const polaroids = [
    {
      slot: 'polaroid-1',
      caption: 'Where it all began 💫',
      badge: 'Year 1'
    },
    {
      slot: 'polaroid-2',
      caption: 'My favorite smile in the world 🌸',
      badge: 'Favorite Date'
    },
    {
      slot: 'polaroid-3',
      caption: 'Unfiltered happiness with you 🧸',
      badge: 'Candid Love'
    },
    {
      slot: 'polaroid-4',
      caption: '6 years down, forever to go 💍',
      badge: 'Present & Forever'
    }
  ];

  let currentLightboxIdx = 0;
  const lightboxOverlay = document.getElementById('polaroid-lightbox');
  const lightboxImg = document.getElementById('lightbox-image');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  function openLightbox(index) {
    currentLightboxIdx = index;
    const item = polaroids[index];
    const sourceImg = document.querySelector(`[data-photo-slot="${item.slot}"]`);

    if (lightboxImg && sourceImg) {
      lightboxImg.src = sourceImg.src;
    }
    if (lightboxCaption) {
      lightboxCaption.textContent = item.caption;
    }
    if (lightboxOverlay) {
      lightboxOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
    if (window.RomanticAudio) {
      window.RomanticAudio.playSweetChime();
    }
  }

  function closeLightbox() {
    if (lightboxOverlay) {
      lightboxOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  document.querySelectorAll('.polaroid-card').forEach((card, idx) => {
    card.addEventListener('click', () => openLightbox(idx));
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxOverlay) {
    lightboxOverlay.addEventListener('click', (e) => {
      if (e.target === lightboxOverlay) closeLightbox();
    });
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      currentLightboxIdx = (currentLightboxIdx - 1 + polaroids.length) % polaroids.length;
      openLightbox(currentLightboxIdx);
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', (e) => {
      e.stopPropagation();
      currentLightboxIdx = (currentLightboxIdx + 1) % polaroids.length;
      openLightbox(currentLightboxIdx);
    });
  }

  // Keyboard navigation for Lightbox
  window.addEventListener('keydown', (e) => {
    if (!lightboxOverlay || !lightboxOverlay.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft' && lightboxPrev) lightboxPrev.click();
    if (e.key === 'ArrowRight' && lightboxNext) lightboxNext.click();
  });

  // =========================================================================
  // 7. "OPEN WHEN YOU NEED LOVE" JAR
  // =========================================================================
  const loveNotes = [
    "Did you forget? You're the prettiest girl in the world when you smile.",
    "6 years later, my heart still skips a beat when I see your name on my phone screen.",
    "I am working hard every single day just to give my Zanani the fairy tale she deserves.",
    "You will never have to doubt my love, because I choose you every single day.",
    "Whenever you feel unsure, close your eyes and listen to my heartbeat—it beats only your name.",
    "There is no place in the universe I would rather be than holding your hand.",
    "My love for you isn't a temporary spark; it is the calm, unwavering warmth of an eternal fire.",
    "Even when you're angry or upset, you are the most precious person to ever exist to me.",
    "You didn't just become my partner, Umamah; you became my peace and my home.",
    "I promise you, as long as I have breath in my lungs, you will never walk alone.",
    "I fell in love with your laugh, your fierce loyalty, and the way you care for the people you love.",
    "You are my favorite thought before falling asleep and my first grateful breath every morning."
  ];

  const jarStage = document.getElementById('jar-stage');
  const jarNoteDisplay = document.getElementById('jar-note-card');
  const jarQuoteEl = document.getElementById('jar-quote-text');
  const btnDrawAgain = document.getElementById('btn-draw-again');
  const notesReadEl = document.getElementById('notes-read-count');

  let readCount = parseInt(localStorage.getItem('umamah_notes_read') || '0', 10);
  if (notesReadEl) notesReadEl.textContent = readCount;

  let lastNoteIdx = -1;

  function pullNoteFromJar(e) {
    if (window.RomanticAudio) {
      window.RomanticAudio.playPop();
    }

    // Pick non-repeating random note
    let randIdx;
    do {
      randIdx = Math.floor(Math.random() * loveNotes.length);
    } while (randIdx === lastNoteIdx && loveNotes.length > 1);
    lastNoteIdx = randIdx;

    const note = loveNotes[randIdx];
    if (jarQuoteEl) jarQuoteEl.textContent = `“${note}”`;
    if (jarNoteDisplay) jarNoteDisplay.classList.remove('hidden');

    readCount++;
    localStorage.setItem('umamah_notes_read', readCount);
    if (notesReadEl) notesReadEl.textContent = readCount;

    // Burst floating heart emojis
    const rect = jarStage ? jarStage.getBoundingClientRect() : { left: window.innerWidth / 2, top: window.innerHeight / 2 };
    spawnFloatingHearts(rect.left + rect.width / 2, rect.top + 60, 10);

    // Scroll slightly to note display on mobile
    if (window.innerWidth < 768 && jarNoteDisplay) {
      jarNoteDisplay.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  if (jarStage) jarStage.addEventListener('click', pullNoteFromJar);
  if (btnDrawAgain) btnDrawAgain.addEventListener('click', pullNoteFromJar);

  // =========================================================================
  // 8. PLAYFUL "MOOD LIFTER" WIDGET (ELUSIVE BUTTON & CONFETTI PROMISE)
  // =========================================================================
  const btnMad = document.getElementById('btn-mad');
  const btnLove = document.getElementById('btn-love');
  const teaseToast = document.getElementById('tease-toast');
  const promiseModal = document.getElementById('promise-modal');
  const promiseClose = document.getElementById('promise-close');
  const btnSealKiss = document.getElementById('btn-seal-kiss');

  const teasePhrases = [
    "Are you sure? 🥺",
    "Think again, my Pathani! 🌸",
    "Not an option, Bhalo! 🙈",
    "Catch me if you can! 🏃💨",
    "Button broken by too much love! ❤️",
    "No way, your smile is too beautiful to stay mad! 💫"
  ];
  let teaseIdx = 0;

  function dodgeMadButton() {
    if (!btnMad) return;

    // Show playful tease phrase
    if (teaseToast) {
      teaseToast.textContent = teasePhrases[teaseIdx % teasePhrases.length];
      teaseToast.classList.add('show');
      teaseIdx++;
      setTimeout(() => teaseToast.classList.remove('show'), 1500);
    }

    // Calculate boundary within parent arena
    const arena = btnMad.parentElement;
    const arenaRect = arena.getBoundingClientRect();
    const btnRect = btnMad.getBoundingClientRect();

    const maxDeltaX = (arenaRect.width - btnRect.width) / 2.2;
    const maxDeltaY = 60;

    const randX = (Math.random() - 0.5) * 2 * maxDeltaX;
    const randY = (Math.random() - 0.5) * 2 * maxDeltaY;
    const randScale = Math.max(0.75, 1 - (teaseIdx * 0.05));

    btnMad.style.transform = `translate(${randX}px, ${randY}px) scale(${randScale})`;

    if (window.RomanticAudio) {
      window.RomanticAudio.playPop();
    }
  }

  if (btnMad) {
    btnMad.addEventListener('mouseenter', dodgeMadButton);
    btnMad.addEventListener('touchstart', (e) => {
      e.preventDefault();
      dodgeMadButton();
    });
    btnMad.addEventListener('click', (e) => {
      e.preventDefault();
      dodgeMadButton();
    });
  }

  // Triumphant Love Button
  if (btnLove) {
    btnLove.addEventListener('click', () => {
      // Fire celebration confetti
      fireRomanticConfetti();

      // Audio chime
      if (window.RomanticAudio) {
        window.RomanticAudio.playSweetChime();
        if (!window.RomanticAudio.isPlaying()) {
          window.RomanticAudio.start();
        }
      }

      // Open promise modal
      if (promiseModal) {
        setTimeout(() => {
          promiseModal.classList.add('active');
          document.body.style.overflow = 'hidden';
        }, 500);
      }
    });
  }

  if (promiseClose) {
    promiseClose.addEventListener('click', () => {
      if (promiseModal) {
        promiseModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  if (promiseModal) {
    promiseModal.addEventListener('click', (e) => {
      if (e.target === promiseModal) {
        promiseModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // Seal with a Kiss
  if (btnSealKiss) {
    btnSealKiss.addEventListener('click', (e) => {
      btnSealKiss.innerHTML = 'Sealed with Eternal Love 💍❤️';
      btnSealKiss.style.background = 'linear-gradient(135deg, #fbbf24, #d97706)';
      
      const rect = btnSealKiss.getBoundingClientRect();
      spawnFloatingHearts(rect.left + rect.width / 2, rect.top, 16, ['💋', '💖', '💍', '❤️', '✨']);

      fireRomanticConfetti();
      if (window.RomanticAudio) {
        window.RomanticAudio.playSweetChime();
      }
    });
  }

  // Fullscreen Confetti Explosion
  function fireRomanticConfetti() {
    if (typeof confetti === 'function') {
      const colors = ['#ff4d79', '#f43f5e', '#fcd34d', '#fda4af', '#ffffff'];

      confetti({
        particleCount: 80,
        spread: 100,
        origin: { y: 0.6 },
        colors: colors
      });

      setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 80,
          origin: { x: 0, y: 0.7 },
          colors: colors
        });
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 80,
          origin: { x: 1, y: 0.7 },
          colors: colors
        });
      }, 250);
    }
  }

  // =========================================================================
  // 9. LETTER HEART FLUTTER BUTTON
  // =========================================================================
  const btnLetterBurst = document.getElementById('btn-letter-burst');
  if (btnLetterBurst) {
    btnLetterBurst.addEventListener('click', (e) => {
      const rect = btnLetterBurst.getBoundingClientRect();
      spawnFloatingHearts(rect.left + rect.width / 2, rect.top, 12, ['🌹', '❤️', '✨', '💌', '🌸']);
      if (window.RomanticAudio) {
        window.RomanticAudio.playSweetChime();
      }
    });
  }

  // =========================================================================
  // 10. FOOTER INTERACTIVE LOVE METER
  // =========================================================================
  const btnSendHeart = document.getElementById('btn-send-heart');
  const loveCounterEl = document.getElementById('love-counter-val');
  let loveCount = parseInt(localStorage.getItem('umamah_love_count') || '628', 10);
  if (loveCounterEl) loveCounterEl.textContent = loveCount.toLocaleString();

  if (btnSendHeart) {
    btnSendHeart.addEventListener('click', (e) => {
      loveCount++;
      localStorage.setItem('umamah_love_count', loveCount);
      if (loveCounterEl) loveCounterEl.textContent = loveCount.toLocaleString();

      const rect = btnSendHeart.getBoundingClientRect();
      spawnFloatingHearts(rect.left + rect.width / 2, rect.top, 5);

      if (window.RomanticAudio) {
        window.RomanticAudio.playSweetChime();
      }
    });
  }

  // Helper to spawn floating hearts from coordinate
  function spawnFloatingHearts(x, y, count = 6, emojis = ['❤️', '💖', '💕', '🌹', '✨']) {
    for (let i = 0; i < count; i++) {
      const heart = document.createElement('div');
      heart.className = 'floating-spawned-heart';
      heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      heart.style.left = `${x}px`;
      heart.style.top = `${y}px`;
      heart.style.setProperty('--rand-x', (Math.random() - 0.5) * 2);
      heart.style.fontSize = `${1.2 + Math.random() * 1.2}rem`;
      heart.style.animationDuration = `${1.2 + Math.random() * 0.8}s`;

      document.body.appendChild(heart);
      setTimeout(() => heart.remove(), 2000);
    }
  }

  // =========================================================================
  // 11. AUDIO CONTROLLER & AUTOPLAY ON FIRST INTERACTION
  // =========================================================================
  const musicToggle = document.getElementById('music-toggle');
  if (musicToggle && window.RomanticAudio) {
    musicToggle.addEventListener('click', () => {
      window.RomanticAudio.toggle();
    });
  }

  // Start music on first intentional user click or tap anywhere
  function triggerAutoplayOnce() {
    if (window.RomanticAudio && !window.RomanticAudio.isPlaying()) {
      window.RomanticAudio.start();
    }
    window.removeEventListener('click', triggerAutoplayOnce);
    window.removeEventListener('touchstart', triggerAutoplayOnce);
  }

  window.addEventListener('click', triggerAutoplayOnce, { once: true });
  window.addEventListener('touchstart', triggerAutoplayOnce, { once: true });

  // =========================================================================
  // 12. IN-PAGE PHOTO MANAGER / CUSTOMIZER
  // =========================================================================
  const btnPhotoTool = document.getElementById('btn-photo-tool');
  const photoDrawer = document.getElementById('photo-customizer-drawer');
  const btnCloseDrawer = document.getElementById('btn-close-drawer');
  const btnSavePhotos = document.getElementById('btn-save-photos');
  const btnResetPhotos = document.getElementById('btn-reset-photos');

  if (btnPhotoTool && photoDrawer) {
    btnPhotoTool.addEventListener('click', () => {
      photoDrawer.classList.toggle('active');
    });
  }

  if (btnCloseDrawer && photoDrawer) {
    btnCloseDrawer.addEventListener('click', () => {
      photoDrawer.classList.remove('active');
    });
  }

  // Handle local file uploads into base64
  document.querySelectorAll('.btn-upload-file').forEach(btn => {
    btn.addEventListener('click', () => {
      const slot = btn.getAttribute('data-slot-target');
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const dataUrl = event.target.result;
            const inputField = document.getElementById(`input-${slot}`);
            if (inputField) inputField.value = dataUrl;

            // Direct live update
            const targetImg = document.querySelector(`[data-photo-slot="${slot}"]`);
            if (targetImg) targetImg.src = dataUrl;
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
    });
  });

  if (btnSavePhotos) {
    btnSavePhotos.addEventListener('click', () => {
      const map = {};
      Object.keys(DEFAULT_PHOTOS).forEach(slot => {
        const inputField = document.getElementById(`input-${slot}`);
        if (inputField && inputField.value.trim()) {
          map[slot] = inputField.value.trim();
        }
      });
      localStorage.setItem('umamah_custom_photos', JSON.stringify(map));
      initPhotos();
      if (photoDrawer) photoDrawer.classList.remove('active');
      alert('Photos updated with eternal love! ❤️');
    });
  }

  if (btnResetPhotos) {
    btnResetPhotos.addEventListener('click', () => {
      if (confirm('Reset all photos to default romantic art?')) {
        localStorage.removeItem('umamah_custom_photos');
        Object.keys(DEFAULT_PHOTOS).forEach(slot => {
          const inputField = document.getElementById(`input-${slot}`);
          if (inputField) inputField.value = '';
        });
        initPhotos();
        if (photoDrawer) photoDrawer.classList.remove('active');
      }
    });
  }
});
