import { normalizeCallbackEvent } from './event-normalizer.mjs';
import { routeCallback } from './callback-router.mjs';

export function dispatch(event, handlers) {
  const normalized = normalizeCallbackEvent(event);
  handlers.onEvent?.(normalized, normalized.raw);
  return routeCallback(normalized, handlers);
}
