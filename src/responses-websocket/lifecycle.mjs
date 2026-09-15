import { waitForSocket } from './lifecycle/socket-ready.mjs';
import { waitForStream } from './lifecycle/stream-ready.mjs';

export function ready(adapter, signal) {
  if (adapter.isOpen()) return Promise.resolve();
  if (!adapter._readyPromise) adapter._readyPromise = (async () => {
    const socket = adapter.socket.socket;
    if (typeof socket?.on !== 'function') await waitForStream(adapter);
    else await waitForSocket(socket, signal);
  })().finally(() => { adapter._readyPromise = null; });
  return adapter._readyPromise;
}
