import { normalizeEvent } from '../events/normalize.mjs';
import { responsesErrorFrom } from '../errors/http-normalize.mjs';
import { dispatch } from './callback-dispatch.mjs';

export function completeHTTP(result, handlers) {
  return Promise.resolve(result).then(response => {
    const event = normalizeEvent({ type: 'response.completed', response, response_id: response?.id, request_id: response?.request_id });
    dispatch(event, handlers);
    return response;
  }, error => {
    const responseError = responsesErrorFrom(error, { type: 'error' });
    handlers.onError?.(responseError, normalizeEvent(responseError.event));
    throw responseError;
  });
}
