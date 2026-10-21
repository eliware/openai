import { extractHandlers } from "./extract-handlers.mjs";
import { validateCallbackOptions } from "./validation.mjs";

export function splitOptions(options) {
  const requestOptions = options == null ? {} : { ...options };
  validateCallbackOptions(requestOptions);
  const handlers = extractHandlers(requestOptions);
  return { handlers, requestOptions };
}
