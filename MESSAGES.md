Messages & Sockets — README

Purpose
- Document the chat/message flow and Socket.IO integration used by this project (frontend + backend).
- Explain how messages are created, persisted, broadcast in real time, and how clients join case-specific rooms.
- Provide debugging tips and migration recommendations (standalone socket script -> NestJS Gateway).

Files / Locations (important)
- Backend
  - `backend/src/chat-messages/chat-message.entity.ts` — ChatMessage DB entity (columns: `id`, `content` (NOT NULL), `message_type`, `file_url`, `file_name`, `case_id`, `sender_id`, `created_at`, ...).
  - `backend/src/chat-messages/chat-messages.controller.ts` — REST endpoints for chat messages (GET, POST, etc.). Guarded by `JwtAuthGuard`.
  - `backend/src/chat-messages/chat-messages.service.ts` — Business logic, `create()` validates access and persists the message.
  - `backend/scripts/socket-server.js` — (dev) standalone Socket.IO server used for realtime broadcasting in development.
  - `backend/src/cases/cases.service.ts` — Case access checks (`canAccessCase`) — important for chat authorization (ensure assigned lawyer is allowed).
- Frontend
  - `frontend/src/plugins/socket.js` — Singleton Socket.IO client initializer used by components.
  - `frontend/src/services/entities/ChatMessage.js` — Client-side service wrapper for REST chat API (`list`, `create`, `filter`, ...).
  - `frontend/src/components/customer/CustomerMessages.vue` — Customer/Client chat UI; joins case rooms and sends messages.
  - `frontend/src/components/lawyer/LawyerMessages.vue` — Lawyer chat UI; lists assigned cases and messages; joins case rooms.

High-level Flow
1. Authentication
   - All REST endpoints for chat use JWT auth (`JwtAuthGuard`). The frontend sends `Authorization: Bearer <token>` via axios (see `frontend/src/plugins/axios.js`).
   - Socket handshake also sends `auth: { token }` when connecting (`initSocket(authToken)`). The server should validate token on connect.

2. Creating (sending) a message (client -> server)
   - Client builds payload with at minimum:
     - `case_id`: string (the case/room id)
     - `content`: string (message body) — THIS FIELD IS REQUIRED (DB NOT NULL)
     - Optionally: `message_type`, `file_url`, `file_name`
   - Client calls POST `/api/chat-messages` with the payload. Example (axios):
     - `POST /api/chat-messages` body: `{ case_id: "<case-id>", content: "Hello" }`
   - Backend controller receives request, guarded by JWT. Controller logs incoming body (debug logs can show it).
   - Backend `ChatMessagesService.create()` calls `casesService.canAccessCase(case_id, user)` to verify the authenticated user may post to that case chat.
     - If not authorized, the service throws `ForbiddenException` -> HTTP 403 (you may see `403 Forbidden` in client).
   - If authorized, service creates `ChatMessage` (derives `sender_id` from `req.user`) and saves to DB.
   - After persist, backend (or dev socket server) broadcasts the new message to the case room.

3. Broadcasting and real-time delivery (server -> clients)
   - Rooms: each `case_id` acts as a room name. Clients `join_case` with `case_id` to receive messages for that case.
   - Events (convention used in this repo):
     - Client -> Server:
       - `join_case` with payload `caseId` — server joins socket to room
       - `leave_case` with payload `caseId` — server leaves room
       - `client:new_message` with payload `{ ...message }` — sometimes emitted by client after POST success (optimistic or to notify other connected sockets)
     - Server -> Clients:
       - `new_message` with payload `{ id, case_id, content, sender_id, created_at, ... }` — broadcast to all sockets in room except the origin if desired
   - Dev setup: `backend/scripts/socket-server.js` listens on `process.env.SOCKET_PORT || 3001` and responds to these events. The server emits `new_message` to room `case:<caseId>` or just `caseId` depending on implementation (check script logs).

4. Client behavior (frontend code)
   - When a user opens/messages a case, components call `getSocket()` (from `frontend/src/plugins/socket.js`) and `socket.emit('join_case', caseId)`.
   - When switching cases, components `emit('leave_case', previousCaseId)` then `emit('join_case', newCaseId)`.
   - After POST `/api/chat-messages` returns, frontend pushes the returned message into local `messages` array and emits `client:new_message` so other connected clients see the message faster.
   - Frontend components listen for `new_message` and:
     - If `msg.case_id` === currently open case, append message and scroll to bottom.
     - Else increment `unreadMap[msg.case_id]` so the UI shows unread badges.

Authorization & Access Control
- REST endpoints are protected by `JwtAuthGuard`. Ensure the frontend sends a valid JWT via `localStorage.accessToken` (axios interceptor sets `Authorization` header).
- `canAccessCase(caseId, user)` in `cases.service.ts` must return true for the actor to view/post:
  - This project expects `canAccessCase` to allow: case owners, case customers, shared users, and assigned lawyer(s).
  - If messages from lawyer -> client produce HTTP 403, check `canAccessCase` includes the assigned lawyer.

