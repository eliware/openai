import { responseEvents, handleResponseEvent } from './lifecycle-api.mjs';

export function attachEventMethods(adapter) {
  adapter.events = (response = {}, options = {}) => responseEvents(adapter, response, options);
  adapter._request = (response = {}, options = {}) => responseEvents(adapter, response, options);
  adapter._handleEvent = (event, handlers = {}) => handleResponseEvent(event, handlers);
  return adapter;
}
