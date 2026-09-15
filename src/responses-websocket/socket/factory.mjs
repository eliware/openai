import { WebSocket as NodeWebSocket } from 'ws';
import { NodeSocketAdapter } from './node-adapter.mjs';

export function createInjectedSocket(Impl, url, authHeaders) {
  if (typeof Impl !== 'function') throw new TypeError('WebSocketImpl must be a WebSocket constructor');
  return new NodeSocketAdapter(new Impl(url, { headers: authHeaders }));
}

export function defaultSocket(Impl, url, authHeaders) {
  return createInjectedSocket(Impl ?? NodeWebSocket, url, authHeaders);
}
