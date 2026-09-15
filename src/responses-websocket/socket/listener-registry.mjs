import { wrapSocketListener } from './event-wrapper.mjs';

export function createListenerRegistry(socket) {
  const listeners = new Map();
  return {
    add(event, listener) {
      const wrapped = wrapSocketListener(event, listener);
      const eventListeners = listeners.get(event) ?? new Map();
      eventListeners.set(listener, wrapped);
      listeners.set(event, eventListeners);
      socket.on(event, wrapped);
    },
    remove(event, listener) {
      const wrapped = listeners.get(event)?.get(listener);
      if (wrapped) socket.removeListener(event, wrapped);
      listeners.get(event)?.delete(listener);
    },
    removeAll(event) {
      if (event === undefined) {
        for (const name of listeners.keys()) this.removeAll(name);
        return;
      }
      for (const wrapped of listeners.get(event)?.values() ?? []) socket.removeListener(event, wrapped);
      listeners.delete(event);
    },
  };
}
