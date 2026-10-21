import { createSocketOperations } from "./operations.mjs";
import { createListenerRegistry } from "./listener/registry.mjs";
import { createListenerMethods } from "./listener/methods.mjs";

function createNodeSocketListenerAdapter(adapter) {
  adapter.listeners = createListenerRegistry(adapter.socket);
  return createListenerMethods(adapter);
}

export class NodeSocketAdapter {
  constructor(socket) {
    this.socket = socket;
    this.operations = createSocketOperations(socket);
    Object.assign(this, this.operations, createNodeSocketListenerAdapter(this));
  }
  get readyState() {
    return this.socket.readyState;
  }
}
