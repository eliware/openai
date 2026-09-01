import { ResponsesWS } from '../transports/responses-websocket.mjs';
import { WebSocket as NodeWebSocket } from 'ws';

const pendingURLs = new WeakMap();

function prepareClient(client, url) {
  if (!url) return { client, baseURL: undefined };
  pendingURLs.set(client, url);
  return { client, baseURL: undefined };
}

export class NodeSocketAdapter {
  constructor(socket) { this.socket = socket; this.listeners = new Map(); }
  get readyState() { return this.socket.readyState; }
  send(data) { this.socket.send(data); }
  close(code = 1000, reason) { this.socket.close(code, reason == null ? undefined : String(reason)); }
  on(event, listener) { const wrapped = event === 'message' ? (data, binary) => listener(typeof data === 'string' ? data : data.toString(), binary) : event === 'close' ? (code, reason) => listener(code, reason?.toString?.() ?? reason) : listener; const listeners = this.listeners.get(event) ?? new Map(); listeners.set(listener, wrapped); this.listeners.set(event, listeners); this.socket.on(event, wrapped); return this; }
  off(event, listener) { const wrapped = this.listeners.get(event)?.get(listener); if (wrapped) this.socket.removeListener(event, wrapped); this.listeners.get(event)?.delete(listener); return this; }
  once(event, listener) { const once = (...args) => { this.off(event, once); listener(...args); }; this.on(event, once); return this; }
  removeAllListeners(event) { if (event === undefined) for (const name of this.listeners.keys()) this.removeAllListeners(name); else { for (const wrapped of this.listeners.get(event)?.values() ?? []) this.socket.removeListener(event, wrapped); this.listeners.delete(event); } return this; }
  terminate() { return this.socket.terminate?.(); }
  addEventListener(event, listener) { return this.on(event, listener); }
  removeEventListener(event, listener) { return this.off(event, listener); }
}

export class InjectableResponsesWS extends ResponsesWS {
  constructor(client, options) { const prepared = prepareClient(client, options.url); super(prepared.client, options); pendingURLs.delete(client); this._customWebSocket = options.WebSocketImpl; this._customURL = options.url; }
  _createSocket(url, authHeaders) { const customURL = this._customURL ?? pendingURLs.get(this._client); if (!this._customWebSocket && !customURL) return super._createSocket(url, authHeaders); const Impl = this._customWebSocket ?? NodeWebSocket; if (typeof Impl !== 'function') throw new TypeError('WebSocketImpl must be a WebSocket constructor'); return new NodeSocketAdapter(new Impl(customURL ?? url, { headers: authHeaders })); }
}
