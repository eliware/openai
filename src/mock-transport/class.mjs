import { createInstanceRegistry } from "./socket/instances.mjs";
import { composeMockSocketMethods, initializeMockSocket } from "./socket.mjs";

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
      initializeMockSocket(this, instanceRegistry, defaults, events, url, protocols);
    }
  };
  composeMockSocketMethods(MockResponsesWebSocket, defaults);
  return MockResponsesWebSocket;
}
