import { cancelTimers } from "../scheduler.mjs";

export function emitSocketError(socket, error) {
  socket.emit("error", error);
  return socket;
}

export function closeSocket(socket, code, reason) {
  if (socket.readyState === 3) return socket;
  socket.readyState = 3;
  cancelTimers(socket);
  socket.closed = { code, reason };
  socket.emit("close", code, reason);
  return socket;
}
