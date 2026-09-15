import { ResponsesError } from './responses-error.mjs';

export function responsesWebSocketError(event, fallback, cause) {
  const normalized = event?.type ? event : event?.error ? { ...event, type: 'error' } : { type: 'error', error: event };
  const message = normalized.error?.message ?? fallback;
  return new ResponsesError(message, { event: normalized, cause: cause ?? normalized.error });
}
