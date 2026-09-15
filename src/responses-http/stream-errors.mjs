import { normalizeEvent } from '../events/normalize.mjs';
import { responsesErrorFrom } from '../errors/http-normalize.mjs';

export function normalizeStreamError(error, handlers) {
  const responseError = responsesErrorFrom(error, { type: 'error' });
  handlers.onError?.(responseError, normalizeEvent(responseError.event));
  return responseError;
}
