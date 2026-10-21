import { validateCallbacks } from "../validate/callbacks.mjs";
import { validateSignal } from "../validate/signal.mjs";
import { HANDLER_KEYS } from "./keys.mjs";

export function validateCallbackOptions(options) {
  validateSignal(options.signal);
  validateCallbacks(options, HANDLER_KEYS);
}
