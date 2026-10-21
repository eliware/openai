import { createSocketListenerBinding } from "./binding.mjs";
import { removeAllListeners } from "./removal.mjs";
import { createListenerStore } from "./store.mjs";

export function createListenerRegistry(socket) {
  const store = createListenerStore();
  const binding = createSocketListenerBinding(socket);
  return {
    add(event, listener) {
      const wrapped = binding.add(event, listener);
      store.add(event, listener, wrapped);
    },
    remove(event, listener) {
      const wrapped = store.get(event, listener);
      if (wrapped) binding.remove(event, wrapped);
      store.remove(event, listener);
    },
    removeAll(event) {
      removeAllListeners(store, binding, event);
    },
  };
}
