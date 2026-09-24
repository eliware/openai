export function cleanupRequest(adapter, events, signal, onAbort) {
  signal?.removeEventListener("abort", onAbort);
  adapter._activeStreams.delete(events);
  void events.return?.();
  if (adapter._activeRequest) adapter._activeRequest = null;
  else adapter._requestActive = false;
}
