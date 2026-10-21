import { addListener, removeListener, emit } from "../listeners.mjs";

export function createMockSocketListenerMethods(socket) {
  const methods = {
    on(event, listener) {
      addListener(socket, event, listener);
      return socket;
    },
    once(event, listener) {
      const once = (...args) => {
        methods.removeListener(event, once);
        listener(...args);
      };
      return methods.on(event, once);
    },
    off(event, listener) {
      return methods.removeListener(event, listener);
    },
    removeListener(event, listener) {
      removeListener(socket, event, listener);
      return socket;
    },
    emit(event, ...args) {
      emit(socket, event, ...args);
      return socket;
    },
  };
  return methods;
}
