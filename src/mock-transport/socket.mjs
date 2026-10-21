import { initializeSocket } from "./socket/state.mjs";
import { registerInstance } from "./socket/instances.mjs";
import { sendMessage, pushMessages } from "./socket/messages.mjs";
import { closeSocket } from "./socket/lifecycle.mjs";
import { createMockSocketListenerMethods } from "./socket/listener-methods.mjs";

export function createMockSocketClass(events, options) {
  const defaults = { autoOpen: true, delay: 0, ...options };
  return class MockResponsesWebSocket {
    static OPEN = 1;
    static CONNECTING = 0;
    static CLOSING = 2;
    static CLOSED = 3;
    static instances = [];
    constructor(url = "", protocols) {
      initializeSocket(this, defaults, events, url, protocols);
      registerInstance(MockResponsesWebSocket, this);
      this.listenerMethods = createMockSocketListenerMethods(this);
    }
    on(event, listener) {
      return this.listenerMethods.on(event, listener);
    }
    once(event, listener) {
      return this.listenerMethods.once(event, listener);
    }
    off(event, listener) {
      return this.listenerMethods.off(event, listener);
    }
    removeListener(event, listener) {
      return this.listenerMethods.removeListener(event, listener);
    }
    emit(event, ...args) {
      return this.listenerMethods.emit(event, ...args);
    }
    send(data) {
      return sendMessage(this, data, defaults);
    }
    push(...messages) {
      return pushMessages(this, messages);
    }
    error(error = new Error("mock socket error")) {
      this.emit("error", error);
      return this;
    }
    close(code = 1000, reason = "OK") {
      return closeSocket(this, code, reason);
    }
  };
}
