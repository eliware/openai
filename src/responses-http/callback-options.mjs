import { validateCallbacks } from './validate-callbacks.mjs';
import { validateSignal } from './validate-signal.mjs';

export const HANDLER_KEYS = ['signal', 'onEvent', 'onTextDelta', 'onTextDone', 'onItemAdded', 'onItemDone', 'onResponseCreated', 'onResponseProgress', 'onContentPartAdded', 'onContentPartDone', 'onResponseCompleted', 'onCompleted', 'onError'];

export function splitOptions(options) {
  const handlers = {};
  const requestOptions = options == null ? {} : { ...options };
  const signal = requestOptions.signal;
  validateSignal(signal);
  validateCallbacks(requestOptions, HANDLER_KEYS);
  for (const key of HANDLER_KEYS) {
    if (key in requestOptions) {
      handlers[key] = requestOptions[key];
      if (key !== 'signal') delete requestOptions[key];
    }
  }
  return { handlers, requestOptions };
}
