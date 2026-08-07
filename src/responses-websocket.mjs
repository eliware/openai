import { ResponsesWS } from 'openai/resources/responses/ws';
import { ResponsesError, abortError } from './errors.mjs';
import { normalizeEvent } from './events.mjs';

class NodeSocketAdapter {
  constructor(socket) { this.socket = socket; this.listeners = new Map(); }
  get readyState() { return this.socket.readyState; }
  send(data) { this.socket.send(data); }
  close(code, reason) { this.socket.close(code, reason); }
  on(event, listener) { const wrapped = event === 'message' ? (data, binary) => listener(typeof data === 'string' ? data : data.toString(), binary) : event === 'close' ? (code, reason) => listener(code, reason?.toString?.() ?? reason) : listener; this.listeners.set(listener, wrapped); this.socket.on(event, wrapped); }
  off(event, listener) { const wrapped = this.listeners.get(listener); if (wrapped) this.socket.removeListener(event, wrapped); this.listeners.delete(listener); }
  once(event, listener) { const once = (...args) => { this.off(event, once); listener(...args); }; this.on(event, once); }
}
class InjectableResponsesWS extends ResponsesWS {
  constructor(client, options) { super(client, options); this._customWebSocket = options.WebSocketImpl; this._customURL = options.url; }
  _createSocket(url, authHeaders) { if (!this._customWebSocket && !this._customURL) return super._createSocket(url, authHeaders); const Impl = this._customWebSocket; if (typeof Impl !== 'function') throw new TypeError('WebSocketImpl must be a WebSocket constructor'); return new NodeSocketAdapter(new Impl(this._customURL ?? url, { headers: authHeaders })); }
}
export class ResponsesWebSocketAdapter {
  constructor(client, options = {}, httpResponses = client.responses) { this.socket = new InjectableResponsesWS(client, options); this.httpResponses = httpResponses; this.inputItems = httpResponses?.inputItems; this.inputTokens = httpResponses?.inputTokens; }
  create(input = {}, options = {}) { const { stream = false, ...response } = input; const iterator = this.events(response, options); if (stream) return iterator; return (async () => { let completed; for await (const event of iterator) if (event.type === 'response.completed') completed = event.response; return completed; })(); }
  createWithEvents(input = {}, handlers = {}) { return this.create(input, handlers); }
  events(response = {}, options = {}) { return this._request(response, options); }
  _handleEvent(event, handlers = {}) { handlers.onEvent?.(event); if (event.type === 'response.output_text.delta') handlers.onTextDelta?.(event.delta, event); if (event.type === 'response.output_item.added') handlers.onItemAdded?.(event.item, event); if (event.type === 'response.output_item.done') handlers.onItemDone?.(event.item, event); }
  async *_request(response, { signal, onEvent, onTextDelta, onItemAdded, onItemDone, onCompleted, onError }) {
    if (signal?.aborted) { const error = abortError(signal); onError?.(error, { type: 'abort' }); throw error; } const events = this.socket.stream(); let onAbort;
    try { onAbort = () => { events.return?.(); }; signal?.addEventListener('abort', onAbort, { once: true }); this.socket.send({ type: 'response.create', ...response });
      for await (const event of events) { if (signal?.aborted) throw abortError(signal); if (event.type === 'message') { const message = normalizeEvent(event.message, event); this._handleEvent(message, { onEvent, onTextDelta, onItemAdded, onItemDone }); yield message;
          if (message?.type === 'response.completed') { onCompleted?.(message.response, message); return; }
          if (message?.type === 'response.failed') { const error = new ResponsesError(message.error?.message ?? 'Response failed', { event: message }); onError?.(error, message); throw error; }
          if (message?.type === 'response.incomplete') { const error = new ResponsesError(message.incomplete_details?.reason ?? 'Response incomplete', { event: message }); onError?.(error, message); throw error; }
        } else if (event.type === 'error') { const error = new ResponsesError(event.error?.message ?? 'Responses WebSocket error', { event, cause: event.error }); onError?.(error, event); throw error;
        } else if (event.type === 'close') { const error = new ResponsesError('Responses WebSocket closed before completion', { event }); onError?.(error, event); throw error; } }
      const error = new ResponsesError('Responses WebSocket ended before completion'); onError?.(error); throw error;
    } finally { signal?.removeEventListener('abort', onAbort); }
  }
  stream(input = {}, options = {}) { return this.create({ ...input, stream: true }, options); }
  retrieve(...args) { return this.httpResponses.retrieve(...args); } delete(...args) { return this.httpResponses.delete(...args); } cancel(...args) { return this.httpResponses.cancel(...args); } parse(...args) { return this.httpResponses.parse(...args); }
  async ready() { if (this.isOpen()) return; for await (const event of this.socket.stream()) { if (event.type === 'open') return; if (event.type === 'error') throw event.error; if (event.type === 'close') throw new ResponsesError('Responses WebSocket closed before becoming ready', { event }); } throw new ResponsesError('Responses WebSocket ended before becoming ready'); }
  isOpen() { return this.socket.socket?.readyState === 1; }
  get state() { return ['connecting', 'open', 'closing', 'closed'][this.socket.socket?.readyState ?? 3]; }
  close(props) {
    if (this.socket.socket?.readyState === 3) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const socket = this.socket.socket;
      if (!socket?.once) { try { this.socket.close(props); resolve(); } catch (error) { reject(error); } return; }
      const onClose = () => { socket.removeListener?.('close', onClose); resolve(); };
      const onError = error => { socket.removeListener?.('close', onClose); reject(error); };
      socket.once('close', onClose); socket.once('error', onError);
      try { this.socket.close(props); } catch (error) { reject(error); }
    });
  }
  on(...args) { this.socket.on(...args); return this; } off(...args) { this.socket.off(...args); return this; }
}
