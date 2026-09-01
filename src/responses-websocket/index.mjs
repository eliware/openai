import { ResponsesError, abortError, responsesWebSocketError } from '../errors.mjs';
import { normalizeEvent } from '../events.mjs';
import { InjectableResponsesWS } from './socket.mjs';
import { dispatch, splitOptions } from '../responses-http/callbacks.mjs';
export class ResponsesWebSocketAdapter {
  constructor(client, options = {}, httpResponses = client.responses) { this.socket = new InjectableResponsesWS(client, options); this.httpResponses = httpResponses; this.inputItems = httpResponses?.inputItems; this.inputTokens = httpResponses?.inputTokens; this._readyPromise = null; this._closed = false; this._activeStreams = new Set(); this._requestActive = false; }
  create(input = {}, options = {}) { if (this._closed) return Promise.reject(new ResponsesError('Responses WebSocket is closed')); const { stream = false, ...response } = input; const iterator = this.events(response, options); if (stream) return iterator; return (async () => { let completed; for await (const event of iterator) if (event.type === 'response.completed') completed = event.response; return completed; })(); }
  // Intentional API behavior: createWithEvents consumes a stream while invoking
  // callbacks, matching the HTTP facade and returning completion only.
  createWithEvents(input = {}, handlers = {}) { if (input.stream) return (async () => { for await (const event of this.create(input, handlers)) void event; })(); return this.create(input, handlers); }
  events(response = {}, options = {}) { return this._request(response, options); }
  _handleEvent(event, handlers = {}) { return dispatch(event, handlers); }
  async *_request(response, options = {}) {
    const { handlers, requestOptions } = splitOptions(options);
    const { signal, onEvent, onTextDelta, onTextDone, onItemAdded, onItemDone, onResponseCreated, onResponseProgress, onContentPartAdded, onContentPartDone, onResponseCompleted, onCompleted, onError } = { ...requestOptions, ...handlers };
    const abort = () => abortError(signal);
    if (signal?.aborted) { const error = abort(); onError?.(error, { type: 'abort' }); throw error; }
    // Intentional 2.0 contract: one response stream per adapter avoids
    // misrouting events because the upstream protocol has no request ID.
    if (this._requestActive) throw new ResponsesError('Concurrent Responses WebSocket requests are not supported');
    this._requestActive = true;
    const events = this.socket.stream();
    this._activeStreams.add(events);
    let aborted = false;
    // Promise.race settles the consumer immediately; return() then gives the
    // upstream iterator its best-effort cancellation hook.
    const onAbort = () => { aborted = true; try { if (this.isOpen()) this.socket.send({ type: 'response.cancel' }); } finally { void events.return?.(); } };
    const next = () => {
      if (!signal) return events.next();
      if (signal.aborted) return Promise.reject(abort());
      let listener;
      const abortPromise = new Promise((_, reject) => { listener = () => reject(abort()); signal.addEventListener('abort', listener, { once: true }); });
      return Promise.race([events.next(), abortPromise]).finally(() => signal.removeEventListener('abort', listener));
    };
    try {
      signal?.addEventListener('abort', onAbort, { once: true });
      try { await this.ready(); } catch (error) {
        const responseError = error instanceof ResponsesError ? error : new ResponsesError(error?.message ?? 'Responses WebSocket request failed', { event: { type: 'error' }, cause: error });
        onError?.(responseError, normalizeEvent(responseError.event));
        throw responseError;
      }
      this.socket.send({ type: 'response.create', ...response });
      while (true) {
        let result;
        try { result = await next(); } catch (error) {
          if (aborted || signal?.aborted) { onError?.(error, { type: 'abort' }); throw error; }
          const responseError = error instanceof ResponsesError ? error : new ResponsesError(error?.message ?? 'Responses WebSocket request failed', { event: { type: 'error' }, cause: error });
          onError?.(responseError, normalizeEvent(responseError.event));
          throw responseError;
        }
        if (result.done) break;
        const event = result.value;
        if (event.type === 'message') {
          const message = normalizeEvent(event.message, event);
          this._handleEvent(message, { onEvent, onTextDelta, onTextDone, onItemAdded, onItemDone, onResponseCreated, onResponseProgress, onContentPartAdded, onContentPartDone, onResponseCompleted, onCompleted });
          if (message.type === 'response.completed') { yield message; return; }
          if (message.type === 'response.failed') { const error = new ResponsesError(message.error?.message ?? 'Response failed', { event: message }); onError?.(error, message); throw error; }
          if (message.type === 'response.incomplete') { const error = new ResponsesError(message.incomplete_details?.reason ?? 'Response incomplete', { event: message }); onError?.(error, message); throw error; }
          yield message;
        } else if (event.type === 'connecting' || event.type === 'open') {
          onEvent?.(event, event.raw);
          continue;
        } else if (event.type === 'reconnecting' || event.type === 'reconnected') {
          const error = responsesWebSocketError(normalizeEvent(event, event), 'Responses WebSocket reconnect interrupted the request'); onError?.(error, error.event); throw error;
        } else if (event.type === 'error') {
          const normalized = normalizeEvent(event, event); const error = responsesWebSocketError(normalized, 'Responses WebSocket error'); onError?.(error, normalized); throw error;
        } else if (event.type === 'close') {
          const error = responsesWebSocketError(normalizeEvent(event, event), 'Responses WebSocket closed before completion'); onError?.(error, error.event); throw error;
        }
      }
      const error = new ResponsesError('Responses WebSocket ended before completion', { event: { type: 'end' } }); onError?.(error, normalizeEvent({ type: 'end' })); throw error;
    } finally { signal?.removeEventListener('abort', onAbort); this._activeStreams.delete(events); await events.return?.(); this._requestActive = false; }
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
            if (event.type === 'open' || this.isOpen()) return;
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
  get state() {
    if (this._closePromise && !this._closed) return 'closing';
    return ['connecting', 'open', 'closing', 'closed'][this.socket.socket?.readyState ?? 3];
  }
  close(props = {}) {
    if (this._closed || this._closePromise) return this._closePromise;
    const { timeout = 30_000, ...socketProps } = props ?? {};
    this._closePromise = (async () => {
      const cleanup = Promise.all([...this._activeStreams].map(stream => stream.return?.()));
      let timer;
      await Promise.race([cleanup, new Promise((_, reject) => { timer = setTimeout(() => reject(new ResponsesError('Responses WebSocket stream cleanup timed out', { event: { type: 'close', code: 'timeout' } })), timeout); })]);
      clearTimeout(timer);
      return new Promise((resolve, reject) => {
        const socket = this.socket.socket;
        if (!socket) { this._closed = true; resolve(); return; }
        let settled = false;
        let timer;
        const cleanup = () => { clearTimeout(timer); socket.removeListener?.('close', onClose); socket.removeListener?.('error', onError); };
        const done = error => { if (settled) return; settled = true; cleanup(); if (error) reject(error); else { this._closed = true; resolve(); } };
        const onClose = () => done();
        const onError = error => done(error);
        const onTimeout = () => {
          // The timeout is the bounded guarantee even when terminate is absent.
          try { socket.terminate?.(); } catch { /* best effort */ }
          done(new ResponsesError('Responses WebSocket close timed out', { event: { type: 'close', code: 'timeout' } }));
        };
        if (socket.once) { socket.once('close', onClose); socket.once('error', onError); }
        timer = setTimeout(onTimeout, timeout);
        try {
          if (typeof this.socket.close !== 'function') { done(); return; }
          this.socket.close(socketProps);
          if (socket.readyState === 3) { this._closed = true; done(); }
          else if (!socket.once) done();
        } catch (error) { done(error); }
      });
    })();
    this._closePromise.catch(() => { this._closePromise = null; });
    return this._closePromise;
  }

  on(...args) { this.socket.on(...args); return this; } off(...args) { this.socket.off(...args); return this; }
}
