export function createListenerMethods(adapter) {
  return {
    on(event, listener) {
      adapter.listeners.add(event, listener);
      return adapter;
    },
    off(event, listener) {
      adapter.listeners.remove(event, listener);
      return adapter;
    },
    once(event, listener) {
      const once = (...args) => {
        adapter.listeners.remove(event, once);
        listener(...args);
      };
      adapter.listeners.add(event, once);
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
