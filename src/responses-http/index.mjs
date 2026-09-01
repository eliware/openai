import { normalizeEvent } from '../events.mjs';
import { responsesErrorFrom } from '../errors.mjs';
import { dispatch, splitOptions } from './callbacks.mjs';
import { wrapHTTPStream } from './stream.mjs';

export function createHTTPResponsesAdapter(responses) {
  const adapter = Object.create(responses);
  adapter.create = (input = {}, options = {}) => {
    const { handlers: inputHandlers, requestOptions: requestInput } = splitOptions(input);
    const { handlers: optionHandlers, requestOptions } = splitOptions(options);
    const handlers = { ...inputHandlers, ...optionHandlers };
    const result = responses.create(requestInput, requestOptions);
    if (!requestInput.stream) {
      return Promise.resolve(result).then(response => {
        const event = normalizeEvent({ type: 'response.completed', response });
        dispatch(event, handlers);
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
