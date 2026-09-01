import { normalizeEvent } from '../events.mjs';
import { responsesErrorFrom } from '../errors.mjs';
import { splitOptions } from './callbacks.mjs';
import { wrapHTTPStream } from './stream.mjs';

export function createHTTPResponsesAdapter(responses) {
  const adapter = Object.create(responses);
  adapter.create = (input = {}, options = {}) => {
    const { handlers, requestOptions } = splitOptions(options);
    const result = responses.create(input, requestOptions);
    if (!input.stream) {
      return Promise.resolve(result).then(response => {
        const event = normalizeEvent({ type: 'response.completed', response });
        handlers.onEvent?.(event);
        handlers.onCompleted?.(response, event);
        return response;
      }, error => {
        const responseError = responsesErrorFrom(error, { type: 'error' });
        handlers.onError?.(responseError, normalizeEvent(responseError.event));
        throw responseError;
      });
    }
    return wrapHTTPStream(result, handlers);
  };
  adapter.createWithEvents = (input = {}, handlers = {}) => {
    if (input.stream) {
      return (async () => { for await (const event of adapter.create(input, handlers)) void event; })();
    }
    return adapter.create(input, handlers);
  };
  adapter.events = (input = {}, options = {}) => adapter.create({ ...input, stream: true }, options);
  adapter.stream = (input = {}, options = {}) => {
    const { handlers, requestOptions } = splitOptions(options);
    return wrapHTTPStream(responses.stream(input, requestOptions), handlers);
  };
  return adapter;
}
