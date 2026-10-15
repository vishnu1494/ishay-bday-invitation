(() => {
  "use strict";

  const CONFIG = window.EVENT_CONFIG;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ----------------------------------------------------------------
   * Apply photo paths from config.js — the single place to swap photos
   * ---------------------------------------------------------------- */
  const photoElements = {
    heroPhoto: CONFIG.photos.hero,
    newbornPhotoOne: CONFIG.photos.newbornOne,
    newbornPhotoTwo: CONFIG.photos.newbornTwo,
    birthdayPhoto: CONFIG.photos.birthday,
    familyBackdropPhoto: CONFIG.photos.familyBackdrop,
  };
  Object.keys(photoElements).forEach((id) => {
    const img = document.getElementById(id);
    if (img && photoElements[id]) img.src = photoElements[id];
  });

  /* ----------------------------------------------------------------
   * Smooth scroll for in-page nav / CTA buttons
   * ---------------------------------------------------------------- */
  document.querySelectorAll("[data-scroll-to]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = document.querySelector(btn.getAttribute("data-scroll-to"));
      if (target) {
        target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
      }
    });
  });

  /* ----------------------------------------------------------------
   * Fade-in-on-scroll for sections / cards
   * ---------------------------------------------------------------- */
  const revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ----------------------------------------------------------------
   * Confetti + balloons (skipped entirely under reduced motion)
   * ---------------------------------------------------------------- */
  function spawnConfetti() {
    const field = document.getElementById("confettiField");
    if (!field || prefersReducedMotion) return;
    const colors = ["#ff5a5f", "#ffd93d", "#6bcB77", "#4d96ff", "#ff8fb1", "#ffffff"];
    const shapes = ["circle", "rect"];
    const count = window.innerWidth < 600 ? 18 : 32;

    for (let i = 0; i < count; i++) {
      const piece = document.createElement("span");
      piece.className = `confetti confetti--${shapes[i % shapes.length]}`;
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.background = colors[i % colors.length];
      piece.style.animationDuration = `${6 + Math.random() * 6}s`;
      piece.style.animationDelay = `${Math.random() * 8}s`;
      piece.style.setProperty("--drift", `${(Math.random() - 0.5) * 120}px`);
      field.appendChild(piece);
    }
  }
  spawnConfetti();

  /* ----------------------------------------------------------------
   * Floating watermelon characters react to hover / tap
   * ---------------------------------------------------------------- */
  document.querySelectorAll(".melon-buddy").forEach((melon) => {
    const wiggle = () => {
      melon.classList.remove("is-wiggling");
      // force reflow so the animation can restart on repeated taps
      void melon.offsetWidth;
      melon.classList.add("is-wiggling");
    };
    melon.addEventListener("mouseenter", wiggle);
    melon.addEventListener("touchstart", wiggle, { passive: true });
  });

  /* ----------------------------------------------------------------
   * Live countdown → celebration message after the date passes
   * ---------------------------------------------------------------- */
  function initCountdown() {
    const wrap = document.getElementById("countdown");
    const celebration = document.getElementById("countdownCelebration");
    if (!wrap) return;

    const [y, m, d, h, min] = CONFIG.eventDateParts;
    const target = new Date(y, m, d, h, min, 0).getTime();

    const els = {
      days: document.getElementById("cdDays"),
      hours: document.getElementById("cdHours"),
      minutes: document.getElementById("cdMinutes"),
      seconds: document.getElementById("cdSeconds"),
    };

    function tick() {
      const now = Date.now();
      const diff = target - now;

      if (diff <= 0) {
        wrap.hidden = true;
        if (celebration) celebration.hidden = false;
        clearInterval(timer);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      els.days.textContent = String(days);
      els.hours.textContent = String(hours).padStart(2, "0");
      els.minutes.textContent = String(minutes).padStart(2, "0");
      els.seconds.textContent = String(seconds).padStart(2, "0");
    }

    tick();
    const timer = setInterval(tick, 1000);
  }
  initCountdown();

  /* ----------------------------------------------------------------
   * Background music toggle — never autoplays
   * ---------------------------------------------------------------- */
  function initMusic() {
    const btn = document.getElementById("musicToggle");
    const audio = document.getElementById("bgMusic");
    if (!btn || !audio) return;

    let hasErrored = false;
    let userPaused = false;

    function markUnavailable() {
      hasErrored = true;
      btn.classList.add("is-unavailable");
      btn.setAttribute("aria-label", "Background music unavailable — add " + CONFIG.backgroundMusic);
      btn.title = "Add " + CONFIG.backgroundMusic + " to enable music";
    }
    audio.addEventListener("error", markUnavailable);

    function setPlayingUI(isPlaying) {
      btn.classList.toggle("is-playing", isPlaying);
      btn.setAttribute("aria-pressed", String(isPlaying));
      btn.setAttribute("aria-label", isPlaying ? "Pause background music" : "Play background music");
    }

    // The site wants music playing on a loop as soon as the page loads.
    // Browsers block unmuted autoplay until the visitor interacts with the
    // page, so: try immediately, and if that's blocked, start on the very
    // first tap/click/key anywhere (the music button's own click handler
    // already covers the case where that first interaction IS the button).
    function tryAutoplay() {
      if (hasErrored || userPaused) return;
      audio.play().then(
        () => setPlayingUI(true),
        () => {
          const resume = (e) => {
            if (userPaused) return;
            if (e.target && e.target.closest && e.target.closest("#musicToggle")) return;
            audio.play().then(() => setPlayingUI(true)).catch(() => {});
          };
          document.addEventListener("pointerdown", resume, { once: true });
          document.addEventListener("keydown", resume, { once: true });
        }
      );
    }
    tryAutoplay();

    btn.addEventListener("click", async () => {
      if (hasErrored) return;
      try {
        if (audio.paused) {
          userPaused = false;
          await audio.play();
          setPlayingUI(true);
        } else {
          userPaused = true;
          audio.pause();
          setPlayingUI(false);
        }
      } catch (err) {
        markUnavailable();
      }
    });
  }
  initMusic();

  /* ----------------------------------------------------------------
   * Photo fallback — swap to a cute local placeholder if an image
   * fails to load (e.g. real photo not added yet).
   * ---------------------------------------------------------------- */
  document.querySelectorAll("img[data-fallback]").forEach((img) => {
    const applyFallback = () => {
      const fallback = img.getAttribute("data-fallback");
      if (img.src.endsWith(fallback)) return;
      img.src = fallback;
      img.classList.add("is-placeholder");
    };
    // By the time this script runs, a same-page <img> may have already
    // finished failing to load — the "error" event won't fire again, so
    // check the already-settled state first and only listen for the rest.
    if (img.complete) {
      if (img.naturalWidth === 0) applyFallback();
    } else {
      img.addEventListener("error", applyFallback, { once: true });
    }
  });

  /* ----------------------------------------------------------------
   * RSVP form
   * ---------------------------------------------------------------- */
  function initRSVP() {
    const form = document.getElementById("rsvpForm");
    if (!form) return;

    const attendingSelect = document.getElementById("attending");
    const conditionalFields = document.getElementById("conditionalFields");
    const guestsInput = document.getElementById("guests");
    const foodInputs = form.querySelectorAll('input[name="food"]');
    const submitBtn = document.getElementById("rsvpSubmit");
    const statusBox = document.getElementById("rsvpStatus");
    const errorSummary = document.getElementById("rsvpErrors");

    function setConditionalRequired(isAttending) {
      conditionalFields.hidden = !isAttending;
      guestsInput.required = isAttending;
      foodInputs.forEach((input) => (input.required = isAttending));
      if (!isAttending) {
        guestsInput.value = "";
        foodInputs.forEach((input) => (input.checked = false));
        clearFieldError(guestsInput);
        clearFieldError(form.querySelector('[name="food"]'));
      }
    }

    attendingSelect.addEventListener("change", () => {
      setConditionalRequired(attendingSelect.value === "yes");
    });

    function fieldError(input, message) {
      const errorEl = form.querySelector(`[data-error-for="${input.id || input.name}"]`);
      if (errorEl) errorEl.textContent = message || "";
      if (input) input.setAttribute("aria-invalid", message ? "true" : "false");
    }
    function clearFieldError(input) {
      if (input) fieldError(input, "");
    }

    function validate() {
      let valid = true;
      const errors = [];

      const fullName = document.getElementById("fullName");
      if (!fullName.value.trim()) {
        fieldError(fullName, "Please enter your full name.");
        errors.push("Full name is required.");
        valid = false;
      } else {
        clearFieldError(fullName);
      }

      if (!attendingSelect.value) {
        fieldError(attendingSelect, "Please let us know if you can attend.");
        errors.push("Please select whether you'll attend.");
        valid = false;
      } else {
        clearFieldError(attendingSelect);
      }

      if (attendingSelect.value === "yes") {
        const guestsVal = Number(guestsInput.value);
        if (!guestsInput.value || guestsVal < 1) {
          fieldError(guestsInput, "Please enter the number of guests (at least 1).");
          errors.push("Number of guests is required.");
          valid = false;
        } else {
          clearFieldError(guestsInput);
        }

        const foodChosen = Array.from(foodInputs).some((i) => i.checked);
        if (!foodChosen) {
          fieldError(form.querySelector('[name="food"]'), "Please choose a food preference.");
          errors.push("Food preference is required.");
          valid = false;
        } else {
          clearFieldError(form.querySelector('[name="food"]'));
        }
      }

      if (errorSummary) {
        errorSummary.innerHTML = "";
        if (errors.length) {
          errors.forEach((msg) => {
            const li = document.createElement("li");
            li.textContent = msg;
            errorSummary.appendChild(li);
          });
        }
      }

      return valid;
    }

    let isSubmitting = false;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (isSubmitting) return;

      statusBox.hidden = true;
      statusBox.className = "rsvp-status";

      if (!validate()) {
        const firstInvalid = form.querySelector('[aria-invalid="true"]');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      const accessKey = CONFIG.web3formsAccessKey;
      if (!accessKey || accessKey === "YOUR_WEB3FORMS_ACCESS_KEY_HERE") {
        statusBox.hidden = false;
        statusBox.classList.add("rsvp-status--error");
        statusBox.textContent =
          "RSVP setup isn't finished yet — a Web3Forms access key needs to be added in js/config.js before responses can be delivered. Please try again later.";
        return;
      }

      isSubmitting = true;
      submitBtn.disabled = true;
      submitBtn.classList.add("is-loading");
      const originalLabel = submitBtn.textContent;
      submitBtn.textContent = "Sending…";

      const attending = attendingSelect.value;
      const foodChecked = form.querySelector('input[name="food"]:checked');

      const payload = new FormData();
      payload.append("access_key", accessKey);
      payload.append("subject", "Ishay's First Birthday — New RSVP");
      payload.append("from_name", `${CONFIG.babyName}'s Birthday Invitation`);
      payload.append("full_name", document.getElementById("fullName").value.trim());
      payload.append("attending", attending === "yes" ? "Yes, we'll be there! 🎉" : "Sorry, can't make it 💕");
      payload.append("guests", attending === "yes" ? guestsInput.value : "N/A");
      payload.append("food_preference", attending === "yes" && foodChecked ? foodChecked.value : "N/A");
      payload.append("message", document.getElementById("wish").value.trim() || "(no message)");
      payload.append("submitted_at", new Date().toLocaleString());
      payload.append("botcheck", ""); // honeypot

      try {
        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { Accept: "application/json" },
          body: payload,
        });
        const result = await response.json();

        if (response.ok && result.success) {
          statusBox.hidden = false;
          statusBox.classList.add("rsvp-status--success");
          statusBox.textContent =
            attending === "yes"
              ? "Thank you for your response! ❤️ We can't wait to celebrate Ishay's first birthday with you!"
              : "Thank you for letting us know. Sending lots of love from Ishay, Vishnu & Athira! 💕";
          form.reset();
          setConditionalRequired(false);
          form.hidden = true;
        } else {
          throw new Error(result.message || "Submission failed");
        }
      } catch (err) {
        statusBox.hidden = false;
        statusBox.classList.add("rsvp-status--error");
        statusBox.textContent =
          "Oh no, something went wrong sending your RSVP. Please check your connection and try again.";
      } finally {
        isSubmitting = false;
        submitBtn.disabled = false;
        submitBtn.classList.remove("is-loading");
        submitBtn.textContent = originalLabel;
      }
    });
  }
  initRSVP();
})();
