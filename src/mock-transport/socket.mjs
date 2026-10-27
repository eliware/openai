import { initializeSocket } from "./socket/state.mjs";
import { createMockSocketMethods } from "./socket/methods.mjs";
import { createMockSocketListenerMethods } from "./socket/listener-methods.mjs";

export function initializeMockSocket(socket, instanceRegistry, defaults, events, url, protocols) {
  initializeSocket(socket, defaults, events, url, protocols);
  instanceRegistry.register(socket);
  socket.listenerMethods = createMockSocketListenerMethods(socket);
}

export function composeMockSocketMethods(MockSocket, defaults) {
  Object.assign(MockSocket.prototype, createMockSocketMethods(defaults));
}
