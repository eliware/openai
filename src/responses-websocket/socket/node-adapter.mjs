import { createSocketOperations } from "./operations.mjs";
import { createNodeSocketListenerAdapter } from "./listener-adapter.mjs";

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
