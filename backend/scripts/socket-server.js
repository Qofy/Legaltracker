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

  socket.on('client:new_message', (msg) => {
    console.log('[socket] client:new_message', msg && msg.id ? `id=${msg.id}` : msg);
    // Broadcast to all clients. In production, you likely want to emit to a room.
    io.emit('new_message', msg);
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
