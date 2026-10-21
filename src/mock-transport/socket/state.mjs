import { selectInitialEvents } from "./event-selection.mjs";
import { scheduleSocketOpen } from "./lifecycle.mjs";

export function initializeSocket(socket, defaults, events, url, protocols) {
  socket.url = url;
  socket.protocols = protocols;
  socket.readyState = defaults.autoOpen ? 1 : 0;
  socket.listeners = new Map();
  socket.sent = [];
  socket.closed = false;
  socket._timers = new Set();
  socket._events = [...selectInitialEvents(defaults.events, events)];
  if (defaults.autoOpen) scheduleSocketOpen(socket);
}
