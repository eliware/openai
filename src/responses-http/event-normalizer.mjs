import { normalizeEvent } from '../events/normalize.mjs';

export function normalizeCallbackEvent(event) {
  return normalizeEvent(event, event.raw ?? event);
}
