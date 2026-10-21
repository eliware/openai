import { createSocketListenerBinding } from "./binding.mjs";
import { removeAllListeners } from "./removal.mjs";

export function createListenerRegistry(socket) {
  const listeners = new Map();
  const binding = createSocketListenerBinding(socket);
  return {
    add(event, listener) {
      const eventListeners = listeners.get(event) ?? new Map();
      const wrapped = binding.add(event, listener);
      eventListeners.set(listener, wrapped);
      listeners.set(event, eventListeners);
    },
    remove(event, listener) {
      const wrapped = listeners.get(event)?.get(listener);
      if (wrapped) binding.remove(event, wrapped);
      listeners.get(event)?.delete(listener);
    },
    removeAll(event) {
      removeAllListeners(listeners, binding, event);
    },
  };
}
