import { validateCallbacks } from "../validate/callbacks.mjs";
import { validateSignal } from "../validate/signal.mjs";
import { HANDLER_KEYS } from "./keys.mjs";

export function splitOptions(options) {
  const handlers = {};
  const requestOptions = options == null ? {} : { ...options };
  const signal = requestOptions.signal;
  validateSignal(signal);
  validateCallbacks(requestOptions, HANDLER_KEYS);
  for (const key of HANDLER_KEYS) {
    if (key in requestOptions) {
      handlers[key] = requestOptions[key];
      if (key !== "signal") delete requestOptions[key];
    }
  }
  return { handlers, requestOptions };
}
