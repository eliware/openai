export function emitSocketError(socket, error) {
  socket.emit("error", error);
  return socket;
}
