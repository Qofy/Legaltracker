# Legaltracker — Local Development README

Short README to run and debug the project locally (frontend + backend + socket relay).

---

## Overview
- Monorepo with `frontend/` (Vue 3 + Vite) and `backend/` (NestJS + Prisma).
- Realtime messaging uses a socket relay; messages are persisted in the backend and additionally cached on the frontend in `localStorage` under the key `direct_messages_cache`.

## Prerequisites
- Node.js (16+ recommended) or Bun (if you prefer, but instructions below use npm).
- npm, pnpm, or yarn available.
- PostgreSQL (or whichever DB is configured in `backend/prisma/schema.prisma`) and Prisma CLI if you need to run migrations.

## Ports used (defaults in this repo)
- Frontend (Vite): `http://localhost:5173`
- Backend (API): `http://localhost:3000` (API prefix usually `/api`)
- Socket relay: `http://localhost:3001` (socket server used by frontend plugins)

## Quick start (frontend)
From the repo root:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

## Quick start (backend)
From the repo root:

```bash
cd backend
npm install
# ensure your .env is configured (DATABASE_URL etc.)
# run prisma migrations if needed:
# npx prisma migrate dev --name init
npm run start:dev
```

If you use `bun`, the project may support `bun run start:dev` — use whichever you normally run for this repo.

## Socket Relay
- The socket server runs separately (check `backend/scripts/socket-server.js` or similar in the repo). It typically listens on `3001`.
- Ensure the socket relay is running when testing realtime behavior.

## Local cache (frontend)
- Key: `direct_messages_cache` in `localStorage`.
- The code now sanitizes cached messages: the `DirectMessage` service strips `password`, `hashedPassword`, and `salt` from embedded user objects before writing cache.
- To clear the cache manually in DevTools Console:

```js
localStorage.removeItem('direct_messages_cache')
```

## Debugging helpers (temporary)
During troubleshooting I added lightweight debug aids to the frontend message components:

- `__source` annotation added to messages: one of `server`, `cache`, `socket`, `local`.
- Small debug chips shown under messages (Admin and Lawyer UIs) displaying the `__source` and the first 8 chars of the message id.
- Console logs showing counts and merged previews:
  - `[DEBUG LAWYER] serverFiltered count: ...`
  - `[DEBUG LAWYER] cachedFiltered count: ...`
  - `[DEBUG LAWYER] merged adminMessages count: ...` and preview
  - `[DEBUG ADMIN] serverFiltered count: ...` (for admin UI)

These are intentionally non-invasive and are useful when reproducing disappearing message issues.

To remove all debug helpers later, revert these files (or I can remove them for you):
- `frontend/src/components/lawyer/LawyerMessages.vue`
- `frontend/src/components/admin/AdminMessages.vue`
- `frontend/src/components/customer/CustomerMessages.vue` (polling frequency changed)
- `frontend/src/services/entities/DirectMessage.js` (sanitization: keep this — it's a security fix)

## What I changed (summary)
- Sanitized cached messages (`DirectMessage.sanitizeMessage`) — removes sensitive fields.
- Added cache merging logic to avoid overwriting local/unsynced messages.
- Reduced polling frequency (3s → 10s) and skip polling when tab is hidden or socket is connected.
- Added `__source` annotations and small debug chips in admin/lawyer message lists.
- Assigned stable keys / `_tempId` for messages without server-assigned IDs to avoid DOM reuse bugs.

## Reproducing and capturing logs
1. Open browser DevTools → Console and Network.
2. Open Lawyer → Admin tab and Admin UI side-by-side (if possible).
3. Send messages both directions and refresh the lawyer or admin page.
4. Copy relevant console logs that start with `[DEBUG LAWYER]` or `[DEBUG ADMIN]` and paste them into an issue or share here.

## Useful commands
- Show cached message ids (DevTools Console):
```js
(JSON.parse(localStorage.getItem('direct_messages_cache')||'{}').data||[]).map(m=>m.id).slice(0,200)
```
- Clear cache:
```js
localStorage.removeItem('direct_messages_cache')
```

## Next steps (suggested)
- If the message disappearance is resolved, remove the temporary debug chips/logs and keep the cache sanitization.
- Consider removing polling entirely and rely on sockets with a short fallback refresh when sockets are disconnected.

---

If you want, I can:
- Remove the debug logging and chips (cleanup commit).
- Add a small `npm` script in `frontend/package.json` to clear the `direct_messages_cache` automatically.

Tell me which cleanup or follow-up you want and I will do it. Enjoy your break! 🚀
