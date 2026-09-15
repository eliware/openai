import { abortError } from '../errors/abort.mjs';
import { openRequest } from './request/session.mjs';
import { cleanupRequest } from './request/cleanup.mjs';
import { sendRequest } from './request/send.mjs';
import { ensureReady } from './request/ready.mjs';
import { readResponseEvents } from './request/loop.mjs';

export async function* requestEvents(adapter, response, options = {}) {
  const { signal, callbacks, events, controller, onAbort, next } = openRequest(adapter, response, options);
  const abort = () => abortError(signal);
  try {
    await ensureReady(adapter, signal, callbacks);
    if (signal?.aborted) { const error = abort(); callbacks.onError?.(error, { type: 'abort' }); throw error; }
    sendRequest(adapter, response, callbacks);
    yield* readResponseEvents(next, callbacks, controller, signal);
  } finally { cleanupRequest(adapter, events, signal, onAbort); }
}
