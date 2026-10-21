import { createListenerRegistry } from "./listener/registry.mjs";
import { createSocketOperations } from "./operations.mjs";
import { createListenerMethods } from "./listener/methods.mjs";

export class NodeSocketAdapter {
  constructor(socket) {
    this.socket = socket;
    this.listeners = createListenerRegistry(socket);
    this.operations = createSocketOperations(socket);
    this.listenerMethods = createListenerMethods(this);
  }
  get readyState() {
    return this.socket.readyState;
  }
  send(data) {
    this.operations.send(data);
  }
  close(code = 1000, reason) {
    this.operations.close(code, reason);
  }
  on(event, listener) {
    return this.listenerMethods.on(event, listener);
  }
  off(event, listener) {
    return this.listenerMethods.off(event, listener);
  }
  once(event, listener) {
    return this.listenerMethods.once(event, listener);
  }
  removeAllListeners(event) {
    return this.listenerMethods.removeAllListeners(event);
  }
  terminate() {
    return this.operations.terminate();
  }
  addEventListener(event, listener) {
    return this.listenerMethods.addEventListener(event, listener);
  }
  removeEventListener(event, listener) {
    return this.listenerMethods.removeEventListener(event, listener);
  }
}
