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
    const streaming = requestInput.stream ?? requestOptions.stream;
    delete requestInput.stream;
    delete requestOptions.stream;
    const request = { ...requestInput };
    if (streaming !== undefined) request.stream = streaming;
    const result = responses.create(request, requestOptions);
    if (!streaming) {
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
    const { handlers: inputHandlers, requestOptions: requestInput } = splitOptions(input);
    const { handlers: optionHandlers, requestOptions } = splitOptions(options);
    return wrapHTTPStream(responses.stream(requestInput, requestOptions), { ...inputHandlers, ...optionHandlers });
  };
  return adapter;
}
