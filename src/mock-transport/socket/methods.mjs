import { closeSocket, emitSocketError } from "./lifecycle.mjs";
import { sendMessage, pushMessages } from "./messages.mjs";

export function createMockSocketMethods(defaults) {
  return {
    on(event, listener) {
      return this.listenerMethods.on(event, listener);
    },
    once(event, listener) {
      return this.listenerMethods.once(event, listener);
    },
    off(event, listener) {
      return this.listenerMethods.off(event, listener);
    },
    removeListener(event, listener) {
      return this.listenerMethods.removeListener(event, listener);
    },
    emit(event, ...args) {
      return this.listenerMethods.emit(event, ...args);
    },
    send(data) {
      return sendMessage(this, data, defaults);
    },
    push(...messages) {
      return pushMessages(this, messages);
    },
    error(error = new Error("mock socket error")) {
      return emitSocketError(this, error);
    },
    close(code = 1000, reason = "OK") {
      return closeSocket(this, code, reason);
    },
  };
}
