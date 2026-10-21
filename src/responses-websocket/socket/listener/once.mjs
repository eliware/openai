export function createListenerOnceMethod(adapter) {
  return function once(event, listener) {
    const once = (...args) => {
      adapter.listeners.remove(event, once);
      listener(...args);
    };
    adapter.listeners.add(event, once);
    return adapter;
  };
}
