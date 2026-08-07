import { normalizeEvent } from './events.mjs';
import { responsesErrorFrom } from './errors.mjs';

const HANDLER_KEYS = ['signal', 'onEvent', 'onTextDelta', 'onItemAdded', 'onItemDone', 'onCompleted', 'onError'];

function splitOptions(options) {
  const handlers = {};
  const requestOptions = { ...options };
  for (const key of HANDLER_KEYS) {
    if (key in requestOptions) {
      handlers[key] = requestOptions[key];
      if (key !== 'signal') delete requestOptions[key];
    }
  }
  return { handlers, requestOptions };
}

function dispatch(event, handlers) {
  const normalized = normalizeEvent(event);
  handlers.onEvent?.(normalized);
  if (normalized?.type === 'response.output_text.delta') handlers.onTextDelta?.(normalized.delta, normalized);
  if (normalized?.type === 'response.output_item.added') handlers.onItemAdded?.(normalized.item, normalized);
  if (normalized?.type === 'response.output_item.done') handlers.onItemDone?.(normalized.item, normalized); if (normalized?.type === 'response.completed') handlers.onCompleted?.(normalized.response, normalized);
  return normalized;
}

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

async function* wrapHTTPStream(stream, handlers) {
  try {
    for await (const event of await stream) yield dispatch(event, handlers);
  } catch (error) {
    const responseError = responsesErrorFrom(error, { type: 'error' });
    handlers.onError?.(responseError, normalizeEvent(responseError.event));
    throw responseError;
  }
}
