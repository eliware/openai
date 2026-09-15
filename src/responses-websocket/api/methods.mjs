import { attachResponseMethods } from './attach-response-methods.mjs';
import { attachEventMethods } from './attach-event-methods.mjs';
import { attachHttpMethods } from './attach-http-methods.mjs';
import { attachLifecycleMethods } from './attach-lifecycle-methods.mjs';
import { attachSocketMethods } from './attach-socket-methods.mjs';

export function attachMethods(adapter) {
  attachResponseMethods(adapter);
  attachEventMethods(adapter);
  attachHttpMethods(adapter);
  attachLifecycleMethods(adapter);
  attachSocketMethods(adapter);
  return adapter;
}
