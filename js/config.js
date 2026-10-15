/**
 * ============================================================
 *  ISHAY'S FIRST BIRTHDAY — SINGLE EDIT POINT
 *  Change event details, photo paths, music, and the Web3Forms
 *  access key here. Nothing else in the site needs to change.
 * ============================================================
 */
window.EVENT_CONFIG = {
  babyName: "Ishay",
  parents: "Vishnu & Athira",

  // Used to compute the live countdown. Keep in sync with the
  // human-readable strings below if you ever change the date/time.
  // Format: [year, monthIndex(0-11), day, hour(0-23), minute]
  eventDateParts: [2026, 9, 24, 23, 0],

  // What guests actually read on the page.
  eventDateDisplay: "Saturday, 24 October 2026",
  eventTimeDisplay: "11:00 PM",
  venueName: "Sint-Rochus Church, Kardinaal Mercierplein 1, 1500 Halle, Belgium",

  // Verified Google Maps search link for the church — do not replace
  // with invented coordinates.
  mapsUrl: "https://maps.app.goo.gl/BvtB2F3wWU2C1tJC9",

  // --- Web3Forms -------------------------------------------------
  // 1. Go to https://web3forms.com and create a free access key using
  //    the email address that should receive RSVP notifications.
  // 2. Paste that key below, replacing the placeholder text.
  // Never commit a real key to a public repository if you'd rather
  // keep it private — for a personal invite site this is normally fine,
  // since Web3Forms access keys are meant to be used client-side.
  web3formsAccessKey: "bd1d3469-07ad-48aa-94eb-d62db9622929",

  // --- Photos ------------------------------------------------------
  // Change any path below to swap a photo — nothing else needs editing.
  photos: {
    hero: "images/b4.jpg",              // hero / watermelon frame
    newbornOne: "images/nb1.jpg",       // "newborn days" memory card
    newbornTwo: "images/nb2.jpg",       // "newborn days" memory card
    birthday: "images/b3.jpg",          // "our joyful boy" birthday-frame card
    familyBackdrop: "images/fam1.jpg",  // soft background behind the invitation message
  },

  // --- Background music ---------------------------------------
  // Add your own royalty-free lullaby/nursery track at this path.
  // The play/pause button works even if the file is missing — it
  // simply shows a gentle "no music yet" state.
  backgroundMusic: "audio/tone.mp3",
};
