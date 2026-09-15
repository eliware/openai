import { ResponsesError } from '../../errors/responses-error.mjs';
import { normalizeEvent } from '../../events/normalize.mjs';

export async function ensureReady(adapter, signal, callbacks) {
  try {
    await adapter.ready(signal);
  } catch (error) {
    const responseError = error instanceof ResponsesError
      ? error
      : new ResponsesError(error?.message ?? 'Responses WebSocket request failed', {
        event: { type: 'error' },
        cause: error,
      });
    callbacks.onError?.(responseError, normalizeEvent(responseError.event));
    throw responseError;
  }
}
