import { ResponsesError, abortError } from '../errors.mjs';
import { normalizeEvent } from '../events.mjs';
import { InjectableResponsesWS } from './socket.mjs';
export class ResponsesWebSocketAdapter {
  constructor(client, options = {}, httpResponses = client.responses) { this.socket = new InjectableResponsesWS(client, options); this.httpResponses = httpResponses; this.inputItems = httpResponses?.inputItems; this.inputTokens = httpResponses?.inputTokens; this._readyPromise = null; this._closed = false; this._activeStreams = new Set(); }
  create(input = {}, options = {}) { if (this._closed) return Promise.reject(new ResponsesError('Responses WebSocket is closed')); const { stream = false, ...response } = input; const iterator = this.events(response, options); if (stream) return iterator; return (async () => { let completed; for await (const event of iterator) if (event.type === 'response.completed') completed = event.response; return completed; })(); }
  createWithEvents(input = {}, handlers = {}) { return this.create(input, handlers); }
  events(response = {}, options = {}) { return this._request(response, options); }
  _handleEvent(event, handlers = {}) {
    handlers.onEvent?.(event, event.raw);
    if (event.type === 'response.created') handlers.onResponseCreated?.(event.response, event);
    if (event.type === 'response.in_progress') handlers.onResponseProgress?.(event.response, event);
    if (event.type === 'response.content_part.added') handlers.onContentPartAdded?.(event.part, event);
    if (event.type === 'response.content_part.done') handlers.onContentPartDone?.(event.part, event);
    if (event.type === 'response.output_text.delta') handlers.onTextDelta?.(event.delta, event);
    if (event.type === 'response.output_text.done') handlers.onTextDone?.(event.text, event);
    if (event.type === 'response.output_item.added') handlers.onItemAdded?.(event.item, event);
    if (event.type === 'response.output_item.done') handlers.onItemDone?.(event.item, event);
    if (event.type === 'response.completed') handlers.onResponseCompleted?.(event.response, event);
  }
  async *_request(response, { signal, onEvent, onTextDelta, onTextDone, onItemAdded, onItemDone, onResponseCreated, onResponseProgress, onContentPartAdded, onContentPartDone, onResponseCompleted, onCompleted, onError } = {}) {
    const abort = () => abortError(signal);
    if (signal?.aborted) { const error = abort(); onError?.(error, { type: 'abort' }); throw error; }
    const events = this.socket.stream();
    this._activeStreams.add(events);
    let aborted = false;
    const onAbort = () => { aborted = true; };
    const next = () => {
      if (!signal) return events.next();
      if (signal.aborted) return Promise.reject(abort());
      let listener;
      const abortPromise = new Promise((_, reject) => { listener = () => reject(abort()); signal.addEventListener('abort', listener, { once: true }); });
      return Promise.race([events.next(), abortPromise]).finally(() => signal.removeEventListener('abort', listener));
    };
    try {
      signal?.addEventListener('abort', onAbort, { once: true });
      this.socket.send({ type: 'response.create', ...response });
      while (true) {
        let result;
        try { result = await next(); } catch (error) {
          if (aborted || signal?.aborted) { onError?.(error, { type: 'abort' }); throw error; }
          throw error;
        }
        if (result.done) break;
        const event = result.value;
        if (event.type === 'message') {
          const message = normalizeEvent(event.message, event);
          this._handleEvent(message, { onEvent, onTextDelta, onTextDone, onItemAdded, onItemDone, onResponseCreated, onResponseProgress, onContentPartAdded, onContentPartDone, onResponseCompleted });
          yield message;
          if (message.type === 'response.completed') { onCompleted?.(message.response, message); return; }
          if (message.type === 'response.failed') { const error = new ResponsesError(message.error?.message ?? 'Response failed', { event: message }); onError?.(error, message); throw error; }
          if (message.type === 'response.incomplete') { const error = new ResponsesError(message.incomplete_details?.reason ?? 'Response incomplete', { event: message }); onError?.(error, message); throw error; }
        } else if (event.type === 'reconnecting' || event.type === 'reconnected' || event.type === 'connecting' || event.type === 'open') {
          continue;
        } else if (event.type === 'error') {
          const normalized = normalizeEvent(event, event); const error = new ResponsesError(event.error?.message ?? 'Responses WebSocket error', { event: normalized, cause: event.error }); onError?.(error, normalizeEvent(event, event)); throw error;
        } else if (event.type === 'close') {
          const error = new ResponsesError('Responses WebSocket closed before completion', { event: normalizeEvent(event, event) }); onError?.(error, normalizeEvent(event, event)); throw error;
        }
      }
      const error = new ResponsesError('Responses WebSocket ended before completion', { event: { type: 'end' } }); onError?.(error, normalizeEvent({ type: 'end' })); throw error;
    } finally { signal?.removeEventListener('abort', onAbort); this._activeStreams.delete(events); await events.return?.(); }
  }

  stream(input = {}, options = {}) { return this.create({ ...input, stream: true }, options); }
  retrieve(...args) { return this.httpResponses.retrieve(...args); } delete(...args) { return this.httpResponses.delete(...args); } cancel(...args) { return this.httpResponses.cancel(...args); } parse(...args) { return this.httpResponses.parse(...args); }
  async ready() {
    if (this.isOpen()) return;
    if (!this._readyPromise) {
      this._readyPromise = (async () => {
        const events = this.socket.stream();
        try {
          for await (const event of events) {
            if (event.type === 'open' || event.type === 'reconnected' || this.isOpen()) return;
            if (event.type === 'error') throw new ResponsesError(event.error?.message ?? 'Responses WebSocket error', { event, cause: event.error });
            if (event.type === 'close') throw new ResponsesError('Responses WebSocket closed before becoming ready', { event });
          }
          throw new ResponsesError('Responses WebSocket ended before becoming ready');
        } finally { await events.return?.(); }
      })().finally(() => { this._readyPromise = null; });
    }
    return this._readyPromise;
  }
  isOpen() { return this.socket.socket?.readyState === 1; }
  get state() { return ['connecting', 'open', 'closing', 'closed'][this.socket.socket?.readyState ?? 3]; }
  close(props = {}) {
    if (this._closed) return this._closePromise;
    this._closed = true;
    const { timeout = 30_000, ...socketProps } = props ?? {};
    this._closePromise = (async () => {
      await Promise.all([...this._activeStreams].map(stream => stream.return?.()));
      return new Promise((resolve, reject) => {
        const socket = this.socket.socket;
        let settled = false;
        let timer;
        const cleanup = () => { clearTimeout(timer); socket.removeListener?.('close', onClose); socket.removeListener?.('error', onError); };
        const done = error => { if (settled) return; settled = true; cleanup(); if (error) reject(error); else resolve(); };
        const onClose = () => done();
        const onError = error => done(error);
        const onTimeout = () => {
          try { socket.terminate?.(); } catch { /* best effort */ }
          done(new ResponsesError('Responses WebSocket close timed out', { event: { type: 'close', code: 'timeout' } }));
        };
        if (socket.once) { socket.once('close', onClose); socket.once('error', onError); }
        timer = setTimeout(onTimeout, timeout);
        timer.unref?.();
        try {
          this.socket.close(socketProps);
          if (socket.readyState === 3) done();
          else if (!socket.once) done();
        } catch (error) { done(error); }
      });
    })();
    return this._closePromise;
  }

  on(...args) { this.socket.on(...args); return this; } off(...args) { this.socket.off(...args); return this; }
}
