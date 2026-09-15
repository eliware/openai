export function initializeState(adapter, httpResponses) {
  adapter.httpResponses = httpResponses;
  adapter.inputItems = httpResponses?.inputItems;
  adapter.inputTokens = httpResponses?.inputTokens;
  adapter._readyPromise = null;
  adapter._closePromise = null;
  adapter._closed = false;
  adapter._activeStreams = new Set();
  adapter._requestActive = false;
}

export function isOpen(adapter) { return adapter.socket.socket?.readyState === 1; }

export function state(adapter) {
  if (adapter._closePromise && !adapter._closed) return 'closing';
  return ['connecting', 'open', 'closing', 'closed'][adapter.socket.socket?.readyState ?? 3];
}
