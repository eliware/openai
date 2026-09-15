import { createResponse } from './create-response.mjs';

export function createWithEvents(adapter, input = {}, handlers = {}) {
  if (input.stream) return (async () => { for await (const event of createResponse(adapter, input, handlers)) void event; })();
  return createResponse(adapter, input, handlers);
}
