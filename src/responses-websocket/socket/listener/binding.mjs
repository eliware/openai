import { adaptSocketListener } from "./adapt.mjs";

export function createSocketListenerBinding(socket) {
  return {
    add(event, listener) {
      const adapted = adaptSocketListener(event, listener);
      socket.on(event, adapted);
      return adapted;
    },
    remove(event, listener) {
      socket.removeListener(event, listener);
    },
  };
}
