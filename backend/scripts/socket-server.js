const http = require('http');
const { Server } = require('socket.io');

const PORT = process.env.SOCKET_PORT || 3001;

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('[socket] client connected', socket.id, socket.handshake?.auth || {});

  // Allow clients to register their user id and user type to join rooms
  socket.on('register', (info) => {
    try {
      const userId = info && info.userId ? info.userId : null;
      const userType = info && info.userType ? info.userType : null;
      if (userId) {
        const room = `user_${userId}`;
        socket.join(room);
        console.log(`[socket] ${socket.id} registered as ${userId} and joined ${room}`);
      }
      if (userType === 'admin') {
        socket.join('admins');
        console.log(`[socket] ${socket.id} joined admins room`);
      }
    } catch (e) {
      console.error('Error in register handler', e);
    }
  });

  socket.on('client:new_message', (msg) => {
    console.log('[socket] client:new_message', msg && msg.id ? `id=${msg.id}` : msg);
    try {
      // If message is associated with a case, emit to that case room
      if (msg && msg.case_id) {
        const caseRoom = `case_${msg.case_id}`;
        io.to(caseRoom).emit('new_message', msg);
        console.log(`[socket] emitted new_message to ${caseRoom}`);
      }

      // Emit to recipient's personal room so only intended recipient(s) receive it
      if (msg && msg.recipient_id) {
        const recipientRoom = `user_${msg.recipient_id}`;
        io.to(recipientRoom).emit('new_message', msg);
        console.log(`[socket] emitted new_message to ${recipientRoom}`);
      }

      // Emit to sender's personal room so sender's connected clients receive the message
      if (msg && msg.sender_id) {
        const senderRoom = `user_${msg.sender_id}`;
        io.to(senderRoom).emit('new_message', msg);
        console.log(`[socket] emitted new_message to ${senderRoom}`);
      }

      // If recipient is an admin id we also broadcast to the `admins` room
      // (useful when admins are multiple and should all receive messages sent to any admin)
      // NOTE: This will duplicate delivery to the primary admin if they are in both rooms,
      // client-side deduplication avoids duplicate rendering by checking message id.
      if (msg && msg.recipient_id) {
        // No easy way to detect admin vs non-admin here without DB lookup; emit to admins room
        // only when recipient_id looks like an admin id (heuristic omitted). For now, always
        // emit to admins so admin dashboards receive messages sent to admin accounts.
        io.to('admins').emit('new_message', msg);
        console.log('[socket] emitted new_message to admins room');
      }
    } catch (e) {
      console.error('Error broadcasting new_message', e);
    }
  });

  socket.on('join_case', (caseId) => {
    if (!caseId) return;
    const room = `case_${caseId}`;
    socket.join(room);
    console.log(`[socket] ${socket.id} joined ${room}`);
  });

  socket.on('leave_case', (caseId) => {
    if (!caseId) return;
    const room = `case_${caseId}`;
    socket.leave(room);
    console.log(`[socket] ${socket.id} left ${room}`);
  });

  socket.on('disconnect', (reason) => {
    console.log('[socket] client disconnected', socket.id, reason);
  });
});

server.listen(PORT, () => console.log(`[socket] listening on :${PORT}`));
