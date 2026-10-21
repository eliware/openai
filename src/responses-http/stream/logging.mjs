import { logHTTP } from "../logging.mjs";

export function logHTTPStreamEvent(logger, event) {
  logHTTP(logger, "stream-event", event);
}
