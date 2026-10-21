import { initializeSocket } from "./socket/state.mjs";
import { createInstanceRegistry } from "./socket/instances.mjs";
import { createMockSocketMethods } from "./socket/methods.mjs";
import { createMockSocketListenerMethods } from "./socket/listener-methods.mjs";

export function createMockSocketClass(events, options) {
  const defaults = { autoOpen: true, delay: 0, ...options };
  const instanceRegistry = createInstanceRegistry();
  const MockResponsesWebSocket = class {
    static OPEN = 1;
    static CONNECTING = 0;
    static CLOSING = 2;
    static CLOSED = 3;
    static instances = instanceRegistry.instances;
    constructor(url = "", protocols) {
      initializeSocket(this, defaults, events, url, protocols);
      instanceRegistry.register(this);
      this.listenerMethods = createMockSocketListenerMethods(this);
    }
  };
  Object.assign(MockResponsesWebSocket.prototype, createMockSocketMethods(defaults));
  return MockResponsesWebSocket;
}
