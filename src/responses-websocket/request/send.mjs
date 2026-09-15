import { ResponsesError } from '../../errors/responses-error.mjs';
import { normalizeEvent } from '../../events/normalize.mjs';

export function sendRequest(adapter, response, callbacks) {
  try { adapter.socket.send({ type: 'response.create', ...response }); }
  catch (error) { const responseError = new ResponsesError(error?.message ?? 'Responses WebSocket send failed', { event: { type: 'error' }, cause: error }); callbacks.onError?.(responseError, normalizeEvent(responseError.event)); throw responseError; }
}
