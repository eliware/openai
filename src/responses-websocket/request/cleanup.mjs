export function cleanupRequest(adapter, events, signal, onAbort) {
  signal?.removeEventListener('abort', onAbort);
  adapter._activeStreams.delete(events);
  void events.return?.();
  adapter._requestActive = false;
}
