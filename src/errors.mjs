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
    error: { ...(source.error && typeof source.error === 'object' ? source.error : {}), message: source.message ?? source.error?.message, code: source.code ?? source.error?.code, type: source.type ?? source.error?.type, status: source.status ?? source.status_code ?? source.error?.status, param: source.param ?? source.error?.param, request_id: source.requestID ?? source.request_id ?? source.error?.request_id },
    status: event.status ?? source.status ?? source.status_code ?? source.error?.status,
    code: event.code ?? source.code ?? source.error?.code,
    type: event.type ?? 'error',
    param: event.param ?? source.param ?? source.error?.param,
    request_id: source.requestID ?? source.request_id ?? event.request_id,
  };
  return new ResponsesError(source.message ?? event.message ?? 'Responses request failed', { event: normalized, cause: error });
}
export function abortError(signal) { if (signal?.reason instanceof Error) return signal.reason; if (typeof DOMException === 'function') return new DOMException('The operation was aborted', 'AbortError'); const error = new Error('The operation was aborted'); error.name = 'AbortError'; return error; }
export function responsesWebSocketError(event, fallback, cause) { const normalized = event?.type ? event : event?.error ? { ...event, type: 'error' } : { type: 'error', error: event }; const message = normalized.error?.message ?? fallback; return new ResponsesError(message, { event: normalized, cause: cause ?? normalized.error }); }
