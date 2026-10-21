import { addListener, emit, removeListener } from "../listeners.mjs";

export function createMockSocketListenerRegistrationMethods(socket) {
  return {
    on(event, listener) {
      addListener(socket, event, listener);
      return socket;
    },
    off(event, listener) {
      return this.removeListener(event, listener);
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
}
