export function createListenerStore() {
  const listeners = new Map();

  return {
    add(event, listener, wrapped) {
      const eventListeners = listeners.get(event) ?? new Map();
      const wrappers = eventListeners.get(listener) ?? [];
      wrappers.push(wrapped);
      eventListeners.set(listener, wrappers);
      listeners.set(event, eventListeners);
    },
    get(event, listener) {
      return listeners.get(event)?.get(listener)?.at(-1);
    },
    remove(event, listener) {
      const eventListeners = listeners.get(event);
      const wrappers = eventListeners?.get(listener);
      wrappers?.pop();
      if (wrappers?.length === 0) eventListeners.delete(listener);
      if (eventListeners?.size === 0) listeners.delete(event);
    },
    events() {
      return listeners.keys();
    },
    values(event) {
      return [...(listeners.get(event)?.values() ?? [])].flat();
    },
    clear(event) {
      listeners.delete(event);
    },
  };
}
