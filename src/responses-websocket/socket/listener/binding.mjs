export function createSocketListenerBinding(socket) {
  return {
    add(event, listener) {
      socket.on(event, listener);
    },
    remove(event, listener) {
      socket.removeListener(event, listener);
    },
  };
}
