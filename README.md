# Legaltracker — Feature Summary & Run Guide

This README summarizes the recent feature work implemented in the Legaltracker workspace and gives instructions to run and test the main flows (comments, meetings, reports, AI settings, and UI helpers).

Note: this repo contains a `backend/` (NestJS) and `frontend/` (Vue 3 + Vite) project. The backend is expected to run on `http://localhost:3000/api` and the frontend on `http://localhost:5173` (Vite default).

## New / Updated Features (high level)

- Comments system
  - `frontend/src/components/comments/CommentsPannel.vue`: UI for listing and posting comments on a case.
  - Server-side support in `backend/src/comments/*` including visibility rules and comment metadata (`comment_type`, `is_shared`, `is_internal`).
  - Embedded in dashboard, customer case view, and lawyer documents view so customers, lawyers and admins can comment.

- Schedule & Meetings
  - `frontend/src/components/schedule/*` and `frontend/src/views/Schedule.vue` implemented for creating and viewing meetings.
  - `backend` meetings endpoints accept `meeting_date`, `duration_minutes`, and `attendee_ids`.

- Lawyer Reports
  - UI to create PDF/Excel reports and send to admin; admin report viewer with download and status actions.

- Settings: AI Configuration
  - `frontend/src/views/Settings.vue` persists `ai_provider`, `ai_model`, and API keys to the user profile.
  - `frontend/src/integrations/Core.js` contains a local InvokeLLM shim for development.

- UI helpers
  - Persistent overlay icons (briefcase, map pin) top-right; bug and developer tools (bottom-right) with modals.
  - All interactive elements show pointer cursor via `frontend/src/style.css`.

## Comment System — Important Notes

- Server side enforcement
  - `backend/src/comments/comment.entity.ts` includes `comment_type`, `is_shared`, and `is_internal` columns.
  - `backend/src/comments/comments.service.ts` enforces access control:
    - Only users with access to the case (owner/customer/shared user or admin) can create comments.
    - Private comments (`is_shared=false`) are visible only to the comment author and admins.
    - Internal comments (`is_internal=true`) are visible only to lawyers and admins.
    - Owners (authors) can edit their comments; admins can edit any comment.

- Frontend
  - `CommentsPannel.vue` normalizes server responses and displays badge indicators for `comment_type`, `is_shared`, and `is_internal`.
  - The add-comment form allows type selection and privacy toggles; internal toggle is shown only to lawyers/admins.

## How to Run (dev)

1. Start the backend (requires Node, Bun or configured environment):

```bash
cd backend
# using bun (example in this workspace):
bun run start:dev
# or with npm: npm run start:dev
```

2. Start the frontend (Vite):

```bash
cd frontend
npm install    # if dependencies missing
npm run dev
```

3. Open the app in the browser (Vite will print the URL, commonly `http://localhost:5173`).

## Quick Tests

- Comments
  - Open Dashboard or Customer case details.
  - Click a case to select it (Dashboard) or open a case page (Customer/Lawyer views).
  - Use the `+` button in the Comments panel to add a comment. Toggle privacy (`Shared`/`Private`) and, for lawyers, `Internal`.

- Meetings
  - As an admin, create a meeting for a case and ensure assigned lawyer and client receive the meeting item in `My Meetings`.

- Reports
  - As a lawyer, generate a report and send to admin. As admin, view/download the report.

## Files of Interest

- Frontend
  - `frontend/src/components/comments/CommentsPannel.vue`
  - `frontend/src/views/Dashboard.vue`
  - `frontend/src/components/customer/CustomerCaseDetails.vue`
  - `frontend/src/components/lawyer/LawyerDocuments.vue`
  - `frontend/src/services/entities/Comment.js`
  - `frontend/src/App.vue` (overlay icons + tool modals)

- Backend
  - `backend/src/comments/comment.entity.ts`
  - `backend/src/comments/comments.service.ts`
  - `backend/src/comments/comments.controller.ts`

## Suggested Next Steps

- Add edit/delete controls in the frontend for comment owners and moderation actions for admins.
- Add migrations (or run schema synchronization carefully) to ensure DB has the new comment columns in production.
- Add real-time updates (WebSocket, Pusher) to push new comments to clients without refresh.

If you want, I can implement one of these next steps now — which would you like me to prioritize?

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
