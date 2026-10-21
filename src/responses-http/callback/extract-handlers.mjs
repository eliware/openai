import { HANDLER_KEYS } from "./keys.mjs";

export function extractHandlers(requestOptions) {
  const handlers = {};
  for (const key of HANDLER_KEYS) {
    if (key in requestOptions) {
      handlers[key] = requestOptions[key];
      if (key !== "signal") delete requestOptions[key];
    }
  }
  return handlers;
}
