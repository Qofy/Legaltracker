import { io } from 'socket.io-client';

let socket = null;

export function initSocket(token) {
  if (socket) return socket;

  const opts = {};
  if (token) opts.auth = { token };

  // Prefer explicit url from Vite env: VITE_SOCKET_URL.
  // Example: VITE_SOCKET_URL="http://localhost:3001"
  // Default to localhost:3001 for dev if not provided.
  const url = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';
  // Log chosen URL for easier debugging
  // eslint-disable-next-line no-console
  console.debug('[socket] connecting to', url);
  try {
    socket = io(url, opts);
    socket.on('connect', () => console.debug('[socket] connected', socket.id));
    socket.on('disconnect', (reason) => console.debug('[socket] disconnected', reason));
    socket.on('connect_error', (err) => console.debug('[socket] connect_error', err));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Failed to initialize socket', e);
  }

  return socket;
}

export function getSocket() {
  return socket;
}

export function closeSocket() {
  if (socket) {
    try { socket.disconnect(); } catch (e) {}
    socket = null;
  }
}
