import { logHTTP } from "../logging.mjs";

export function logHTTPStreamEvent(logger, event) {
  logHTTP(logger, "stream-event", event);
  if (event?.type === "response.completed") logHTTP(logger, "completed");
}

export function logHTTPStreamFailure(logger, error) {
  logHTTP(logger, "failed", error);
}
