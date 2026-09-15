import { createResponse } from './create-response.mjs';
import { createWithEvents } from './event-response.mjs';
import { streamResponse } from './stream-response.mjs';

export function attachResponseMethods(adapter) {
  adapter.create = (input = {}, options = {}) => createResponse(adapter, input, options);
  adapter.createWithEvents = (input = {}, handlers = {}) => createWithEvents(adapter, input, handlers);
  adapter.stream = (input = {}, options = {}) => streamResponse(adapter, input, options);
  return adapter;
}
