import { normalizeEvent } from "../../events/normalize.mjs";
import { responsesErrorFrom } from "../../errors/http-normalize.mjs";
import { logHTTP } from "../logging.mjs";

export function completeHTTPFailure(error, handlers, logger) {
  logHTTP(logger, "failed", error);
  const responseError = responsesErrorFrom(error, { type: "error" });
  handlers.onError?.(responseError, normalizeEvent(responseError.event));
  throw responseError;
}
