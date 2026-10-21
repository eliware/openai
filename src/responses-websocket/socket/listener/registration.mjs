export function createListenerRegistrationMethods(adapter) {
  return {
    on(event, listener) {
      adapter.listeners.add(event, listener);
      return adapter;
    },
    off(event, listener) {
      adapter.listeners.remove(event, listener);
      return adapter;
    },
    removeAllListeners(event) {
      adapter.listeners.removeAll(event);
      return adapter;
    },
    addEventListener(event, listener) {
      adapter.listeners.add(event, listener);
      return adapter;
    },
    removeEventListener(event, listener) {
      adapter.listeners.remove(event, listener);
      return adapter;
    },
  };
}
