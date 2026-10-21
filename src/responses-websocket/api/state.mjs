import { getStateName } from "./state-name.mjs";

export function initializeState(adapter, httpResponses) {
  adapter.httpResponses = httpResponses;
  adapter.inputItems = httpResponses?.inputItems;
  adapter.inputTokens = httpResponses?.inputTokens;
  adapter._closePromise = null;
  adapter._closed = false;
  adapter._activeStreams = new Set();
  adapter._activeRequest = null;
}

export function isOpen(adapter) {
  return adapter.socket.socket?.readyState === 1;
}

export function state(adapter) {
  return getStateName(adapter);
}
