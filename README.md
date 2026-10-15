# Ishay's First Birthday — Invitation Website

A single animated, mobile-friendly invitation page for Ishay's 1st birthday,
built with plain HTML/CSS/JS (no build step, no dependencies to install).

## 1. Photos

Six real photos of Ishay are already in `images/` (resized/compressed for the
web with macOS `sips`), wired up through [`js/config.js`](js/config.js):

| File | Used for |
|---|---|
| `images/b4.jpg` | Hero photo, inside the round watermelon frame |
| `images/nb1.jpg` | Gallery — "Our tiny beginning" newborn card |
| `images/nb2.jpg` | Gallery — "Wrapped in love" newborn card |
| `images/b3.jpg` | Gallery — "Our growing joy" birthday-frame card |
| `images/fam2.jpg` | Soft background photo behind the invitation message card |
| `images/fam1.jpg` | Not placed yet — swap in for `fam2.jpg` above if you prefer it |

To swap any photo, just change its path in `js/config.js` under `photos` —
nothing else needs editing. If a path ever points to a missing file, that
slot falls back to a cute placeholder automatically instead of breaking.

## 2. Configure Web3Forms (RSVP emails)

1. Go to **https://web3forms.com**, enter the email address that should
   receive RSVPs, and generate a free access key.
2. Open [`js/config.js`](js/config.js) and paste the key into:
   ```js
   web3formsAccessKey: "YOUR_WEB3FORMS_ACCESS_KEY_HERE",
   ```
3. That's it — no server or backend is required. Web3Forms delivers each
   RSVP (name, attending yes/no, guest count, food preference, message,
   submission time) straight to the inbox tied to that access key.

Until a real key is pasted in, the form will show a friendly "setup isn't
finished yet" message instead of pretending to submit.

## 3. Event details (date, time, venue)

Everything guests see — and the live countdown — is driven from one place:
[`js/config.js`](js/config.js). Edit `eventDateParts`, `eventDateDisplay`,
`eventTimeDisplay`, `venueName`, and `mapsUrl` there if anything changes.

The Google Maps button already links to a verified search for
**Sint-Rochuskerk, Halle, Belgium**:
`https://www.google.com/maps/search/?api=1&query=Sint-Rochuskerk%2C%20Halle%2C%20Belgium`

## 4. Background music (optional)

Add your own royalty-free lullaby/nursery track at `audio/lullaby.mp3`
(or change the path in `config.js`). The play/pause button in the bottom-right
never autoplays — it only starts when a guest taps it — and gracefully
disables itself if no file is present.

## 5. Running it locally

No build tools needed. Either:

- Double-click `index.html`, or
- Serve it locally, e.g.:
  ```bash
  cd ishay-birthday-invitation
  python3 -m http.server 8080
  ```
  then open `http://localhost:8080`.

## 6. Publishing it online

Any static host works, for example:

- **Netlify / Vercel**: drag-and-drop the whole `ishay-birthday-invitation`
  folder onto their dashboard, or connect a GitHub repo.
- **GitHub Pages**: push this folder to a repo and enable Pages on the
  `main` branch.

No environment variables or server code are required — just upload the
folder as-is (with your real photos and Web3Forms key already added).

## What was tested

- Layout checked at mobile (375px) and desktop widths.
- RSVP "Yes" path shows guest-count + food preference as required fields;
  "No" path hides/clears them and skips that validation.
- Required-field validation blocks submission with inline + summary errors.
- The submit button disables itself and shows "Sending…" while a request is
  in flight, to prevent duplicate submissions.
- Success/error messages only appear based on the actual Web3Forms response
  — never shown optimistically.
- Countdown switches to a celebration message automatically once the event
  date/time has passed.
- `prefers-reduced-motion` disables confetti, balloons, and decorative
  animation for guests who've asked for reduced motion.
