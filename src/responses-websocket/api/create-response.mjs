import { ResponsesError } from '../../errors/responses-error.mjs';
import { requestEvents } from '../request.mjs';

export function createResponse(adapter, input = {}, options = {}) {
  if (adapter._closed) return Promise.reject(new ResponsesError('Responses WebSocket is closed'));
  const { stream = false, ...response } = input;
  const iterator = requestEvents(adapter, response, options);
  if (stream) return iterator;
  return (async () => {
    let completed;
    for await (const event of iterator) if (event.type === 'response.completed') completed = event.response;
    return completed;
  })();
}
