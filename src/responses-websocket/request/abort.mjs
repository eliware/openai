import { abortError } from '../../errors/abort.mjs';

export function createAbortController(adapter, events, signal) {
  let aborted = false;
  const abort = () => abortError(signal);
  const onAbort = () => {
    aborted = true;
    try { if (adapter.isOpen()) adapter.socket.send({ type: 'response.cancel' }); } finally { void events.return?.(); }
  };
  const next = () => {
    if (!signal) return events.next();
    if (signal.aborted) return Promise.reject(abort());
    let listener;
    const abortPromise = new Promise((_, reject) => { listener = () => reject(abort()); signal.addEventListener('abort', listener, { once: true }); });
    return Promise.race([events.next(), abortPromise]).finally(() => signal.removeEventListener('abort', listener));
  };
  return { abort, onAbort, next, wasAborted: () => aborted };
}
