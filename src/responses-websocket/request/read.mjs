import { ResponsesError } from '../../errors/responses-error.mjs';
import { normalizeEvent } from '../../events/normalize.mjs';

export async function readRequestEvent(next, callbacks, wasAborted, signal) {
  try { return await next(); }
  catch (error) {
    if (wasAborted() || signal?.aborted) { callbacks.onError?.(error, { type: 'abort' }); throw error; }
    const responseError = error instanceof ResponsesError ? error : new ResponsesError(error?.message ?? 'Responses WebSocket request failed', { event: { type: 'error' }, cause: error });
    callbacks.onError?.(responseError, normalizeEvent(responseError.event)); throw responseError;
  }
}
