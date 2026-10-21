import { dispatch } from "./callback/dispatch.mjs";
import { normalizeStreamError } from "./stream/errors.mjs";
import { logHTTPStreamEvent } from "./stream/logging.mjs";
import { logHTTP } from "./logging.mjs";

export async function* wrapHTTPStream(stream, handlers, logger) {
  try {
    for await (const event of await stream) {
      logHTTPStreamEvent(logger, event);
      if (event?.type === "response.completed") logHTTP(logger, "completed");
      yield dispatch(event, handlers);
    }
  } catch (error) {
    const responseError = normalizeStreamError(error, handlers);
    logHTTP(logger, "failed", error);
    throw responseError;
  }
}
