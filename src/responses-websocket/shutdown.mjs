import { cancelStreams } from './shutdown/stream-cleanup.mjs';
import { closeSocket } from './shutdown/socket-close.mjs';

export function close(adapter, props = {}) {
  if (adapter._closed || adapter._closePromise) return adapter._closePromise;
  const { timeout = 30_000, ...socketProps } = props ?? {};
  adapter._closePromise = new Promise((resolve, reject) => {
    cancelStreams(adapter._activeStreams);
    closeSocket(adapter, adapter.socket.socket, socketProps, timeout, error => { if (error) reject(error); else { adapter._closed = true; resolve(); } });
  });
  adapter._closePromise.catch(() => { adapter._closePromise = null; });
  return adapter._closePromise;
}
