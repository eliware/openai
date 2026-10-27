import { adaptSocketListener } from "./adapt.mjs";
import { removeAllListeners } from "./removal.mjs";

export function createSocketListenerBinding(socket, store) {
  const socketBinding = {
    remove(event, listener) {
      socket.removeListener(event, listener);
    },
  };
  return {
    add(event, listener) {
      const adapted = adaptSocketListener(event, listener);
      socket.on(event, adapted);
      store.add(event, listener, adapted);
    },
    remove(event, listener) {
      const adapted = store.get(event, listener);
      if (adapted) {
        socketBinding.remove(event, adapted);
        store.remove(event, listener);
      }
    },
    removeAll(event) {
      removeAllListeners(store, socketBinding, event);
    },
  };
}
