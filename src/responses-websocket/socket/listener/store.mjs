export function createListenerStore() {
  const listeners = new Map();

  return {
    add(event, listener, wrapped) {
      const eventListeners = listeners.get(event) ?? new Map();
      eventListeners.set(listener, wrapped);
      listeners.set(event, eventListeners);
    },
    get(event, listener) {
      return listeners.get(event)?.get(listener);
    },
    remove(event, listener) {
      listeners.get(event)?.delete(listener);
    },
    events() {
      return listeners.keys();
    },
    values(event) {
      return listeners.get(event)?.values() ?? [];
    },
    clear(event) {
      listeners.delete(event);
    },
  };
}
