# tnglogbot — expanded version

This expanded version includes:
- Modular JavaScript (ES modules) for clear separation.
- Exercise catalog (`exercises.json`).
- Modal-based addition of exercises with validation and parsing of set strings like `10@60,8@70`.
- History filtering and CSV export.
- Namespaced localStorage keys using Telegram user id when available.
- PWA support with service worker and manifest.

How to run:
1. Serve the folder with any static server (recommended `npx http-server .` or a simple Python server).
2. Open `http://localhost:8080` (or the port from your static server).
3. Test creating workouts, editing profile, and viewing history.

Notes:
- Data is stored in `localStorage` and namespaced. Clearing browser storage will remove data.
- For Telegram integration, open as a Telegram Web App and the user id will be used to namespace localStorage keys.

If you want, I can:
- convert this to TypeScript + Vite + ESLint/Prettier,
- add unit tests and CI,
- add user authentication and remote sync (Firebase or backend).

