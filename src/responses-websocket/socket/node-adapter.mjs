import { createListenerRegistry } from './listener-registry.mjs';
import { createSocketOperations } from './socket-operations.mjs';

export class NodeSocketAdapter {
  constructor(socket) { this.socket = socket; this.listeners = createListenerRegistry(socket); this.operations = createSocketOperations(socket); }
  get readyState() { return this.socket.readyState; }
  send(data) { this.operations.send(data); }
  close(code = 1000, reason) { this.operations.close(code, reason); }
  on(event, listener) { this.listeners.add(event, listener); return this; }
  off(event, listener) { this.listeners.remove(event, listener); return this; }
  once(event, listener) { const once = (...args) => { this.off(event, once); listener(...args); }; return this.on(event, once); }
  removeAllListeners(event) { this.listeners.removeAll(event); return this; }
  terminate() { return this.operations.terminate(); }
  addEventListener(event, listener) { return this.on(event, listener); }
  removeEventListener(event, listener) { return this.off(event, listener); }
}
