import { ResponsesWS } from 'openai/resources/responses/ws';
import { WebSocket as NodeWebSocket } from 'ws';

export class NodeSocketAdapter {
  constructor(socket) { this.socket = socket; this.listeners = new Map(); }
  get readyState() { return this.socket.readyState; }
  send(data) { this.socket.send(data); }
  close(code, reason) { this.socket.close(code, reason); }
  on(event, listener) { const wrapped = event === 'message' ? (data, binary) => listener(typeof data === 'string' ? data : data.toString(), binary) : event === 'close' ? (code, reason) => listener(code, reason?.toString?.() ?? reason) : listener; this.listeners.set(listener, wrapped); this.socket.on(event, wrapped); }
  off(event, listener) { const wrapped = this.listeners.get(listener); if (wrapped) this.socket.removeListener(event, wrapped); this.listeners.delete(listener); }
  once(event, listener) { const once = (...args) => { this.off(event, once); listener(...args); }; this.on(event, once); }
}

export class InjectableResponsesWS extends ResponsesWS {
  constructor(client, options) { super(client, options); this._customWebSocket = options.WebSocketImpl; this._customURL = options.url; }
  _createSocket(url, authHeaders) { if (!this._customWebSocket && !this._customURL) return super._createSocket(url, authHeaders); const Impl = this._customWebSocket ?? NodeWebSocket; if (typeof Impl !== 'function') throw new TypeError('WebSocketImpl must be a WebSocket constructor'); return new NodeSocketAdapter(new Impl(this._customURL ?? url, { headers: authHeaders })); }
}
