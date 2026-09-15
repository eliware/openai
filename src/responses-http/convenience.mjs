import { wrapHTTPStream } from './stream.mjs';
import { splitRequest } from './request-options.mjs';

export function createHTTPConvenience(adapter, responses) {
  return {
    createWithEvents(input = {}, handlers = {}) {
      if (input.stream) {
        return (async () => { for await (const event of adapter.create(input, handlers)) void event; })();
      }
      return adapter.create(input, handlers);
    },
    events(input = {}, options = {}) {
      return adapter.create({ ...input, stream: true }, options);
    },
    stream(input = {}, options = {}) {
      const { handlers, request, requestOptions } = splitRequest(input, options);
      return wrapHTTPStream(responses.stream(request, requestOptions), handlers);
    },
  };
}
