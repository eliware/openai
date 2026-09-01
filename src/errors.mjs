import { eventErrorDetails } from './events.mjs';

export class ResponsesError extends Error {
  constructor(message, { event, cause } = {}) {
    super(message, { cause }); this.name = 'ResponsesError'; this.event = event; this.cause = cause;
    Object.assign(this, eventErrorDetails(event));
  }
}
export function responsesErrorFrom(error, event = {}) {
  const source = error ?? {};
  const normalized = {
    ...event,
    error: { ...source.error, ...source },
    status: event.status,
    code: event.code,
    type: event.type ?? 'error',
    param: event.param,
    request_id: source.requestID ?? source.request_id ?? event.request_id,
  };
  return new ResponsesError(source.message ?? event.message ?? 'Responses request failed', { event: normalized, cause: error });
}
export function abortError(signal) { if (signal?.reason instanceof Error) return signal.reason; if (typeof DOMException === 'function') return new DOMException('The operation was aborted', 'AbortError'); const error = new Error('The operation was aborted'); error.name = 'AbortError'; return error; }
export function responsesWebSocketError(event, fallback, cause) { const normalized = event?.type ? event : { type: 'error', error: event }; const message = normalized.error?.message ?? fallback; return new ResponsesError(message, { event: normalized, cause: cause ?? normalized.error }); }