Common Errors & Troubleshooting
- HTTP 403 Forbidden when creating chat messages
  - Cause: `canAccessCase` returned false, or the JWT is missing/invalid.
  - Fixes:
    - Ensure frontend `Authorization` header is present and has a valid token (login via app to get a real token; avoid using fake tokens).
    - Verify `cases.service.ts` includes `assigned_lawyer` check (see `isAssigned` logic). If not, add it.
    - Check server logs for `ForbiddenException` stack or debug prints from `ChatMessagesController` and service.

- HTTP 500 / QueryFailedError: NOT NULL constraint failed: chat_messages.content
  - Cause: request body did not include `content` (DB expects `content` non-nullable).
  - Fixes:
    - Ensure frontend sends `{ content: 'text', case_id: '...' }` and that payload reaches the server.
    - Inspect controller logging: `console.debug('[ChatMessagesController] create received body:', JSON.stringify(createDto))` will show what the server received.

- Socket `connect_error: server error`
  - Causes:
    - Socket server not running at `VITE_SOCKET_URL` (default `http://localhost:3001`).
    - CORS or handshake validation failed (server rejects token in `handshake.auth`).
    - Version mismatch or network issue.
  - Fixes:
    - Confirm the socket server process is running (`node scripts/socket-server.js` started by `npm run start:dev`).
    - Confirm `VITE_SOCKET_URL` in frontend `.env` or `frontend/src/plugins/socket.js` default is correct.
    - Look in server logs for handshake reject messages or exceptions.

Dev run / Local testing
- Backend (runs NestJS + dev socket script):
  ```bash
  cd backend
  npm install
  npm run start:dev
  # This runs "nest start --watch" and node scripts/socket-server.js via concurrently
  ```
- Frontend:
  ```bash
  cd frontend
  npm install
  npm run dev
  ```
- Test flow:
  1. Log in as a lawyer in the frontend (get a real JWT).
  2. Open the Lawyer Messages panel and pick a case.
  3. Ensure the lawyer joined the case room (`join_case` event emitted, server logs should show join).
  4. Send a message — watch Network tab for POST `/api/chat-messages` and confirm `content` in Request Payload and `Authorization` header present.
  5. Watch backend console logs for controller/service debug lines and socket broadcast logs.
  6. Verify the client (customer) receives `new_message` via socket and unread badge increments if not on the same case.

Sample REST payloads
- Create message (curl example):
  ```bash
  curl -X POST http://localhost:3000/api/chat-messages \
    -H "Authorization: Bearer <JWT>" \
    -H "Content-Type: application/json" \
    -d '{"case_id":"abc123","content":"Hello, this is a message"}'
  ```

Sample socket usage (client)
- Init socket and connect (frontend `initSocket(token)` uses this pattern):
  ```js
  const socket = io(VITE_SOCKET_URL || 'http://localhost:3001', {
    auth: { token },
    transports: ['websocket', 'polling'],
  });

  socket.emit('join_case', 'abc123');
  socket.on('new_message', (msg) => console.log('received', msg));
  socket.emit('leave_case', 'abc123');
  socket.emit('client:new_message', msgObject); // optional after POST
  ```

Production recommendations
- Integrate Socket.IO into NestJS as a `Gateway` rather than a standalone script:
  - Benefits: can reuse guards and services (auth, user lookup, cases validation), share TypeORM entities, and simplify deployment.
  - Use `@WebSocketGateway()` and `@SubscribeMessage()` with the `@UseGuards(new WsGuard())` or custom handshake token verification.
- Authentication on socket connect:
  - Validate `socket.handshake.auth.token` in a `handleConnection` method and reject unauthorized sockets.
- Scaling sockets:
  - Use `socket.io-redis` or the official `@socket.io/redis-adapter` to share rooms and broadcasts across multiple server instances.

Notes / Gotchas observed in this repo
- Frontend initially used `message` field in some UI renderers; backend expects `content`. Several components were updated to use `content || message` as a fallback.
- `canAccessCase` was updated to include `assigned_lawyer` as an allowed actor (important so lawyers can post to assigned cases).
- The dev socket server in `backend/scripts/socket-server.js` is minimal — it does not validate JWT on handshake. For production, add JWT validation or migrate to a Nest gateway that checks tokens.

Where to look when things fail
- Backend logs: `backend/dist` console (when running `npm run start:dev`) — look for `ChatMessagesController` and `ChatMessagesService.create` debug prints.
- Socket server logs: `backend/scripts/socket-server.js` stdout.
- Frontend network: Browser DevTools Network tab for `POST /api/chat-messages` — check request body and Authorization header.
- Frontend console: look for `connect_error` stack traces and the stdout prints from `frontend/src/plugins/socket.js`.

Next steps / Improvements
- Replace the standalone socket script with a NestJS Gateway that performs token validation and has access to TypeORM services.
- Add server-side acknowledgement (ACK) for `client:new_message` to ensure reliable delivery.
- Add unit/integration tests for chat endpoints and socket flows.


-- End of document
