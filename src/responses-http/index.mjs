import { createHTTPCreate } from './create.mjs';
import { createHTTPConvenience } from './convenience.mjs';

export function createHTTPResponsesAdapter(responses) {
  const adapter = Object.create(responses);
  adapter._responses = responses;
  adapter.create = createHTTPCreate(responses);
  Object.assign(adapter, createHTTPConvenience(adapter, responses));
  return adapter;
}
