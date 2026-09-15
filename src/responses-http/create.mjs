import { wrapHTTPStream } from './stream.mjs';
import { splitRequest } from './request-options.mjs';
import { completeHTTP } from './completion.mjs';

export function createHTTPCreate(responses) {
  return (input = {}, options = {}) => {
    const { handlers, request, requestOptions, streaming } = splitRequest(input, options);
    const result = responses.create(request, requestOptions);
    return streaming ? wrapHTTPStream(result, handlers) : completeHTTP(result, handlers);
  };
}
