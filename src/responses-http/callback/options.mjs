import { extractHandlers } from "./extract-handlers.mjs";
import { validateCallbackOptions } from "./validate-options.mjs";

export function splitOptions(options) {
  const requestOptions = options == null ? {} : { ...options };
  validateCallbackOptions(requestOptions);
  const handlers = extractHandlers(requestOptions);
  return { handlers, requestOptions };
}
