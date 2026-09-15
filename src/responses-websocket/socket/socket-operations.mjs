export function createSocketOperations(socket) {
  return {
    send(data) { socket.send(data); },
    close(code = 1000, reason) { socket.close(code, reason == null ? undefined : String(reason)); },
    terminate() { return socket.terminate?.(); },
  };
}
