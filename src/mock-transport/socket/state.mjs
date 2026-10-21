export function initializeSocket(socket, defaults, events, url, protocols) {
  socket.url = url;
  socket.protocols = protocols;
  socket.readyState = defaults.autoOpen ? 1 : 0;
  socket.listeners = new Map();
  socket.sent = [];
  socket.closed = false;
  socket._timers = new Set();
  socket._events = [...(Array.isArray(defaults.events) ? defaults.events : events)];
  if (defaults.autoOpen) queueMicrotask(() => socket.emit("open"));
}
