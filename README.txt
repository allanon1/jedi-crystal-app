Jedi Habit Tracker — MVP PWA
================================

This is a production-leaning MVP you can run locally or host anywhere.
It is installable as a PWA on Android (Add to Home Screen) and works offline.

Files
-----
- index.html — app screens and layout
- style.css — visual styles
- app.js — logic, localStorage, approvals, export/import
- manifest.webmanifest — enables install on Android
- service-worker.js — offline caching
- icons/ — app icons

Run locally
-----------
1) Open index.html in Chrome.
2) You should see the app. It will register a service worker, but for full PWA install
   you need to serve via http(s).

Serve locally (optional)
------------------------
Use any static server. For example with Python:
  python3 -m http.server 8080
Then open http://localhost:8080

Install on Android
------------------
1) Open the site in Chrome on your Android phone.
2) Open the ⋮ menu and choose "Add to Home screen".
3) The app will install and run fullscreen offline.

Parent Mode PIN (demo)
----------------------
Default PIN is 1234. You can change it later in code (app.js state.settings.parentPIN).

Data backup
-----------
- Export JSON in Parent Console > Data.
- Import the JSON on the same device to restore.
- This MVP uses localStorage only (fastest path for your deadline).

Next steps
----------
- Optional: wrap this PWA with Capacitor to produce an APK for sideloading.
- After the birthday: add Firebase sync for cross-device, polish assets and sounds.
