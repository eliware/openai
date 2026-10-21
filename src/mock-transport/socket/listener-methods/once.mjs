export function createMockSocketOnceMethod(methods) {
  return function once(event, listener) {
    const once = (...args) => {
      methods.removeListener(event, once);
      listener(...args);
    };
    return methods.on(event, once);
  };
}
